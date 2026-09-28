import * as THREE from 'three';

/**
 * Section 8 — Parallax Depth Map (2.5D Layering)
 */
export const LAYER_DEPTH = {
  HAIR_BACK: 0.0,
  BODY: 0.05,
  ARM_LEFT: 0.06,
  ARM_RIGHT: 0.07,
  FACE: 0.1,
  GLASSES: 0.15,
  EYES: 0.18,
  HAIR_FRONT: 0.2,
  ACCESSORIES: 0.22,
  MOUTH: 0.32,
} as const;

/**
 * Normalized Image Space Pivot Points (0..1 UV space where (0,0) is top-left, (1,1) is bottom-right)
 * Exact pixel-calibrated coordinates for anime_chibi_hero.png (908 x 1016).
 */
export const ANATOMICAL_PIVOTS = {
  ROOT: { u: 0.5, v: 0.5 },
  BODY: { u: 0.5, v: 0.72 },
  HOODIE: { u: 0.5, v: 0.72 }, // Bahu / Shoulder & collar line
  ARM_LEFT: { u: 0.325, v: 0.735 }, // Left shoulder seam joint
  ARM_RIGHT: { u: 0.625, v: 0.735 }, // Right shoulder seam joint
  STRING_LEFT: { u: 0.408, v: 0.79 }, // Left hoodie drawstring eyelet
  STRING_RIGHT: { u: 0.535, v: 0.79 }, // Right hoodie drawstring eyelet
  HEAD: { u: 0.485, v: 0.715 }, // Bagian bawah kepala / Base of head (neck joint below chin)
  HAIR_BACK: { u: 0.485, v: 0.26 }, // Akar rambut belakang
  FACE: { u: 0.485, v: 0.52 },
  EYE_LEFT: { u: 0.3375, v: 0.522 }, // Exact centroid of left pupil (x=306.5, y=531)
  EYE_RIGHT: { u: 0.6024, v: 0.5118 }, // Exact centroid of right pupil (x=547.0, y=520)
  MOUTH: { u: 0.478, v: 0.659 }, // Exact center of chibi mouth (x=434, y=670)
  GLASSES: { u: 0.451, v: 0.505 }, // Bridge kacamata
  EAR_LEFT: { u: 0.205, v: 0.555 }, // Telinga kiri
  EAR_RIGHT: { u: 0.775, v: 0.565 }, // Telinga kanan
  HAIR_FRONT: { u: 0.485, v: 0.2 }, // Area akar rambut depan / Crown root
  ACCESSORIES: { u: 0.485, v: 0.58 },
  EARPHONE_LEFT: { u: 0.212, v: 0.56 },
  EARPHONE_RIGHT: { u: 0.775, v: 0.57 },
  CABLE_LEFT: { u: 0.225, v: 0.61 },
  CABLE_RIGHT: { u: 0.76, v: 0.62 },
} as const;

export interface PartTransformDelta {
  x?: number;
  y?: number;
  z?: number;
  rotationZ?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface RigBone extends THREE.Group {
  userData: {
    restPosition: THREE.Vector3;
    restRotationZ: number;
    restScale: THREE.Vector3;
    uvPivot: { u: number; v: number };
    worldPivot: { x: number; y: number };
    depthZ: number;
    delta: Required<PartTransformDelta>;
  };
}

export interface RigPart {
  name: string;
  bone: RigBone;
  mesh?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  material?: THREE.MeshBasicMaterial;
  geometry?: THREE.PlaneGeometry;
}

export interface LayerConfig {
  name: string;
  texture?: THREE.Texture;
  planeWidth: number;
  planeHeight: number;
  uvPivot: { u: number; v: number };
  depthZ: number;
  renderOrder: number;
  opacity?: number;
  segmented?: { segX: number; segY: number };
}

/**
 * Converts normalized UV coordinates (0..1, top-left origin) to Three.js world plane coordinates
 * centered at (0, 0).
 */
export function uvToPlaneCoords(
  u: number,
  v: number,
  planeWidth: number,
  planeHeight: number
): { x: number; y: number } {
  return {
    x: (u - 0.5) * planeWidth,
    y: (0.5 - v) * planeHeight,
  };
}

/**
 * createBone()
 * Creates an anatomical transform Group (2D bone) positioned at its exact anatomical pivot.
 */
export function createBone(
  name: string,
  uPivot: number,
  vPivot: number,
  depthZ: number,
  planeWidth: number,
  planeHeight: number,
  parentBone?: RigBone
): RigBone {
  const bone = new THREE.Group() as RigBone;
  bone.name = name;

  const parentU = parentBone ? parentBone.userData.uvPivot.u : 0.5;
  const parentV = parentBone ? parentBone.userData.uvPivot.v : 0.5;
  const parentZ = parentBone ? parentBone.userData.depthZ : 0;

  const worldPos = uvToPlaneCoords(uPivot, vPivot, planeWidth, planeHeight);
  const parentPos = uvToPlaneCoords(parentU, parentV, planeWidth, planeHeight);

  const localX = worldPos.x - parentPos.x;
  const localY = worldPos.y - parentPos.y;
  const localZ = depthZ - parentZ;

  bone.position.set(localX, localY, localZ);
  bone.userData = {
    restPosition: new THREE.Vector3(localX, localY, localZ),
    restRotationZ: 0,
    restScale: new THREE.Vector3(1, 1, 1),
    uvPivot: { u: uPivot, v: vPivot },
    worldPivot: { x: worldPos.x, y: worldPos.y },
    depthZ,
    delta: {
      x: 0,
      y: 0,
      z: 0,
      rotationZ: 0,
      scaleX: 1,
      scaleY: 1,
    },
  };

  if (parentBone) {
    parentBone.add(bone);
  }

  return bone;
}

/**
 * setPivot()
 * Offsets a 2D mesh inside its bone Group so rotation and scaling happen around the exact anatomical pivot.
 */
export function setPivot(
  bone: RigBone,
  mesh: THREE.Mesh,
  uPivot: number,
  vPivot: number,
  planeWidth: number,
  planeHeight: number,
  meshCenterU = 0.5,
  meshCenterV = 0.5
): void {
  const pivotPos = uvToPlaneCoords(uPivot, vPivot, planeWidth, planeHeight);
  const meshCenterPos = uvToPlaneCoords(meshCenterU, meshCenterV, planeWidth, planeHeight);
  mesh.position.set(meshCenterPos.x - pivotPos.x, meshCenterPos.y - pivotPos.y, 0);
  if (mesh.parent !== bone) {
    bone.add(mesh);
  }
}

/**
 * createLayer()
 * Creates a transparent 2D PlaneGeometry + MeshBasicMaterial layer for Three.js.
 */
export function createLayer(
  texture: THREE.Texture,
  width: number,
  height: number,
  renderOrder: number,
  opacity = 1,
  segX = 1,
  segY = 1
): {
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
} {
  const geometry = new THREE.PlaneGeometry(width, height, segX, segY);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = renderOrder;
  return { geometry, material, mesh };
}

/**
 * createPart()
 * Combines createBone(), createLayer(), and setPivot() into a single rigged character part.
 */
export function createPart(
  config: LayerConfig,
  parentBone?: RigBone,
  attachMesh = true,
  meshWidth?: number,
  meshHeight?: number,
  meshCenterU = 0.5,
  meshCenterV = 0.5
): RigPart {
  const bone = createBone(
    config.name,
    config.uvPivot.u,
    config.uvPivot.v,
    config.depthZ,
    config.planeWidth,
    config.planeHeight,
    parentBone
  );

  if (!attachMesh || !config.texture) {
    return { name: config.name, bone };
  }

  const w = meshWidth ?? config.planeWidth;
  const h = meshHeight ?? config.planeHeight;
  const segX = config.segmented?.segX ?? 1;
  const segY = config.segmented?.segY ?? 1;

  const { geometry, material, mesh } = createLayer(
    config.texture,
    w,
    h,
    config.renderOrder,
    config.opacity ?? 1,
    segX,
    segY
  );
  mesh.name = `${config.name}_MESH`;

  setPivot(
    bone,
    mesh,
    config.uvPivot.u,
    config.uvPivot.v,
    config.planeWidth,
    config.planeHeight,
    meshCenterU,
    meshCenterV
  );

  return {
    name: config.name,
    bone,
    mesh,
    material,
    geometry,
  };
}

/**
 * animatePart()
 * Applies additive position, rotation, and scale offsets relative to the bone's anatomical rest pose,
 * and records the delta for seamless 2.5D deformer skinning.
 */
export function animatePart(part: RigPart | RigBone, delta: PartTransformDelta): void {
  const bone = 'bone' in part ? part.bone : part;
  const { restPosition, restRotationZ, restScale } = bone.userData;

  const dx = delta.x ?? 0;
  const dy = delta.y ?? 0;
  const dz = delta.z ?? 0;
  const dRot = delta.rotationZ ?? 0;
  const sx = delta.scaleX ?? 1;
  const sy = delta.scaleY ?? 1;

  bone.userData.delta.x = dx;
  bone.userData.delta.y = dy;
  bone.userData.delta.z = dz;
  bone.userData.delta.rotationZ = dRot;
  bone.userData.delta.scaleX = sx;
  bone.userData.delta.scaleY = sy;

  bone.position.set(
    restPosition.x + dx,
    restPosition.y + dy,
    restPosition.z + dz
  );
  bone.rotation.z = restRotationZ + dRot;
  bone.scale.set(
    restScale.x * sx,
    restScale.y * sy,
    restScale.z
  );
}
