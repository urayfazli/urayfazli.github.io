import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import chibi3dNormalSrc from '../assets/images/chibi_3d_hero_figure_1790553670604.jpg';
import chibi3dCozySrc from '../assets/images/chibi_3d_hero_cozy_1790553684649.jpg';
import chibi3dBackSrc from '../assets/images/chibi_3d_hero_back_1790554177408.jpg';
import fallbackNormalSrc from '../assets/images/anime_chibi_hero.png';
import fallbackCozySrc from '../assets/images/anime_chibi_hero_cozy.png';

interface ChibiThreeCharacterProps {
  isPlaying: boolean;
  isDay: boolean;
  tapImpulse?: number;
  isId?: boolean;
  onFallbackTo2D?: () => void;
}

interface StoredCustomCharacter {
  kind: 'model3d' | 'image';
  ext: string;
  name: string;
  buffer: ArrayBuffer;
}

const IDB_NAME = 'uray_3d_character_store_v1';
const IDB_STORE = 'files';
const IDB_KEY = 'active_character';

function openCharacterDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadStoredCharacter(): Promise<StoredCustomCharacter | null> {
  try {
    const db = await openCharacterDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const getReq = store.get(IDB_KEY);
      getReq.onsuccess = () => resolve((getReq.result as StoredCustomCharacter) || null);
      getReq.onerror = () => reject(getReq.error);
    });
  } catch {
    return null;
  }
}

async function saveStoredCharacter(data: StoredCustomCharacter | null): Promise<void> {
  try {
    const db = await openCharacterDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = data ? store.put(data, IDB_KEY) : store.delete(IDB_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore storage errors
  }
}

interface CutoutResult {
  canvas: HTMLCanvasElement;
  imgData: ImageData;
  rowBounds: { left: number; right: number }[];
}

const TEX_SIZE = 512;

/**
 * Loads an image, removes chromakey/solid background with Keylight despill,
 * dilates edge RGB by 2px to prevent side-angle alpha seams, and normalizes to 512x512.
 */
function loadCutoutCanvas(src: string): Promise<CutoutResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const rawCanvas = document.createElement('canvas');
        rawCanvas.width = w;
        rawCanvas.height = h;
        const rawCtx = rawCanvas.getContext('2d', { willReadFrequently: true });
        if (!rawCtx) {
          reject(new Error('No 2d context'));
          return;
        }
        rawCtx.drawImage(img, 0, 0);
        const rawImgData = rawCtx.getImageData(0, 0, w, h);
        const d = rawImgData.data;

        const topLeftAlpha = d[3];
        const topRightAlpha = d[(w - 1) * 4 + 3];
        const alreadyTransparent = topLeftAlpha < 40 && topRightAlpha < 40;

        if (!alreadyTransparent) {
          const tlIdx = (4 * w + 4) * 4;
          const trIdx = (4 * w + Math.max(0, w - 5)) * 4;
          const bgR = Math.round((d[tlIdx] + d[trIdx]) * 0.5);
          const bgG = Math.round((d[tlIdx + 1] + d[trIdx + 1]) * 0.5);
          const bgB = Math.round((d[tlIdx + 2] + d[trIdx + 2]) * 0.5);
          const bgExcess = Math.max(20, bgG - Math.max(bgR, bgB));
          const isGreenKey = bgG > Math.max(bgR, bgB) + 22;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];

            if (isGreenKey) {
              const maxRB = Math.max(r, b);
              const greenExcess = g - maxRB;
              if (greenExcess > 8 && g > 36) {
                const t = Math.min(1, Math.max(0, (greenExcess - 8) / (bgExcess * 0.64)));
                const smoothAlpha = 1 - t * t * (3 - 2 * t);
                d[i + 3] = Math.round(d[i + 3] * smoothAlpha);
                if (smoothAlpha > 0) {
                  d[i + 1] = Math.min(g, Math.round(maxRB * 0.92 + (r + b) * 0.04));
                }
              }
            } else {
              const dr = r - bgR;
              const dg = g - bgG;
              const db = b - bgB;
              const dist = Math.sqrt(dr * dr + dg * dg + db * db);
              if (dist < 30) {
                const alphaFactor = Math.max(0, (dist - 10) / 20);
                d[i + 3] = Math.round(d[i + 3] * alphaFactor);
              }
            }
          }
          rawCtx.putImageData(rawImgData, 0, 0);
        }

        // Find bounding box of non-transparent character pixels
        let minX = w;
        let maxX = 0;
        let minY = h;
        let maxY = 0;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (d[(y * w + x) * 4 + 3] > 60) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX <= minX || maxY <= minY) {
          minX = 0;
          maxX = w - 1;
          minY = 0;
          maxY = h - 1;
        }

        const charW = maxX - minX + 1;
        const charH = maxY - minY + 1;
        const outCanvas = document.createElement('canvas');
        outCanvas.width = TEX_SIZE;
        outCanvas.height = TEX_SIZE;
        const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });
        if (!outCtx) {
          reject(new Error('No output 2d context'));
          return;
        }

        const padTop = Math.round(TEX_SIZE * 0.04);
        const padBottom = Math.round(TEX_SIZE * 0.02);
        const availH = TEX_SIZE - padTop - padBottom;
        const availW = Math.round(TEX_SIZE * 0.88);
        const scale = Math.min(availW / charW, availH / charH);
        const drawW = Math.round(charW * scale);
        const drawH = Math.round(charH * scale);
        const drawX = Math.round((TEX_SIZE - drawW) * 0.5);
        const drawY = TEX_SIZE - padBottom - drawH;

        outCtx.drawImage(rawCanvas, minX, minY, charW, charH, drawX, drawY, drawW, drawH);
        const outImgData = outCtx.getImageData(0, 0, TEX_SIZE, TEX_SIZE);
        const od = outImgData.data;

        const rowBounds: { left: number; right: number }[] = new Array(TEX_SIZE);
        for (let y = 0; y < TEX_SIZE; y++) {
          let left = -1;
          let right = -1;
          for (let x = 0; x < TEX_SIZE; x++) {
            if (od[(y * TEX_SIZE + x) * 4 + 3] > 90) {
              if (left === -1) left = x;
              right = x;
            }
          }
          rowBounds[y] = { left, right };
        }

        resolve({ canvas: outCanvas, imgData: outImgData, rowBounds });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Aligns each scanline of the Back View image to match the exact silhouette bounds
 * of the Front View so the front and back hemispheres stitch together with zero seam!
 */
function createSilhouetteAlignedBackCanvas(
  front: CutoutResult,
  back: CutoutResult
): HTMLCanvasElement {
  const outCanvas = document.createElement('canvas');
  outCanvas.width = TEX_SIZE;
  outCanvas.height = TEX_SIZE;
  const ctx = outCanvas.getContext('2d');
  if (!ctx) return back.canvas;

  const outData = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const od = outData.data;
  const fd = front.imgData.data;
  const bd = back.imgData.data;

  for (let y = 0; y < TEX_SIZE; y++) {
    const fBound = front.rowBounds[y];
    if (fBound.left === -1 || fBound.right <= fBound.left) continue;

    let bBound = back.rowBounds[y];
    let sampleY = y;
    if (bBound.left === -1 || bBound.right <= bBound.left) {
      for (let offset = 1; offset < 50; offset++) {
        if (y + offset < TEX_SIZE && back.rowBounds[y + offset].left !== -1) {
          bBound = back.rowBounds[y + offset];
          sampleY = y + offset;
          break;
        }
        if (y - offset >= 0 && back.rowBounds[y - offset].left !== -1) {
          bBound = back.rowBounds[y - offset];
          sampleY = y - offset;
          break;
        }
      }
    }

    const fSpan = Math.max(1, fBound.right - fBound.left);
    const bSpan = Math.max(1, bBound.right - bBound.left);

    for (let x = fBound.left; x <= fBound.right; x++) {
      const fIdx = (y * TEX_SIZE + x) * 4;
      const fAlpha = fd[fIdx + 3];
      if (fAlpha === 0) continue;

      if (bBound.left !== -1) {
        const normX = (x - fBound.left) / fSpan;
        const bx = Math.min(
          bBound.right,
          Math.max(bBound.left, Math.round(bBound.left + normX * bSpan))
        );
        const bIdx = (sampleY * TEX_SIZE + bx) * 4;
        if (bd[bIdx + 3] > 30) {
          od[fIdx] = bd[bIdx];
          od[fIdx + 1] = bd[bIdx + 1];
          od[fIdx + 2] = bd[bIdx + 2];
          od[fIdx + 3] = 255;
          continue;
        }
      }

      od[fIdx] = Math.round(fd[fIdx] * 0.78);
      od[fIdx + 1] = Math.round(fd[fIdx + 1] * 0.78);
      od[fIdx + 2] = Math.round(fd[fIdx + 2] * 0.82);
      od[fIdx + 3] = 255;
    }
  }

  ctx.putImageData(outData, 0, 0);
  return outCanvas;
}

/**
 * Builds a closed, watertight 360° Volumetric 3D Mesh from the character's silhouette & relief!
 * - Front and Back hemispheres meet at Z = 0 inside the opaque silhouette rim so there is
 *   zero gap from 90° and 270° side views.
 */
function buildVolumetricChibiGeometry(front: CutoutResult): THREE.BufferGeometry {
  const cols = 128;
  const rows = 144;
  const width3D = 2.52;
  const height3D = 2.74;

  const fd = front.imgData.data;
  const rawZ = new Float32Array((cols + 1) * (rows + 1));
  const insideMask = new Uint8Array((cols + 1) * (rows + 1));

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const py = Math.min(TEX_SIZE - 1, Math.max(0, Math.round(v * (TEX_SIZE - 1))));
    const bound = front.rowBounds[py];
    const hasSpan = bound.left !== -1 && bound.right > bound.left + 4;
    const centerPx = hasSpan ? (bound.left + bound.right) * 0.5 : TEX_SIZE * 0.5;
    // Inset half-span slightly so Z reaches 0 inside the fully opaque silhouette rim
    const halfSpanPx = hasSpan ? Math.max(4, (bound.right - bound.left) * 0.485) : 1;

    // Plump 3D Nendoroid/Collectible depth profile: Head (v < 0.62) is thick, Body is compact
    const baseDepth = v < 0.62 ? 0.64 : 0.48;

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const px = Math.min(TEX_SIZE - 1, Math.max(0, Math.round(u * (TEX_SIZE - 1))));
      const pIdx = (py * TEX_SIZE + px) * 4;
      const alpha = fd[pIdx + 3] / 255;
      const idx = r * (cols + 1) + c;

      if (!hasSpan || alpha < 0.35 || px < bound.left || px > bound.right) {
        rawZ[idx] = 0;
        insideMask[idx] = 0;
        continue;
      }

      insideMask[idx] = 1;
      const nx = Math.max(-1, Math.min(1, (px - centerPx) / halfSpanPx));
      const chordZ = Math.pow(Math.max(0, 1 - nx * nx), 0.58);

      const luma = (fd[pIdx] * 0.299 + fd[pIdx + 1] * 0.587 + fd[pIdx + 2] * 0.114) / 255;
      const relief = (luma - 0.35) * 0.065;

      const vTaper =
        v < 0.12
          ? Math.sin((v / 0.12) * (Math.PI * 0.5))
          : v > 0.92
            ? Math.sin(((1 - v) / 0.08) * (Math.PI * 0.5))
            : 1;

      rawZ[idx] = Math.max(0, (chordZ * baseDepth + relief * chordZ) * vTaper);
    }
  }

  // Smooth the depth map over 5 passes while keeping silhouette boundary strictly at Z = 0
  let currZ = rawZ;
  for (let pass = 0; pass < 5; pass++) {
    const nextZ = new Float32Array(currZ.length);
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const idx = r * (cols + 1) + c;
        if (insideMask[idx] === 0) {
          nextZ[idx] = 0;
          continue;
        }
        const isBoundary =
          insideMask[idx - 1] === 0 ||
          insideMask[idx + 1] === 0 ||
          insideMask[idx - (cols + 1)] === 0 ||
          insideMask[idx + (cols + 1)] === 0;
        if (isBoundary) {
          nextZ[idx] = 0;
          continue;
        }

        const sum =
          currZ[idx] * 4 +
          (currZ[idx - 1] +
            currZ[idx + 1] +
            currZ[idx - (cols + 1)] +
            currZ[idx + (cols + 1)]) *
            2 +
          currZ[idx - (cols + 1) - 1] +
          currZ[idx - (cols + 1) + 1] +
          currZ[idx + (cols + 1) - 1] +
          currZ[idx + (cols + 1) + 1];
        nextZ[idx] = sum / 16;
      }
    }
    currZ = nextZ;
  }

  const numVertsPerSide = (cols + 1) * (rows + 1);
  const totalVerts = numVertsPerSide * 2;
  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y3D = (0.5 - v) * height3D;
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x3D = (u - 0.5) * width3D;
      const idx = r * (cols + 1) + c;
      const zVal = currZ[idx];

      // Front vertex
      const fVert = idx;
      positions[fVert * 3] = x3D;
      positions[fVert * 3 + 1] = y3D;
      positions[fVert * 3 + 2] = zVal;
      uvs[fVert * 2] = u;
      uvs[fVert * 2 + 1] = 1 - v;

      // Back vertex (stitched at Z = 0 along the boundary)
      const bVert = numVertsPerSide + idx;
      positions[bVert * 3] = x3D;
      positions[bVert * 3 + 1] = y3D;
      positions[bVert * 3 + 2] = -zVal * 0.96;
      uvs[bVert * 2] = u;
      uvs[bVert * 2 + 1] = 1 - v;
    }
  }

  const frontIndices: number[] = [];
  const backIndices: number[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i00 = r * (cols + 1) + c;
      const i10 = i00 + 1;
      const i01 = (r + 1) * (cols + 1) + c;
      const i11 = i01 + 1;

      if (
        insideMask[i00] === 0 &&
        insideMask[i10] === 0 &&
        insideMask[i01] === 0 &&
        insideMask[i11] === 0
      ) {
        continue;
      }

      frontIndices.push(i00, i01, i10);
      frontIndices.push(i10, i01, i11);

      const b00 = numVertsPerSide + i00;
      const b10 = numVertsPerSide + i10;
      const b01 = numVertsPerSide + i01;
      const b11 = numVertsPerSide + i11;
      backIndices.push(b00, b10, b01);
      backIndices.push(b10, b11, b01);
    }
  }

  const allIndices = new Uint32Array(frontIndices.length + backIndices.length);
  allIndices.set(frontIndices, 0);
  allIndices.set(backIndices, frontIndices.length);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(allIndices, 1));
  geo.addGroup(0, frontIndices.length, 0);
  geo.addGroup(frontIndices.length, backIndices.length, 1);
  geo.computeVertexNormals();

  return geo;
}

/**
 * Full 360° Interactive 3D Collectible Character (Three.js WebGL)
 */
export const ChibiThreeCharacter: React.FC<ChibiThreeCharacterProps> = ({
  isPlaying,
  isDay,
  tapImpulse = 0,
  isId = true,
  onFallbackTo2D,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customChar, setCustomChar] = useState<StoredCustomCharacter | null>(null);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  const isPlayingRef = useRef(isPlaying);
  const isDayRef = useRef(isDay);
  const autoSpinRef = useRef(autoSpin);
  const tapVelocityRef = useRef(0);
  const targetAngleRef = useRef(0);
  const angularVelRef = useRef(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isDayRef.current = isDay;
  }, [isDay]);

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    if (tapImpulse > 0) {
      tapVelocityRef.current = 0.14;
    }
  }, [tapImpulse]);

  useEffect(() => {
    let cancelled = false;
    loadStoredCharacter().then((saved) => {
      if (!cancelled && saved) {
        setCustomChar(saved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const buffer = await file.arrayBuffer();
    const is3DModel = ['glb', 'gltf', 'fbx', 'obj'].includes(ext);
    const record: StoredCustomCharacter = {
      kind: is3DModel ? 'model3d' : 'image',
      ext,
      name: file.name,
      buffer,
    };
    await saveStoredCharacter(record);
    setCustomChar(record);
  }, []);

  const handleResetCustomFile = useCallback(async () => {
    await saveStoredCharacter(null);
    setCustomChar(null);
  }, []);

  const handleSpinStep = useCallback((deltaRad: number) => {
    targetAngleRef.current += deltaRad;
    angularVelRef.current = 0;
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onFallbackTo2D?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;

    const initialW = mount.clientWidth || 350;
    const initialH = mount.clientHeight || 350;
    renderer.setSize(initialW, initialH, false);

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';
    mount.innerHTML = '';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, initialW / initialH, 0.1, 60);
    camera.position.set(0, 0.04, 6.15);
    camera.lookAt(0, -0.02, 0);

    // 360° Studio Collectible Lighting (illuminates front, sides, and back evenly)
    const hemiLight = new THREE.HemisphereLight(0xfffaf0, 0x1e2f4d, 1.6);
    hemiLight.position.set(0, 6, 2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3de, 1.15);
    keyLight.position.set(-2.6, 4.2, 5.5);
    scene.add(keyLight);

    const backKeyLight = new THREE.DirectionalLight(0xfff3de, 1.15);
    backKeyLight.position.set(2.4, 4.0, -5.5);
    scene.add(backKeyLight);

    const leftRimLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    leftRimLight.position.set(-4.5, 2.2, 0);
    scene.add(leftRimLight);

    const rightRimLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    rightRimLight.position.set(4.5, 2.2, 0);
    scene.add(rightRimLight);

    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0.02, 0);
    scene.add(rootGroup);

    // 360° Collectible Turntable Base Pedestal
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.32, 0);
    rootGroup.add(pedestalGroup);

    const baseGeo = new THREE.CylinderGeometry(0.96, 1.04, 0.1, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0d1d35,
      roughness: 0.45,
      metalness: 0.2,
    });
    pedestalGroup.add(new THREE.Mesh(baseGeo, baseMat));

    const ringGeo = new THREE.TorusGeometry(0.97, 0.02, 12, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf5d78e,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0xd99b26,
      emissiveIntensity: 0.22,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.5;
    ringMesh.position.y = 0.045;
    pedestalGroup.add(ringMesh);

    const tickGeo = new THREE.BoxGeometry(0.035, 0.022, 0.11);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeo, ringMat);
      tick.position.set(Math.sin(angle) * 0.88, 0.052, Math.cos(angle) * 0.88);
      tick.rotation.y = angle;
      pedestalGroup.add(tick);
    }

    // Cozy ASMR 3D Floating Sound Rings
    const soundWavesGroup = new THREE.Group();
    soundWavesGroup.visible = false;
    rootGroup.add(soundWavesGroup);

    const waveGeo = new THREE.TorusGeometry(0.22, 0.016, 10, 32, Math.PI * 0.7);
    const leftWave = new THREE.Mesh(waveGeo, ringMat);
    leftWave.position.set(-1.02, 0.25, 0.1);
    leftWave.rotation.z = Math.PI * 0.65;
    soundWavesGroup.add(leftWave);

    const rightWave = new THREE.Mesh(waveGeo, ringMat);
    rightWave.position.set(1.02, 0.25, 0.1);
    rightWave.rotation.z = -Math.PI * 0.35;
    soundWavesGroup.add(rightWave);

    const charHolder = new THREE.Group();
    rootGroup.add(charHolder);

    let cancelled = false;
    let mixer: THREE.AnimationMixer | null = null;
    let frontMatRef: THREE.MeshStandardMaterial | null = null;
    let backMatRef: THREE.MeshStandardMaterial | null = null;
    let normalTexRef: THREE.CanvasTexture | null = null;
    let cozyTexRef: THREE.CanvasTexture | null = null;
    let backTexRef: THREE.CanvasTexture | null = null;
    let charGeoRef: THREE.BufferGeometry | null = null;
    let objectUrlToRevoke: string | null = null;

    if (customChar && customChar.kind === 'model3d') {
      const blob = new Blob([customChar.buffer]);
      objectUrlToRevoke = URL.createObjectURL(blob);

      const fitAndAddModel = (
        model: THREE.Object3D,
        animations: THREE.AnimationClip[] = []
      ) => {
        if (cancelled) return;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.55 / maxDim;
        model.scale.setScalar(scale);
        model.position.set(
          -center.x * scale,
          -box.min.y * scale - 1.26,
          -center.z * scale
        );
        charHolder.add(model);

        if (animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(animations[0]).play();
        }
        setIsReady(true);
      };

      if (customChar.ext === 'glb' || customChar.ext === 'gltf') {
        new GLTFLoader().load(objectUrlToRevoke, (gltf) =>
          fitAndAddModel(gltf.scene, gltf.animations)
        );
      } else if (customChar.ext === 'fbx') {
        new FBXLoader().load(objectUrlToRevoke, (fbx) =>
          fitAndAddModel(fbx, fbx.animations)
        );
      } else if (customChar.ext === 'obj') {
        new OBJLoader().load(objectUrlToRevoke, (obj) => fitAndAddModel(obj));
      }
    } else {
      const build360FromImages = async () => {
        try {
          let customSrc: string | null = null;
          if (customChar && customChar.kind === 'image') {
            const blob = new Blob([customChar.buffer]);
            customSrc = URL.createObjectURL(blob);
            objectUrlToRevoke = customSrc;
          }

          const [frontNormal, frontCozy, backCutout] = await Promise.all([
            loadCutoutCanvas(customSrc || chibi3dNormalSrc),
            loadCutoutCanvas(customSrc || chibi3dCozySrc),
            loadCutoutCanvas(customSrc || chibi3dBackSrc),
          ]);
          if (cancelled) return;

          const alignedBackCanvas = createSilhouetteAlignedBackCanvas(
            frontNormal,
            backCutout
          );

          const normalTex = new THREE.CanvasTexture(frontNormal.canvas);
          normalTex.colorSpace = THREE.SRGBColorSpace;
          normalTex.anisotropy = 4;
          normalTexRef = normalTex;

          const cozyTex = new THREE.CanvasTexture(frontCozy.canvas);
          cozyTex.colorSpace = THREE.SRGBColorSpace;
          cozyTex.anisotropy = 4;
          cozyTexRef = cozyTex;

          const backTex = new THREE.CanvasTexture(alignedBackCanvas);
          backTex.colorSpace = THREE.SRGBColorSpace;
          backTex.anisotropy = 4;
          backTexRef = backTex;

          const geo = buildVolumetricChibiGeometry(frontNormal);
          charGeoRef = geo;

          const frontMat = new THREE.MeshStandardMaterial({
            map: isPlayingRef.current ? cozyTex : normalTex,
            transparent: true,
            alphaTest: 0.15,
            roughness: 0.58,
            metalness: 0.04,
            side: THREE.DoubleSide,
          });
          frontMatRef = frontMat;

          const backMat = new THREE.MeshStandardMaterial({
            map: backTex,
            transparent: true,
            alphaTest: 0.15,
            roughness: 0.62,
            metalness: 0.04,
            side: THREE.DoubleSide,
          });
          backMatRef = backMat;

          const mesh = new THREE.Mesh(geo, [frontMat, backMat]);
          mesh.position.set(0, 0.06, 0);
          charHolder.add(mesh);
          setIsReady(true);
        } catch {
          onFallbackTo2D?.();
        }
      };

      build360FromImages();
    }

    // Full 360° Interactive Turntable Drag + Pointer Capture + Inertia
    let isDragging = false;
    let activePointerId: number | null = null;
    let lastClientX = 0;
    let currentAngle = targetAngleRef.current;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let tapOffsetY = 0;
    let lastReportedDeg = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      activePointerId = e.pointerId;
      lastClientX = e.clientX;
      angularVelRef.current = 0;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if unsupported
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        targetPointerX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.6)));
        targetPointerY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.6)));
      }

      if (isDragging && (activePointerId === null || e.pointerId === activePointerId)) {
        const dx = e.clientX - lastClientX;
        lastClientX = e.clientX;
        const deltaAngle = dx * 0.018;
        targetAngleRef.current += deltaAngle;
        angularVelRef.current = deltaAngle * 0.85;
      }
    };

    const onPointerUpOrCancel = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        activePointerId = null;
        try {
          if (canvas.hasPointerCapture(e.pointerId)) {
            canvas.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUpOrCancel, { passive: true });
    window.addEventListener('pointercancel', onPointerUpOrCancel, { passive: true });

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 350;
      const h = mount.clientHeight || 350;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(mount);
    } else {
      window.addEventListener('resize', handleResize);
    }

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const playing = isPlayingRef.current;

      mixer?.update(delta);

      if (frontMatRef && normalTexRef && cozyTexRef) {
        const desiredMap = playing ? cozyTexRef : normalTexRef;
        if (frontMatRef.map !== desiredMap) {
          frontMatRef.map = desiredMap;
          frontMatRef.needsUpdate = true;
        }
      }

      if (!isDragging) {
        if (autoSpinRef.current) {
          targetAngleRef.current += delta * 1.45;
        } else if (Math.abs(angularVelRef.current) > 0.0002) {
          targetAngleRef.current += angularVelRef.current;
          angularVelRef.current *= 0.93;
        }
      }

      currentAngle += (targetAngleRef.current - currentAngle) * 0.15;
      currentPointerX += (targetPointerX - currentPointerX) * 0.09;
      currentPointerY += (targetPointerY - currentPointerY) * 0.09;

      const normDeg = (((Math.round((currentAngle * 180) / Math.PI) % 360) + 360) % 360);
      if (Math.abs(normDeg - lastReportedDeg) >= 2) {
        lastReportedDeg = normDeg;
        setAngleDeg(normDeg);
      }

      tapOffsetY += tapVelocityRef.current;
      tapVelocityRef.current -= tapOffsetY * 0.25;
      tapVelocityRef.current *= 0.78;

      const squash = 1 + tapOffsetY * 0.14;
      rootGroup.scale.set(
        1 / Math.sqrt(Math.max(0.85, squash)),
        squash,
        1 / Math.sqrt(Math.max(0.85, squash))
      );

      // Full 360° Turntable Rotation
      rootGroup.rotation.y = currentAngle + currentPointerX * 0.12;
      rootGroup.rotation.x = currentPointerY * 0.08 - tapOffsetY * 0.18;

      const breathe = Math.sin(elapsed * (playing ? 4.4 : 2.2)) * (playing ? 0.035 : 0.015);
      charHolder.position.y = breathe;
      charHolder.rotation.z = playing ? Math.sin(elapsed * 2.2) * 0.038 : 0;

      soundWavesGroup.visible = playing;
      if (playing) {
        const s = 1 + Math.sin(elapsed * 5.5) * 0.14;
        leftWave.scale.setScalar(s);
        rightWave.scale.setScalar(s);
      }

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUpOrCancel);
      window.removeEventListener('pointercancel', onPointerUpOrCancel);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      baseGeo.dispose();
      baseMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      tickGeo.dispose();
      waveGeo.dispose();
      charGeoRef?.dispose();
      frontMatRef?.dispose();
      backMatRef?.dispose();
      normalTexRef?.dispose();
      cozyTexRef?.dispose();
      backTexRef?.dispose();
      renderer.dispose();
    };
  }, [customChar, onFallbackTo2D]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFileUpload(file);
      }}
      className="relative h-full w-full select-none"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.fbx,.obj,.png,.webp,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
      />

      {/* Interactive 360° Turntable Controls Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="top-1.5 right-1.5 left-1.5 absolute z-30 flex items-center justify-between gap-1 pointer-events-auto"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSpinStep(-Math.PI * 0.25)}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 font-journal text-[9.5px] font-bold shadow-sm transition-colors ${
              isDay
                ? 'border-[#091526]/80 bg-[#FFFDF7]/90 text-[#091526] hover:bg-[#FCE5A2]'
                : 'border-[#FAF6EE]/70 bg-[#091526]/85 text-[#FAF6EE] hover:border-[#F5D78E] hover:text-[#F5D78E]'
            }`}
            title={isId ? 'Putar Kiri 45°' : 'Rotate Left 45°'}
          >
            ◀
          </button>

          <button
            type="button"
            onClick={() => setAutoSpin((prev) => !prev)}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-0.5 font-journal text-[9.5px] font-bold shadow-sm transition-colors ${
              autoSpin
                ? 'border-[#091526] bg-[#F5D78E] text-[#091526]'
                : isDay
                  ? 'border-[#091526]/80 bg-[#FFFDF7]/90 text-[#091526] hover:bg-[#FCE5A2]'
                  : 'border-[#FAF6EE]/70 bg-[#091526]/85 text-[#FAF6EE] hover:border-[#F5D78E] hover:text-[#F5D78E]'
            }`}
            title={isId ? 'Putar Otomatis 360°' : 'Auto-Spin 360°'}
          >
            ↻ {autoSpin ? '360° ON' : `360° (${angleDeg}°)`}
          </button>

          <button
            type="button"
            onClick={() => handleSpinStep(Math.PI * 0.25)}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 font-journal text-[9.5px] font-bold shadow-sm transition-colors ${
              isDay
                ? 'border-[#091526]/80 bg-[#FFFDF7]/90 text-[#091526] hover:bg-[#FCE5A2]'
                : 'border-[#FAF6EE]/70 bg-[#091526]/85 text-[#FAF6EE] hover:border-[#F5D78E] hover:text-[#F5D78E]'
            }`}
            title={isId ? 'Putar Kanan 45°' : 'Rotate Right 45°'}
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 font-journal text-[9px] font-bold opacity-85 shadow-sm transition-all hover:opacity-100 ${
              isDay
                ? 'border-[#091526]/80 bg-[#FFFDF7]/90 text-[#091526] hover:bg-[#FCE5A2]'
                : 'border-[#FAF6EE]/60 bg-[#091526]/85 text-[#FAF6EE] hover:border-[#F5D78E] hover:text-[#F5D78E]'
            }`}
            title={
              isId
                ? 'Unggah file karakter 3D (.glb, .gltf, .fbx, .obj, .png)'
                : 'Upload 3D character file (.glb, .gltf, .fbx, .obj, .png)'
            }
          >
            {isId ? 'File 3D' : '3D File'}
          </button>
          {customChar && (
            <button
              type="button"
              onClick={handleResetCustomFile}
              className="cursor-pointer whitespace-nowrap rounded-full border border-[#E05A47]/80 bg-[#091526]/90 px-1.5 py-0.5 font-journal text-[9px] font-bold text-[#FAF6EE] hover:bg-[#E05A47]"
              title={isId ? 'Reset karakter default' : 'Reset default character'}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Fallback preview while initial 3D volumetric mesh builds */}
      {!isReady && (
        <img
          src={isPlaying ? fallbackCozySrc : fallbackNormalSrc}
          alt="Uray Fazli Alman 3D Chibi Character"
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 mx-auto block h-full w-full object-contain object-bottom"
        />
      )}

      {/* Three.js 360° Interactive WebGL Viewport */}
      <div
        ref={mountRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
