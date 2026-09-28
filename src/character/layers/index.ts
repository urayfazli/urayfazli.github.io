import * as THREE from 'three';
import { TextureManager } from '../textures';
import { clamp, lerp } from '../../utils/lerp';

export interface SubLayerPatch {
  texture: THREE.CanvasTexture;
  pivotU: number;
  pivotV: number;
  centerU: number;
  centerV: number;
  widthU: number;
  heightV: number;
}

export interface CharacterLayerTextures {
  aspectRatio: number;
  characterBase: THREE.CanvasTexture;
  characterCozy?: THREE.CanvasTexture;
  eyeLeft: SubLayerPatch;
  eyeRight: SubLayerPatch;
  mouthOpen: THREE.CanvasTexture;
  mouthSmile: THREE.CanvasTexture;
  mouthPatch: Omit<SubLayerPatch, 'texture'>;
}

function createOffscreenCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to create 2D canvas context for character layer slicing.');
  }
  return { canvas, ctx };
}

interface ExtractedEyeResult {
  canvas: HTMLCanvasElement;
  centroidU: number;
  centroidV: number;
  centerU: number;
  centerV: number;
  widthU: number;
  heightV: number;
}

/**
 * Red-channel Connected-Component BFS + 2px Dilation + Row-Matched Skin Inpainting.
 * Extracts only the tight bounding box around each pupil to eliminate 98% GPU overdraw.
 */
function extractAndInpaintPupil(
  srcPixels: Uint8ClampedArray,
  cleanFacePixels: Uint8ClampedArray,
  W: number,
  H: number,
  seedU: number,
  seedV: number,
  boxU0: number,
  boxU1: number,
  boxV0: number,
  boxV1: number
): ExtractedEyeResult {
  const minX = Math.max(4, Math.floor(boxU0 * W));
  const maxX = Math.min(W - 5, Math.ceil(boxU1 * W));
  const minY = Math.max(4, Math.floor(boxV0 * H));
  const maxY = Math.min(H - 5, Math.ceil(boxV1 * H));

  const boxW = maxX - minX + 1;
  const boxH = maxY - minY + 1;
  const coreMask = new Uint8Array(boxW * boxH);

  const startX = clamp(Math.round(seedU * W), minX, maxX);
  const startY = clamp(Math.round(seedV * H), minY, maxY);

  const queueX: number[] = [startX];
  const queueY: number[] = [startY];
  coreMask[(startY - minY) * boxW + (startX - minX)] = 1;

  // 1. Flood-fill connected dark pupil pixels using Red channel (R < 228)
  let head = 0;
  while (head < queueX.length) {
    const cx = queueX[head];
    const cy = queueY[head];
    head++;

    const neighbors = [
      [cx - 1, cy],
      [cx + 1, cy],
      [cx, cy - 1],
      [cx, cy + 1],
    ];
    for (let i = 0; i < neighbors.length; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx < minX || nx > maxX || ny < minY || ny < maxY) continue;
      const mIdx = (ny - minY) * boxW + (nx - minX);
      if (coreMask[mIdx]) continue;

      const nIdx = (ny * W + nx) * 4;
      const nR = srcPixels[nIdx];
      const nA = srcPixels[nIdx + 3];

      if (nA > 120 && nR < 228) {
        coreMask[mIdx] = 1;
        queueX.push(nx);
        queueY.push(ny);
      }
    }
  }

  // 2. Dilate the connected pupil mask by 2px to capture all sub-pixel anti-aliased border pixels
  const dilatedMask = new Uint8Array(boxW * boxH);
  const dilateRadius = 2;
  for (let by = 0; by < boxH; by++) {
    for (let bx = 0; bx < boxW; bx++) {
      if (!coreMask[by * boxW + bx]) continue;
      for (let dy = -dilateRadius; dy <= dilateRadius; dy++) {
        for (let dx = -dilateRadius; dx <= dilateRadius; dx++) {
          const nx = bx + dx;
          const ny = by + dy;
          if (nx >= 0 && nx < boxW && ny >= 0 && ny < boxH) {
            dilatedMask[ny * boxW + nx] = 1;
          }
        }
      }
    }
  }

  // 3. Extract crisp alpha-matted pupil into tight sub-canvas & row-matched skin inpainting on cleanFacePixels
  const { canvas: eyeCanvas, ctx: eyeCtx } = createOffscreenCanvas(boxW, boxH);
  const eyeImgData = eyeCtx.createImageData(boxW, boxH);
  const eyeOut = eyeImgData.data;

  let sumWeightedX = 0;
  let sumWeightedY = 0;
  let sumWeights = 0;

  for (let by = 0; by < boxH; by++) {
    const y = minY + by;

    // Sample clean skin on this exact row just outside the left and right of the pupil box
    const leftSampleIdx = (y * W + (minX - 2)) * 4;
    const rightSampleIdx = (y * W + (maxX + 2)) * 4;
    const lR = srcPixels[leftSampleIdx] || 255;
    const lG = srcPixels[leftSampleIdx + 1] || 199;
    const lB = srcPixels[leftSampleIdx + 2] || 152;
    const rR = srcPixels[rightSampleIdx] || 255;
    const rG = srcPixels[rightSampleIdx + 1] || 199;
    const rB = srcPixels[rightSampleIdx + 2] || 152;

    for (let bx = 0; bx < boxW; bx++) {
      if (!dilatedMask[by * boxW + bx]) continue;
      const x = minX + bx;
      const tRow = bx / Math.max(1, boxW - 1);

      const rowSkinR = Math.round(lerp(lR, rR, tRow));
      const rowSkinG = Math.round(lerp(lG, rG, tRow));
      const rowSkinB = Math.round(lerp(lB, rB, tRow));

      const idx = (y * W + x) * 4;
      const outIdx = (by * boxW + bx) * 4;
      const r = srcPixels[idx];

      // Exact Red-channel alpha matting against rowSkinR
      const alpha = clamp((rowSkinR - r) / Math.max(20, rowSkinR - 4), 0, 1);
      if (alpha > 0.015) {
        eyeOut[outIdx] = 5;
        eyeOut[outIdx + 1] = 8;
        eyeOut[outIdx + 2] = 15;
        eyeOut[outIdx + 3] = Math.round(alpha * 255);

        sumWeightedX += x * alpha;
        sumWeightedY += y * alpha;
        sumWeights += alpha;
      }

      // Seamlessly inpaint the pupil socket on the base face with row-matched skin color
      cleanFacePixels[idx] = rowSkinR;
      cleanFacePixels[idx + 1] = rowSkinG;
      cleanFacePixels[idx + 2] = rowSkinB;
      cleanFacePixels[idx + 3] = 255;
    }
  }

  eyeCtx.putImageData(eyeImgData, 0, 0);

  const centroidU = sumWeights > 0 ? sumWeightedX / sumWeights / W : seedU;
  const centroidV = sumWeights > 0 ? sumWeightedY / sumWeights / H : seedV;
  const centerU = (minX + boxW * 0.5) / W;
  const centerV = (minY + boxH * 0.5) / H;

  return {
    canvas: eyeCanvas,
    centroidU,
    centroidV,
    centerU,
    centerV,
    widthU: boxW / W,
    heightV: boxH / H,
  };
}

/**
 * Inpaints the static smile on both base and cozy textures (x: 400..468, y: 654..684)
 * with row-matched warm peach skin so the rigged 2D MOUTH bone can render both
 * calm idle smiles and talking expressions without double-mouth overlap or missing mouth.
 */
function inpaintMouthRegion(
  pixels: Uint8ClampedArray,
  W: number,
  H: number
): void {
  const minX = Math.floor(0.435 * W);
  const maxX = Math.ceil(0.52 * W);
  const minY = Math.floor(0.642 * H);
  const maxY = Math.ceil(0.678 * H);

  for (let y = minY; y <= maxY; y++) {
    const leftIdx = (y * W + (minX - 3)) * 4;
    const rightIdx = (y * W + (maxX + 3)) * 4;
    const lR = pixels[leftIdx] || 253;
    const lG = pixels[leftIdx + 1] || 199;
    const lB = pixels[leftIdx + 2] || 152;
    const rR = pixels[rightIdx] || 253;
    const rG = pixels[rightIdx + 1] || 199;
    const rB = pixels[rightIdx + 2] || 152;

    for (let x = minX; x <= maxX; x++) {
      const idx = (y * W + x) * 4;
      const t = (x - minX) / Math.max(1, maxX - minX);
      pixels[idx] = Math.round(lerp(lR, rR, t));
      pixels[idx + 1] = Math.round(lerp(lG, rG, t));
      pixels[idx + 2] = Math.round(lerp(lB, rB, t));
      pixels[idx + 3] = 255;
    }
  }
}

/**
 * Builds the two cropped 2D Rig mouth textures (`mouthOpen` for active vowel syllables and
 * `mouthSmile` for idle/consonant closures & happy expression) centered at (434, 670)
 * on the 908x1016 reference coordinate system.
 */
function createRiggedMouthCanvases(
  W: number,
  H: number
): {
  openCanvas: HTMLCanvasElement;
  smileCanvas: HTMLCanvasElement;
  mouthPatch: Omit<SubLayerPatch, 'texture'>;
} {
  const refW = 908;
  const refH = 1016;
  const cx = 434;
  const cy = 670;
  const patchRefW = 76;
  const patchRefH = 56;
  const localCx = patchRefW * 0.5;
  const localCy = patchRefH * 0.5;

  const sx = W / refW;
  const sy = H / refH;
  const canvasW = Math.max(16, Math.round(patchRefW * sx));
  const canvasH = Math.max(16, Math.round(patchRefH * sy));

  // 1. Open Talking Mouth (`mouthOpen`): Cute anime "D" / rounded triangular open mouth with warm pink tongue
  const { canvas: openCanvas, ctx: openCtx } = createOffscreenCanvas(canvasW, canvasH);
  openCtx.save();
  openCtx.scale(canvasW / patchRefW, canvasH / patchRefH);
  openCtx.lineCap = 'round';
  openCtx.lineJoin = 'round';

  const traceOpenMouth = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(localCx - 21, localCy - 6);
    ctx.quadraticCurveTo(localCx, localCy - 9.5, localCx + 21, localCy - 7.5);
    ctx.bezierCurveTo(localCx + 23, localCy + 5, localCx + 14, localCy + 18, localCx, localCy + 18.5);
    ctx.bezierCurveTo(localCx - 14, localCy + 18, localCx - 23, localCy + 6, localCx - 21, localCy - 6);
    ctx.closePath();
  };

  traceOpenMouth(openCtx);
  openCtx.fillStyle = '#7E2B33';
  openCtx.fill();

  openCtx.save();
  traceOpenMouth(openCtx);
  openCtx.clip();

  openCtx.beginPath();
  openCtx.arc(localCx + 1, localCy + 17, 15.5, Math.PI * 1.05, Math.PI * 1.95, false);
  openCtx.closePath();
  const tongueGrad = openCtx.createLinearGradient(localCx, localCy + 2, localCx, localCy + 19);
  tongueGrad.addColorStop(0, '#FF9E99');
  tongueGrad.addColorStop(1, '#E56B6F');
  openCtx.fillStyle = tongueGrad;
  openCtx.fill();

  openCtx.beginPath();
  openCtx.moveTo(localCx - 16, localCy - 7);
  openCtx.quadraticCurveTo(localCx, localCy - 9.5, localCx + 16, localCy - 8);
  openCtx.lineTo(localCx + 14, localCy - 3.5);
  openCtx.quadraticCurveTo(localCx, localCy - 5, localCx - 14, localCy - 3);
  openCtx.closePath();
  openCtx.fillStyle = '#FFFDF9';
  openCtx.fill();

  openCtx.restore();

  traceOpenMouth(openCtx);
  openCtx.strokeStyle = '#0B1424';
  openCtx.lineWidth = 6.0;
  openCtx.stroke();
  openCtx.restore();

  // 2. Smiling / Closed-Syllable Mouth (`mouthSmile`): Matches the exact curved anime smile at (434, 670)
  const { canvas: smileCanvas, ctx: smileCtx } = createOffscreenCanvas(canvasW, canvasH);
  smileCtx.save();
  smileCtx.scale(canvasW / patchRefW, canvasH / patchRefH);
  smileCtx.lineCap = 'round';
  smileCtx.lineJoin = 'round';

  smileCtx.beginPath();
  smileCtx.moveTo(localCx - 22, localCy - 5);
  smileCtx.bezierCurveTo(
    localCx - 12,
    localCy + 10,
    localCx + 11,
    localCy + 9,
    localCx + 22,
    localCy - 7
  );
  smileCtx.strokeStyle = '#0B1424';
  smileCtx.lineWidth = 6.5;
  smileCtx.stroke();

  smileCtx.restore();

  const pivotU = cx / refW;
  const pivotV = cy / refH;

  return {
    openCanvas,
    smileCanvas,
    mouthPatch: {
      pivotU,
      pivotV,
      centerU: pivotU,
      centerV: pivotV,
      widthU: patchRefW / refW,
      heightV: patchRefH / refH,
    },
  };
}

/**
 * Builds the spotless eyeless/mouthless base texture, crisp cropped EYE_LEFT / EYE_RIGHT
 * textures, and cropped rigged MOUTH textures (`mouthOpen` & `mouthSmile`) directly from anime_chibi_hero.png.
 */
export function buildCharacterLayerTextures(
  heroImg: HTMLImageElement,
  textureManager: TextureManager,
  cozyImg?: HTMLImageElement
): CharacterLayerTextures {
  const W = heroImg.naturalWidth || 908;
  const H = heroImg.naturalHeight || 1016;
  const aspectRatio = W / H;

  const { canvas: srcCanvas, ctx: srcCtx } = createOffscreenCanvas(W, H);
  srcCtx.drawImage(heroImg, 0, 0, W, H);
  const srcData = srcCtx.getImageData(0, 0, W, H);
  const srcPixels = srcData.data;

  // Base character canvas with pupils and static mouth cleanly inpainted with row-matched skin tone
  const { canvas: baseCanvas, ctx: baseCtx } = createOffscreenCanvas(W, H);
  const baseData = baseCtx.createImageData(W, H);
  baseData.data.set(srcPixels);

  // Extract Left Pupil (exact pixel range x: 286..329, y: 471..593 -> u: [0.305..0.370], v: [0.455..0.595])
  const leftEye = extractAndInpaintPupil(
    srcPixels,
    baseData.data,
    W,
    H,
    0.3375,
    0.522,
    0.305,
    0.37,
    0.455,
    0.595
  );

  // Extract Right Pupil (exact pixel range x: 526..569, y: 458..582 -> u: [0.570..0.635], v: [0.442..0.585])
  const rightEye = extractAndInpaintPupil(
    srcPixels,
    baseData.data,
    W,
    H,
    0.6024,
    0.5118,
    0.57,
    0.635,
    0.442,
    0.585
  );

  // Inpaint static mouth on base character so rigged MOUTH layer never causes a double-mouth artifact
  inpaintMouthRegion(baseData.data, W, H);
  baseCtx.putImageData(baseData, 0, 0);

  // Build cropped 2D Rig Mouth textures (`mouthOpen` and `mouthSmile`)
  const { openCanvas, smileCanvas, mouthPatch } = createRiggedMouthCanvases(W, H);

  // Optional Cozy expression full texture (with static mouth cleanly inpainted so MOUTH bone controls it)
  let cozyTexture: THREE.CanvasTexture | undefined;
  if (cozyImg) {
    const { canvas: cozyCanvas, ctx: cozyCtx } = createOffscreenCanvas(W, H);
    cozyCtx.drawImage(cozyImg, 0, 0, W, H);
    const cozyData = cozyCtx.getImageData(0, 0, W, H);
    inpaintMouthRegion(cozyData.data, W, H);
    cozyCtx.putImageData(cozyData, 0, 0);
    cozyTexture = textureManager.registerCanvasTexture(cozyCanvas);
  }

  return {
    aspectRatio,
    characterBase: textureManager.registerCanvasTexture(baseCanvas),
    characterCozy: cozyTexture,
    eyeLeft: {
      texture: textureManager.registerCanvasTexture(leftEye.canvas),
      pivotU: leftEye.centroidU,
      pivotV: leftEye.centroidV,
      centerU: leftEye.centerU,
      centerV: leftEye.centerV,
      widthU: leftEye.widthU,
      heightV: leftEye.heightV,
    },
    eyeRight: {
      texture: textureManager.registerCanvasTexture(rightEye.canvas),
      pivotU: rightEye.centroidU,
      pivotV: rightEye.centroidV,
      centerU: rightEye.centerU,
      centerV: rightEye.centerV,
      widthU: rightEye.widthU,
      heightV: rightEye.heightV,
    },
    mouthOpen: textureManager.registerCanvasTexture(openCanvas),
    mouthSmile: textureManager.registerCanvasTexture(smileCanvas),
    mouthPatch,
  };
}
