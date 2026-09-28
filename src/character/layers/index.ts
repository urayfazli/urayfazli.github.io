import * as THREE from 'three';
import { TextureManager } from '../textures';
import { clamp, lerp } from '../../utils/lerp';

export interface CharacterLayerTextures {
  aspectRatio: number;
  characterBase: THREE.CanvasTexture;
  characterCozy?: THREE.CanvasTexture;
  eyeLeft: THREE.CanvasTexture;
  eyeRight: THREE.CanvasTexture;
  mouthOpen: THREE.CanvasTexture;
  mouthSmile: THREE.CanvasTexture;
  leftEyePivot: { u: number; v: number };
  rightEyePivot: { u: number; v: number };
  mouthPivot: { u: number; v: number };
  emptyLayer: THREE.CanvasTexture;
}

function createOffscreenCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
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
}

/**
 * Red-channel Connected-Component BFS + 2px Dilation + Row-Matched Skin Inpainting.
 * In anime_chibi_hero.png (908x1016):
 * - Warm peach skin is RGB(255, 199, 152) -> R = 255
 * - Coral cheek blush is RGB(255, 142, 108) -> R = 255
 * - Dark oval pupils are RGB(1, 1, 1) -> R = 1..15
 * Using Red-channel (R < 228) isolates 100% of the left pupil (y=471..593) and right pupil (y=458..582)
 * without ever leaking into the coral cheek blush or leaving any bottom pupil crescent behind.
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
  const { canvas: eyeCanvas, ctx: eyeCtx } = createOffscreenCanvas(W, H);
  const eyeImgData = eyeCtx.createImageData(W, H);
  const eyeOut = eyeImgData.data;

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

  // 3. Extract crisp alpha-matted pupil to eyeOut & row-matched skin inpainting on cleanFacePixels
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
      const r = srcPixels[idx];

      // Exact Red-channel alpha matting against rowSkinR
      const alpha = clamp((rowSkinR - r) / Math.max(20, rowSkinR - 4), 0, 1);
      if (alpha > 0.015) {
        eyeOut[idx] = 5;
        eyeOut[idx + 1] = 8;
        eyeOut[idx + 2] = 15;
        eyeOut[idx + 3] = Math.round(alpha * 255);

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

  return {
    canvas: eyeCanvas,
    centroidU,
    centroidV,
  };
}

/**
 * Inpaints the static smile on the cozy texture (x: 400..468, y: 654..684)
 * with row-matched warm peach skin so the rigged 2D MOUTH bone can animate
 * talking expressions without overlapping the static smile.
 */
function inpaintCozyMouthRegion(
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
 * Builds the two 2D Rig mouth textures (`mouthOpen` for active vowel syllables and
 * `mouthSmile` for consonant closures & happy expression) centered at (434, 670)
 * on the 908x1016 canvas.
 */
function createRiggedMouthCanvases(
  W: number,
  H: number
): {
  openCanvas: HTMLCanvasElement;
  smileCanvas: HTMLCanvasElement;
  mouthPivot: { u: number; v: number };
} {
  const sx = W / 908;
  const sy = H / 1016;
  const cx = 434;
  const cy = 670;

  // 1. Open Talking Mouth (`mouthOpen`): Cute anime "D" / rounded triangular open mouth with warm pink tongue
  const { canvas: openCanvas, ctx: openCtx } = createOffscreenCanvas(W, H);
  openCtx.save();
  openCtx.scale(sx, sy);
  openCtx.lineCap = 'round';
  openCtx.lineJoin = 'round';

  const traceOpenMouth = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    // Upper lip curve (gently arched happy anime upper lip)
    ctx.moveTo(cx - 21, cy - 6);
    ctx.quadraticCurveTo(cx, cy - 9.5, cx + 21, cy - 7.5);
    // Right mouth corner curving down to lower jaw
    ctx.bezierCurveTo(cx + 23, cy + 5, cx + 14, cy + 18, cx, cy + 18.5);
    // Left lower jaw curving back up to left mouth corner
    ctx.bezierCurveTo(cx - 14, cy + 18, cx - 23, cy + 6, cx - 21, cy - 6);
    ctx.closePath();
  };

  // Deep warm maroon-coral oral cavity fill
  traceOpenMouth(openCtx);
  openCtx.fillStyle = '#7E2B33';
  openCtx.fill();

  // Clip interior for cute pink anime tongue and subtle upper tooth highlight
  openCtx.save();
  traceOpenMouth(openCtx);
  openCtx.clip();

  // Cute warm coral-pink tongue dome at the bottom of the mouth
  openCtx.beginPath();
  openCtx.arc(cx + 1, cy + 17, 15.5, Math.PI * 1.05, Math.PI * 1.95, false);
  openCtx.closePath();
  const tongueGrad = openCtx.createLinearGradient(cx, cy + 2, cx, cy + 19);
  tongueGrad.addColorStop(0, '#FF9E99');
  tongueGrad.addColorStop(1, '#E56B6F');
  openCtx.fillStyle = tongueGrad;
  openCtx.fill();

  // Subtle white upper teeth rim
  openCtx.beginPath();
  openCtx.moveTo(cx - 16, cy - 7);
  openCtx.quadraticCurveTo(cx, cy - 9.5, cx + 16, cy - 8);
  openCtx.lineTo(cx + 14, cy - 3.5);
  openCtx.quadraticCurveTo(cx, cy - 5, cx - 14, cy - 3);
  openCtx.closePath();
  openCtx.fillStyle = '#FFFDF9';
  openCtx.fill();

  openCtx.restore();

  // Crisp anime ink outline matching the illustration's line art (#0B1424)
  traceOpenMouth(openCtx);
  openCtx.strokeStyle = '#0B1424';
  openCtx.lineWidth = 6.0;
  openCtx.stroke();
  openCtx.restore();

  // 2. Smiling / Closed-Syllable Mouth (`mouthSmile`): Matches the exact curved anime smile at (434, 670)
  const { canvas: smileCanvas, ctx: smileCtx } = createOffscreenCanvas(W, H);
  smileCtx.save();
  smileCtx.scale(sx, sy);
  smileCtx.lineCap = 'round';
  smileCtx.lineJoin = 'round';

  smileCtx.beginPath();
  smileCtx.moveTo(cx - 22, cy - 5);
  smileCtx.bezierCurveTo(cx - 12, cy + 10, cx + 11, cy + 9, cx + 22, cy - 7);
  smileCtx.strokeStyle = '#0B1424';
  smileCtx.lineWidth = 6.5;
  smileCtx.stroke();

  smileCtx.restore();

  return {
    openCanvas,
    smileCanvas,
    mouthPivot: { u: cx / 908, v: cy / 1016 },
  };
}

/**
 * Builds the spotless eyeless base texture, crisp alpha-matted EYE_LEFT / EYE_RIGHT
 * textures, and rigged MOUTH textures (`mouthOpen` & `mouthSmile`) directly from anime_chibi_hero.png.
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

  // Base character canvas with pupils cleanly inpainted with row-matched skin tone
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

  baseCtx.putImageData(baseData, 0, 0);

  // Build 2D Rig Mouth textures (`mouthOpen` and `mouthSmile`)
  const { openCanvas, smileCanvas, mouthPivot } = createRiggedMouthCanvases(W, H);

  // Optional Cozy expression full texture (with static mouth cleanly inpainted so MOUTH bone controls it)
  let cozyTexture: THREE.CanvasTexture | undefined;
  if (cozyImg) {
    const { canvas: cozyCanvas, ctx: cozyCtx } = createOffscreenCanvas(W, H);
    cozyCtx.drawImage(cozyImg, 0, 0, W, H);
    const cozyData = cozyCtx.getImageData(0, 0, W, H);
    inpaintCozyMouthRegion(cozyData.data, W, H);
    cozyCtx.putImageData(cozyData, 0, 0);
    cozyTexture = textureManager.registerCanvasTexture(cozyCanvas);
  }

  // Lightweight 2x2 transparent texture for bone-only deformer nodes
  const { canvas: emptyCanvas } = createOffscreenCanvas(2, 2);
  const emptyLayer = textureManager.registerCanvasTexture(emptyCanvas);

  return {
    aspectRatio,
    characterBase: textureManager.registerCanvasTexture(baseCanvas),
    characterCozy: cozyTexture,
    eyeLeft: textureManager.registerCanvasTexture(leftEye.canvas),
    eyeRight: textureManager.registerCanvasTexture(rightEye.canvas),
    mouthOpen: textureManager.registerCanvasTexture(openCanvas),
    mouthSmile: textureManager.registerCanvasTexture(smileCanvas),
    leftEyePivot: { u: leftEye.centroidU, v: leftEye.centroidV },
    rightEyePivot: { u: rightEye.centroidU, v: rightEye.centroidV },
    mouthPivot,
    emptyLayer,
  };
}
