import * as THREE from 'three';
import {
  ANATOMICAL_PIVOTS,
  LAYER_DEPTH,
  RigBone,
  RigPart,
  animatePart,
  createBone,
  createLayer,
  createPart,
} from '../character/rig';
import { TextureManager } from '../character/textures';
import {
  CharacterLayerTextures,
  buildCharacterLayerTextures,
} from '../character/layers';
import {
  AnimationController,
  CharacterAnimationState,
  PlayableAnimationName,
} from '../character/animations';
import { SpringState, clamp, damp, lerp, stepSpring } from '../utils/lerp';

export interface CharacterRigOptions {
  container: HTMLElement;
  heroImageSrc: string;
  cozyImageSrc?: string;
  onAnimationTrigger?: (anim: PlayableAnimationName | string) => void;
  onTap?: () => void;
}

interface RigPartsMap {
  ROOT: RigBone;
  BODY: RigBone;
  HOODIE: RigPart;
  ARM_LEFT: RigPart;
  ARM_RIGHT: RigPart;
  STRING_LEFT: RigPart;
  STRING_RIGHT: RigPart;
  HEAD: RigBone;
  HAIR_BACK: RigPart;
  FACE: RigPart;
  EYE_LEFT: RigPart;
  EYE_RIGHT: RigPart;
  MOUTH: RigPart;
  GLASSES: RigPart;
  EAR_LEFT: RigPart;
  EAR_RIGHT: RigPart;
  HAIR_FRONT: RigPart;
  ACCESSORIES: RigBone;
  EARPHONE_LEFT: RigPart;
  EARPHONE_RIGHT: RigPart;
  CABLE_LEFT: RigPart;
  CABLE_RIGHT: RigPart;
}

interface VertexSkinWeight {
  x0: number;
  y0: number;
  z0: number;
  u: number;
  v: number;
  wHead: number;
  wBody: number;
  wArmLeft: number;
  wArmRight: number;
  wHairFront: number;
  wHairBack: number;
  wGlasses: number;
  wCableLeft: number;
  wCableRight: number;
  wStringLeft: number;
  wStringRight: number;
  wBottomAnchor: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * CharacterRig
 * Interactive 2.5D Three.js Character Rig System for Web3 Portfolio Hero Section.
 *
 * Exposes the exact API specified:
 * - character.init()
 * - character.update(delta)
 * - character.setMousePosition(x, y)
 * - character.playAnimation("wave" | "greet" | "blink" | "idle" | "head_tilt" | "happy")
 * - character.dispose()
 */
export class CharacterRig {
  private container: HTMLElement;
  private heroImageSrc: string;
  private cozyImageSrc?: string;
  private onAnimationTrigger?: (anim: PlayableAnimationName | string) => void;
  private onTap?: () => void;

  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer | null = null;
  private customTextureManager = new TextureManager();
  private animationController = new AnimationController();
  private parts: RigPartsMap | null = null;
  private textures: CharacterLayerTextures | null = null;

  // Seamless 2.5D Deformer Mesh driven by the hierarchical RigBones
  private characterMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null =
    null;
  private cozyMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null =
    null;
  private skinWeights: VertexSkinWeight[] = [];

  private planeWidth = 1.7874;
  private planeHeight = 2.0;

  // Animation loop state
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private isInitialized = false;
  private isDisposed = false;
  private isCozyMode = false;
  private isBubbleActive = false;

  // Accessibility: prefers-reduced-motion
  private reducedMotion = false;
  private reducedMotionQuery: MediaQueryList | null = null;

  // Normalized pointer tracking [-1, 1]
  private targetMouseX = 0;
  private targetMouseY = 0;
  private currentMouseX = 0;
  private currentMouseY = 0;
  private isHovering = false;
  private hoverBlend = 0;
  private lastTouchTime = 0;

  // Smoothed HEAD bone state to prevent any frame discontinuities on state transitions
  private smoothedHeadX = 0;
  private smoothedHeadY = 0;
  private smoothedHeadRotZ = 0;

  // Glasses 30-60ms lag state (Section 10)
  private glassesLagX = 0;
  private glassesLagY = 0;
  private glassesLagRotZ = 0;

  // Hair & Cable secondary spring states (Sections 9 & 11)
  private hairBackSpringX: SpringState = { value: 0, velocity: 0 };
  private hairBackSpringY: SpringState = { value: 0, velocity: 0 };
  private hairBackSpringRot: SpringState = { value: 0, velocity: 0 };

  private hairFrontSpringX: SpringState = { value: 0, velocity: 0 };
  private hairFrontSpringY: SpringState = { value: 0, velocity: 0 };
  private hairFrontSpringRot: SpringState = { value: 0, velocity: 0 };

  private cableLeftSpringRot: SpringState = { value: 0, velocity: 0 };
  private cableRightSpringRot: SpringState = { value: 0, velocity: 0 };

  // Bound DOM listeners for clean removal in dispose()
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isInViewport = true;
  private boundResize: () => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: () => void;
  private boundDeviceOrientation: (e: DeviceOrientationEvent) => void;
  private boundMouseEnter: () => void;
  private boundMouseLeave: () => void;
  private boundClick: (e: MouseEvent) => void;
  private boundReducedMotionChange: (e: MediaQueryListEvent) => void;
  private boundVisibilityChange: () => void;

  constructor(options: CharacterRigOptions) {
    this.container = options.container;
    this.heroImageSrc = options.heroImageSrc;
    this.cozyImageSrc = options.cozyImageSrc;
    this.onAnimationTrigger = options.onAnimationTrigger;
    this.onTap = options.onTap;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    this.boundResize = this.handleResize.bind(this);
    this.boundMouseMove = this.handleWindowMouseMove.bind(this);
    this.boundTouchMove = this.handleWindowTouchMove.bind(this);
    this.boundTouchEnd = this.handleWindowTouchEnd.bind(this);
    this.boundDeviceOrientation = this.handleDeviceOrientation.bind(this);
    this.boundMouseEnter = this.handleMouseEnter.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
    this.boundClick = this.handleContainerClick.bind(this);
    this.boundReducedMotionChange = this.handleReducedMotionChange.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * character.init()
   * Initializes WebGLRenderer, loads & inpaints the reference PNG texture layers,
   * builds the hierarchical 2D bone tree + seamless 2.5D deformer mesh, and starts the 60 FPS loop.
   */
  public async init(): Promise<void> {
    if (this.isInitialized || this.isDisposed) return;

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.reducedMotionQuery.matches;
      this.reducedMotionQuery.addEventListener('change', this.boundReducedMotionChange);
    }

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      if (!this.isDisposed && this.renderer) {
        this.update(0.016);
      }
    });

    this.container.appendChild(canvas);
    this.handleResize();

    const [heroImg, cozyImg] = await Promise.all([
      this.customTextureManager.loadImageElement(this.heroImageSrc),
      this.cozyImageSrc
        ? this.customTextureManager.loadImageElement(this.cozyImageSrc).catch(() => undefined)
        : Promise.resolve(undefined),
    ]);

    if (this.isDisposed) return;

    this.textures = buildCharacterLayerTextures(
      heroImg,
      this.customTextureManager,
      cozyImg
    );
    this.planeHeight = 2.0;
    this.planeWidth = this.planeHeight * this.textures.aspectRatio;

    this.buildHierarchy(this.textures);
    this.handleResize();

    window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    window.addEventListener('touchmove', this.boundTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', this.boundDeviceOrientation, {
      passive: true,
    });
    document.addEventListener('visibilitychange', this.boundVisibilityChange);
    this.container.addEventListener('mouseenter', this.boundMouseEnter);
    this.container.addEventListener('mouseleave', this.boundMouseLeave);
    if (this.onTap || this.onAnimationTrigger) {
      this.container.addEventListener('click', this.boundClick);
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this.boundResize, { passive: true });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            this.isInViewport = entry.isIntersecting;
            if (this.isInViewport) {
              this.lastFrameTime = performance.now();
              this.ensureLoopRunning();
            }
          }
        },
        { rootMargin: '120px' }
      );
      this.intersectionObserver.observe(this.container);
    }

    this.isInitialized = true;
    this.lastFrameTime = performance.now();
    this.update(0.016);
    this.ensureLoopRunning();
  }

  /**
   * Builds the full hierarchical 2D Bone Rig (Sections 1 & 3) with ARM_LEFT and ARM_RIGHT
   * unified into BODY, and binds the seamless 2.5D deformer grid + crisp EYE_LEFT / EYE_RIGHT layers.
   */
  private buildHierarchy(tex: CharacterLayerTextures): void {
    const W = this.planeWidth;
    const H = this.planeHeight;

    // 1. ROOT Bone centered at (0.5, 0.5)
    const ROOT = createBone(
      'ROOT',
      ANATOMICAL_PIVOTS.ROOT.u,
      ANATOMICAL_PIVOTS.ROOT.v,
      0,
      W,
      H
    );
    this.scene.add(ROOT);

    // 2. BODY Hierarchy (includes HOODIE, unified proportional ARM_LEFT & ARM_RIGHT, and STRINGS)
    const BODY = createBone(
      'BODY',
      ANATOMICAL_PIVOTS.BODY.u,
      ANATOMICAL_PIVOTS.BODY.v,
      LAYER_DEPTH.BODY,
      W,
      H,
      ROOT
    );

    const HOODIE = createPart(
      {
        name: 'HOODIE',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.HOODIE,
        depthZ: LAYER_DEPTH.BODY,
        renderOrder: 10,
      },
      BODY,
      false
    );

    const ARM_LEFT = createPart(
      {
        name: 'ARM_LEFT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.ARM_LEFT,
        depthZ: LAYER_DEPTH.ARM_LEFT,
        renderOrder: 11,
      },
      BODY,
      false
    );

    const ARM_RIGHT = createPart(
      {
        name: 'ARM_RIGHT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.ARM_RIGHT,
        depthZ: LAYER_DEPTH.ARM_RIGHT,
        renderOrder: 12,
      },
      BODY,
      false
    );

    const STRING_LEFT = createPart(
      {
        name: 'STRING_LEFT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.STRING_LEFT,
        depthZ: LAYER_DEPTH.BODY + 0.005,
        renderOrder: 13,
      },
      BODY,
      false
    );

    const STRING_RIGHT = createPart(
      {
        name: 'STRING_RIGHT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.STRING_RIGHT,
        depthZ: LAYER_DEPTH.BODY + 0.005,
        renderOrder: 14,
      },
      BODY,
      false
    );

    // 3. HEAD Hierarchy
    const HEAD = createBone(
      'HEAD',
      ANATOMICAL_PIVOTS.HEAD.u,
      ANATOMICAL_PIVOTS.HEAD.v,
      LAYER_DEPTH.FACE,
      W,
      H,
      ROOT
    );

    const HAIR_BACK = createPart(
      {
        name: 'HAIR_BACK',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.HAIR_BACK,
        depthZ: LAYER_DEPTH.HAIR_BACK,
        renderOrder: 5,
      },
      HEAD,
      false
    );

    const FACE = createPart(
      {
        name: 'FACE',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.FACE,
        depthZ: LAYER_DEPTH.FACE,
        renderOrder: 20,
      },
      HEAD,
      false
    );

    // Independent crisp alpha-matted EYE_LEFT & EYE_RIGHT sub-rect layers at exact BFS centroids
    const EYE_LEFT = createPart(
      {
        name: 'EYE_LEFT',
        texture: tex.eyeLeft.texture,
        planeWidth: W,
        planeHeight: H,
        uvPivot: { u: tex.eyeLeft.pivotU, v: tex.eyeLeft.pivotV },
        depthZ: LAYER_DEPTH.EYES,
        renderOrder: 35,
      },
      FACE.bone,
      true,
      W * tex.eyeLeft.widthU,
      H * tex.eyeLeft.heightV,
      tex.eyeLeft.centerU,
      tex.eyeLeft.centerV
    );

    const EYE_RIGHT = createPart(
      {
        name: 'EYE_RIGHT',
        texture: tex.eyeRight.texture,
        planeWidth: W,
        planeHeight: H,
        uvPivot: { u: tex.eyeRight.pivotU, v: tex.eyeRight.pivotV },
        depthZ: LAYER_DEPTH.EYES,
        renderOrder: 36,
      },
      FACE.bone,
      true,
      W * tex.eyeRight.widthU,
      H * tex.eyeRight.heightV,
      tex.eyeRight.centerU,
      tex.eyeRight.centerV
    );

    const MOUTH = createPart(
      {
        name: 'MOUTH',
        texture: tex.mouthSmile,
        planeWidth: W,
        planeHeight: H,
        uvPivot: { u: tex.mouthPatch.pivotU, v: tex.mouthPatch.pivotV },
        depthZ: LAYER_DEPTH.MOUTH,
        renderOrder: 65,
        opacity: 1,
      },
      FACE.bone,
      true,
      W * tex.mouthPatch.widthU,
      H * tex.mouthPatch.heightV,
      tex.mouthPatch.centerU,
      tex.mouthPatch.centerV
    );
    if (MOUTH.material) {
      MOUTH.material.depthTest = false;
    }

    const EAR_LEFT = createPart(
      {
        name: 'EAR_LEFT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.EAR_LEFT,
        depthZ: LAYER_DEPTH.FACE + 0.01,
        renderOrder: 22,
      },
      HEAD,
      false
    );

    const EAR_RIGHT = createPart(
      {
        name: 'EAR_RIGHT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.EAR_RIGHT,
        depthZ: LAYER_DEPTH.FACE + 0.01,
        renderOrder: 23,
      },
      HEAD,
      false
    );

    const GLASSES = createPart(
      {
        name: 'GLASSES',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.GLASSES,
        depthZ: LAYER_DEPTH.GLASSES,
        renderOrder: 30,
      },
      HEAD,
      false
    );

    const HAIR_FRONT = createPart(
      {
        name: 'HAIR_FRONT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.HAIR_FRONT,
        depthZ: LAYER_DEPTH.HAIR_FRONT,
        renderOrder: 40,
      },
      HEAD,
      false
    );

    // 4. ACCESSORIES Hierarchy (Earphones & Cables)
    const ACCESSORIES = createBone(
      'ACCESSORIES',
      ANATOMICAL_PIVOTS.ACCESSORIES.u,
      ANATOMICAL_PIVOTS.ACCESSORIES.v,
      LAYER_DEPTH.ACCESSORIES,
      W,
      H,
      ROOT
    );

    const EARPHONE_LEFT = createPart(
      {
        name: 'EARPHONE_LEFT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.EARPHONE_LEFT,
        depthZ: LAYER_DEPTH.ACCESSORIES,
        renderOrder: 45,
      },
      ACCESSORIES,
      false
    );

    const EARPHONE_RIGHT = createPart(
      {
        name: 'EARPHONE_RIGHT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.EARPHONE_RIGHT,
        depthZ: LAYER_DEPTH.ACCESSORIES,
        renderOrder: 46,
      },
      ACCESSORIES,
      false
    );

    const CABLE_LEFT = createPart(
      {
        name: 'CABLE_LEFT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.CABLE_LEFT,
        depthZ: LAYER_DEPTH.ACCESSORIES + 0.005,
        renderOrder: 47,
      },
      ACCESSORIES,
      false
    );

    const CABLE_RIGHT = createPart(
      {
        name: 'CABLE_RIGHT',
        planeWidth: W,
        planeHeight: H,
        uvPivot: ANATOMICAL_PIVOTS.CABLE_RIGHT,
        depthZ: LAYER_DEPTH.ACCESSORIES + 0.005,
        renderOrder: 48,
      },
      ACCESSORIES,
      false
    );

    // 5. Build Optimized 2.5D Deformer Mesh (36 x 42 grid) bound to the RigBones
    const segX = 36;
    const segY = 42;
    const baseLayer = createLayer(tex.characterBase, W, H, 15, 1, segX, segY);
    this.characterMesh = baseLayer.mesh;
    ROOT.add(this.characterMesh);

    if (tex.characterCozy) {
      const cozyLayer = createLayer(tex.characterCozy, W, H, 42, 0, segX, segY);
      this.cozyMesh = cozyLayer.mesh;
      this.cozyMesh.visible = false;
      ROOT.add(this.cozyMesh);
    }

    this.precomputeVertexSkinWeights(baseLayer.geometry, W, H);

    this.parts = {
      ROOT,
      BODY,
      HOODIE,
      ARM_LEFT,
      ARM_RIGHT,
      STRING_LEFT,
      STRING_RIGHT,
      HEAD,
      HAIR_BACK,
      FACE,
      EYE_LEFT,
      EYE_RIGHT,
      MOUTH,
      GLASSES,
      EAR_LEFT,
      EAR_RIGHT,
      HAIR_FRONT,
      ACCESSORIES,
      EARPHONE_LEFT,
      EARPHONE_RIGHT,
      CABLE_LEFT,
      CABLE_RIGHT,
    };
  }

  /**
   * Precomputes smooth anatomical vertex weights and 2.5D depth profile (Section 8).
   * ARM_LEFT and ARM_RIGHT are seamlessly unified into the character's body mesh
   * around the shoulder seam joints (u=0.325, v=0.735 and u=0.625, v=0.735).
   */
  private precomputeVertexSkinWeights(
    geometry: THREE.PlaneGeometry,
    W: number,
    H: number
  ): void {
    const posAttr = geometry.attributes.position;
    const cozyPosAttr = this.cozyMesh
      ? this.cozyMesh.geometry.attributes.position
      : null;
    const count = posAttr.count;
    this.skinWeights = new Array(count);

    for (let i = 0; i < count; i++) {
      const x0 = posAttr.getX(i);
      const y0 = posAttr.getY(i);
      const u = x0 / W + 0.5;
      const v = 0.5 - y0 / H;

      // Smooth Head vs Body transition below the chin/jawline so the mouth (v = 0.659) and chin (v <= 0.72) have 100% rigid wHead
      const chinDistU = (u - 0.485) / 0.18;
      const chinCurveOffset = Math.max(0, 1 - chinDistU * chinDistU) * 0.018;
      const neckStartV = 0.708 + chinCurveOffset;
      const neckEndV = 0.768 + chinCurveOffset * 0.5;
      const wHead = 1 - smoothstep(neckStartV, neckEndV, v);
      const wBody = 1 - wHead;

      // Subtle left & right shoulder weights integrated into the hoodie body
      const armBandV = smoothstep(0.71, 0.775, v);
      const wArmLeft = clamp((1 - smoothstep(0.24, 0.345, u)) * armBandV, 0, 1);
      const wArmRight = clamp(smoothstep(0.605, 0.71, u) * armBandV, 0, 1);

      // Anchor bottom hem so the character stays flush on the horizon line
      const wBottomAnchor = smoothstep(0.92, 1.0, v);

      // Protect the entire face, glasses, eye, cheek, mouth & forehead cranium (u: 0.20..0.77, v: 0.25..0.72) from secondary hair/cable warping
      const inFaceCoreU = 1 - smoothstep(0.20, 0.11, u) - smoothstep(0.76, 0.85, u);
      const inFaceCoreV = smoothstep(0.23, 0.34, v) * (1 - smoothstep(0.69, 0.74, v));
      const faceRigidityMask = clamp(inFaceCoreU * inFaceCoreV, 0, 1);

      // Gentle outer hair crown spring weight only at the top hair tips (v < 0.27)
      const topHairBand = 1 - smoothstep(0.14, 0.27, v);
      const wHairFront = clamp(topHairBand * 0.45 * (1 - faceRigidityMask), 0, 0.45);

      // Outer side hair spikes & top crown tip (unified direction with wHairFront so the head never shears)
      const sideSpikeMask =
        (1 - smoothstep(0.11, 0.21, u) + smoothstep(0.76, 0.86, u)) *
        (1 - smoothstep(0.36, 0.48, v));
      const topCrownTip = 1 - smoothstep(0.04, 0.15, v);
      const wHairBack = clamp(
        (sideSpikeMask * 0.45 + topCrownTip * 0.35) * (1 - faceRigidityMask),
        0,
        0.45
      );

      // Keep drawn glasses frames 100% rigid with the head cranium so lenses never warp during speech
      const wGlasses = 0;

      // Left & Right Earphone Cable secondary sway weights outside the jawline (u ~ 0.215 and u ~ 0.765)
      const cableBandV = smoothstep(0.58, 0.66, v) * (1 - smoothstep(0.8, 0.9, v));
      const wCableLeft =
        cableBandV *
        Math.exp(-Math.pow((u - 0.215) / 0.055, 2)) *
        0.6 *
        (1 - faceRigidityMask);
      const wCableRight =
        cableBandV *
        Math.exp(-Math.pow((u - 0.765) / 0.055, 2)) *
        0.6 *
        (1 - faceRigidityMask);

      // Left & Right Hoodie Drawstring secondary sway weights (v: 0.78..0.96)
      const stringBandV = smoothstep(0.77, 0.83, v) * (1 - smoothstep(0.92, 0.98, v));
      const wStringLeft =
        stringBandV * Math.exp(-Math.pow((u - 0.408) / 0.032, 2)) * 0.75;
      const wStringRight =
        stringBandV * Math.exp(-Math.pow((u - 0.535) / 0.032, 2)) * 0.75;

      // 2.5D Depth Z-profile (Section 8)
      const z0 =
        wHairBack * LAYER_DEPTH.HAIR_BACK +
        wBody * LAYER_DEPTH.BODY +
        wArmLeft * LAYER_DEPTH.ARM_LEFT +
        wArmRight * LAYER_DEPTH.ARM_RIGHT +
        wHead * LAYER_DEPTH.FACE +
        wGlasses * LAYER_DEPTH.GLASSES +
        wHairFront * LAYER_DEPTH.HAIR_FRONT +
        (wCableLeft + wCableRight) * LAYER_DEPTH.ACCESSORIES * 0.25;

      posAttr.setZ(i, z0);
      if (cozyPosAttr) {
        cozyPosAttr.setZ(i, z0);
      }

      this.skinWeights[i] = {
        x0,
        y0,
        z0,
        u,
        v,
        wHead,
        wBody,
        wArmLeft,
        wArmRight,
        wHairFront,
        wHairBack,
        wGlasses,
        wCableLeft,
        wCableRight,
        wStringLeft,
        wStringRight,
        wBottomAnchor,
      };
    }

    posAttr.needsUpdate = true;
    if (cozyPosAttr) {
      cozyPosAttr.needsUpdate = true;
    }
  }

  /**
   * Evaluates the exact 2D transform of a point (x, y) rotated & scaled around a bone's world pivot.
   */
  private applyBoneDelta(
    x: number,
    y: number,
    bone: RigBone,
    weight: number
  ): { dx: number; dy: number } {
    if (weight <= 0.0001) return { dx: 0, dy: 0 };
    const { worldPivot, delta } = bone.userData;
    const relX = x - worldPivot.x;
    const relY = y - worldPivot.y;

    const cos = Math.cos(delta.rotationZ);
    const sin = Math.sin(delta.rotationZ);

    const sx = relX * delta.scaleX;
    const sy = relY * delta.scaleY;

    const rotX = sx * cos - sy * sin;
    const rotY = sx * sin + sy * cos;

    const tx = worldPivot.x + rotX + delta.x - x;
    const ty = worldPivot.y + rotY + delta.y - y;

    return {
      dx: tx * weight,
      dy: ty * weight,
    };
  }

  /**
   * Deforms the continuous 2.5D character grid using the hierarchical RigBone transforms
   * so that HEAD->FACE matches the eye socket bones 1:1 while the unified proportional
   * arms (ARM_LEFT, ARM_RIGHT), neck, hair, glasses, strings, and cables move seamlessly.
   */
  private updateDeformerMesh(): void {
    if (!this.parts || !this.characterMesh) return;

    const posAttr = this.characterMesh.geometry.attributes.position;
    const cozyPosAttr =
      this.cozyMesh && this.cozyMesh.visible
        ? this.cozyMesh.geometry.attributes.position
        : null;

    const {
      BODY,
      HOODIE,
      ARM_LEFT,
      ARM_RIGHT,
      STRING_LEFT,
      STRING_RIGHT,
      HEAD,
      HAIR_BACK,
      FACE,
      GLASSES,
      HAIR_FRONT,
      CABLE_LEFT,
      CABLE_RIGHT,
    } = this.parts;

    const headPivotX = HEAD.userData.worldPivot.x;
    const headPivotY = HEAD.userData.worldPivot.y;
    const headDelta = HEAD.userData.delta;
    const faceDelta = FACE.bone.userData.delta;
    const headCos = Math.cos(headDelta.rotationZ);
    const headSin = Math.sin(headDelta.rotationZ);

    const bodyPivotX = BODY.userData.worldPivot.x;
    const bodyPivotY = BODY.userData.worldPivot.y;
    const bodyDelta = BODY.userData.delta;
    const hoodieDelta = HOODIE.bone.userData.delta;
    const bodyTotalRot = bodyDelta.rotationZ + hoodieDelta.rotationZ;
    const bodyCos = Math.cos(bodyTotalRot);
    const bodySin = Math.sin(bodyTotalRot);

    const count = this.skinWeights.length;
    for (let i = 0; i < count; i++) {
      const sw = this.skinWeights[i];
      const { x0, y0 } = sw;

      // 1. Exact HEAD -> FACE hierarchical transform (matches EYE_LEFT & EYE_RIGHT parent space 1:1!)
      const hxRel = x0 - headPivotX + faceDelta.x;
      const hyRel = y0 - headPivotY + faceDelta.y;
      const headX =
        headPivotX + (hxRel * headCos - hyRel * headSin) + headDelta.x;
      const headY =
        headPivotY + (hxRel * headSin + hyRel * headCos) + headDelta.y;

      // 2. Exact BODY -> HOODIE hierarchical transform (damped only at center torso bottom hem)
      const anchorFade = 1 - sw.wBottomAnchor * 0.85;
      const bxRel = (x0 - bodyPivotX) * bodyDelta.scaleX;
      const byRel = (y0 - bodyPivotY) * (1 + (bodyDelta.scaleY - 1) * anchorFade);
      const bodyX =
        bodyPivotX +
        (bxRel * bodyCos - byRel * bodySin) +
        bodyDelta.x * anchorFade;
      const bodyY =
        bodyPivotY +
        (bxRel * bodySin + byRel * bodyCos) +
        bodyDelta.y * anchorFade;

      // Blend smoothly between HEAD and BODY across the neck/collar
      let x = headX * sw.wHead + bodyX * sw.wBody;
      let y = headY * sw.wHead + bodyY * sw.wBody;

      // 3. Unified Proportional Body Arms (ARM_LEFT & ARM_RIGHT) pivoted at the shoulders
      if (sw.wArmLeft > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, ARM_LEFT.bone, sw.wArmLeft);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wArmRight > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, ARM_RIGHT.bone, sw.wArmRight);
        x += d.dx;
        y += d.dy;
      }

      // 4. Secondary spring motion for HAIR_FRONT, HAIR_BACK, GLASSES, CABLES, and STRINGS
      if (sw.wHairFront > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, HAIR_FRONT.bone, sw.wHairFront);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wHairBack > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, HAIR_BACK.bone, sw.wHairBack);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wGlasses > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, GLASSES.bone, sw.wGlasses);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wCableLeft > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, CABLE_LEFT.bone, sw.wCableLeft);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wCableRight > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, CABLE_RIGHT.bone, sw.wCableRight);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wStringLeft > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, STRING_LEFT.bone, sw.wStringLeft);
        x += d.dx;
        y += d.dy;
      }

      if (sw.wStringRight > 0.0001) {
        const d = this.applyBoneDelta(x0, y0, STRING_RIGHT.bone, sw.wStringRight);
        x += d.dx;
        y += d.dy;
      }

      posAttr.setXY(i, x, y);
      if (cozyPosAttr) {
        cozyPosAttr.setXY(i, x, y);
      }
    }

    posAttr.needsUpdate = true;
    if (cozyPosAttr) {
      cozyPosAttr.needsUpdate = true;
    }
  }

  /**
   * character.setMousePosition(x, y)
   * Sets normalized pointer coordinates in [-1, 1] range.
   */
  public setMousePosition(x: number, y: number): void {
    this.targetMouseX = clamp(x, -1, 1);
    this.targetMouseY = clamp(y, -1, 1);
  }

  /**
   * character.playAnimation(name)
   * Plays "wave", "greet", "blink", "idle", "head_tilt", or "happy".
   */
  public playAnimation(name: PlayableAnimationName | string): void {
    this.animationController.playAnimation(name);
    if (this.onAnimationTrigger) {
      this.onAnimationTrigger(name);
    }
  }

  public setCozyMode(active: boolean): void {
    this.isCozyMode = active;
  }

  public setSpeechBubbleActive(active: boolean): void {
    this.isBubbleActive = active;
    if (!active) {
      this.animationController.setSpeechViseme(0, 1, false);
      if (this.parts?.MOUTH.material && this.textures) {
        this.parts.MOUTH.material.opacity = 1;
        if (this.parts.MOUTH.material.map !== this.textures.mouthSmile) {
          this.parts.MOUTH.material.map = this.textures.mouthSmile;
          this.parts.MOUTH.material.needsUpdate = true;
        }
        if (this.parts.MOUTH.mesh) {
          this.parts.MOUTH.mesh.visible = true;
        }
      }
    }
  }

  public setSpeechViseme(
    openAmount: number,
    widthFactor = 1,
    active = true
  ): void {
    this.animationController.setSpeechViseme(openAmount, widthFactor, active);
  }

  public getState(): CharacterAnimationState {
    return this.animationController.getState();
  }

  private handleVisibilityChange(): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      this.lastFrameTime = performance.now();
      this.ensureLoopRunning();
    }
  }

  private ensureLoopRunning(): void {
    if (this.isDisposed || !this.isInitialized || this.rafId !== null) return;
    if (
      !this.isInViewport ||
      (typeof document !== 'undefined' && document.visibilityState === 'hidden')
    ) {
      return;
    }

    const tick = (now: number) => {
      this.rafId = null;
      if (this.isDisposed) return;
      if (
        !this.isInViewport ||
        (typeof document !== 'undefined' && document.visibilityState === 'hidden')
      ) {
        return;
      }
      const delta = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;
      this.update(delta);
      this.rafId = requestAnimationFrame(tick);
    };

    this.lastFrameTime = performance.now();
    this.rafId = requestAnimationFrame(tick);
  }

  /**
   * character.update(delta)
   * Evaluates pointer interpolation, 2.5D depth parallax, idle breathing, blink state,
   * unified arm motion, hair spring physics, glasses 30-60ms delay, and deformer skinning.
   */
  public update(delta: number): void {
    if (!this.parts || !this.renderer) return;

    // Gently return to neutral idle after mobile touch ends (Section 7)
    if (this.lastTouchTime > 0 && performance.now() - this.lastTouchTime > 1800) {
      this.targetMouseX = lerp(this.targetMouseX, 0, 0.04);
      this.targetMouseY = lerp(this.targetMouseY, 0, 0.04);
    }

    // Smooth pointer interpolation: current += (target - current) * smoothing (Section 6)
    const smoothing = this.reducedMotion ? 0 : 1 - Math.exp(-7.5 * delta);
    if (this.reducedMotion) {
      this.currentMouseX = 0;
      this.currentMouseY = 0;
      this.hoverBlend = 0;
    } else {
      this.currentMouseX += (this.targetMouseX - this.currentMouseX) * smoothing;
      this.currentMouseY += (this.targetMouseY - this.currentMouseY) * smoothing;
      this.hoverBlend = damp(this.hoverBlend, this.isHovering ? 1 : 0, 8, delta);
    }

    const mx = this.currentMouseX;
    const my = this.currentMouseY;

    // Evaluate state machine, idle breathing, and blink keyframes
    const pose = this.animationController.update(
      delta,
      this.planeHeight,
      this.reducedMotion,
      mx,
      my,
      this.isCozyMode,
      this.isBubbleActive
    );

    const pxToWorld = this.planeHeight / 420;
    const hoverBoost = 1 + this.hoverBlend * 0.15;
    // Soften cursor head-tracking pull while actively speaking so conversational head nods take center stage cleanly
    const talkTrackScale = pose.isTalking ? 0.55 : 1.0;

    // Section 6: Head Tracking around anatomical neck pivot (rotation naturally arcs the face without shearing the neck)
    const maxHeadRotRad = THREE.MathUtils.degToRad(4.4);
    const trackHeadRotZ =
      (-mx * maxHeadRotRad * hoverBoost + this.hoverBlend * 0.012) *
      talkTrackScale;
    const trackHeadX = mx * 1.4 * pxToWorld * talkTrackScale;
    const trackHeadY = my * 1.3 * pxToWorld * talkTrackScale;

    const targetHeadX = pose.headX + trackHeadX;
    const targetHeadY = pose.headY + trackHeadY;
    const targetHeadRotZ = clamp(
      pose.headRotZ + trackHeadRotZ,
      -THREE.MathUtils.degToRad(6.2),
      THREE.MathUtils.degToRad(6.2)
    );

    if (this.reducedMotion) {
      this.smoothedHeadX = targetHeadX;
      this.smoothedHeadY = targetHeadY;
      this.smoothedHeadRotZ = targetHeadRotZ;
    } else {
      this.smoothedHeadX = damp(this.smoothedHeadX, targetHeadX, 16, delta);
      this.smoothedHeadY = damp(this.smoothedHeadY, targetHeadY, 16, delta);
      this.smoothedHeadRotZ = damp(
        this.smoothedHeadRotZ,
        targetHeadRotZ,
        16,
        delta
      );
    }

    const totalHeadX = this.smoothedHeadX;
    const totalHeadY = this.smoothedHeadY;
    const totalHeadRotZ = this.smoothedHeadRotZ;

    // Section 6: Subtle Body Parallax Follow (aligned with neck so the collar seam never shears)
    const bodyCounterX = mx * 0.65 * pxToWorld * talkTrackScale;
    const bodyCounterRotZ = -mx * 0.004 * talkTrackScale;

    // Section 9: Unified Hair Secondary Motion (coherent direction so front & back hair tips never shear against each other)
    const hairBackX = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairBackSpringX,
          mx * 1.1 * pxToWorld * hoverBoost,
          95,
          12,
          delta
        );
    const hairBackY = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairBackSpringY,
          my * 0.8 * pxToWorld,
          95,
          12,
          delta
        );
    const hairBackRot = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairBackSpringRot,
          totalHeadRotZ * 0.06,
          90,
          12,
          delta
        );

    const hairFrontX = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairFrontSpringX,
          mx * 1.3 * pxToWorld * hoverBoost,
          120,
          12,
          delta
        );
    const hairFrontY = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairFrontSpringY,
          my * 0.9 * pxToWorld * hoverBoost,
          120,
          12,
          delta
        );
    const hairFrontRot = this.reducedMotion
      ? 0
      : stepSpring(
          this.hairFrontSpringRot,
          totalHeadRotZ * 0.075,
          115,
          12,
          delta
        );

    // Section 10: Glasses follow HEAD cleanly
    const glassesTargetX = mx * 0.6 * pxToWorld;
    const glassesTargetY = my * 0.5 * pxToWorld;
    const glassesTargetRotZ = totalHeadRotZ * 0.04;

    this.glassesLagX = damp(this.glassesLagX, glassesTargetX, 22, delta);
    this.glassesLagY = damp(this.glassesLagY, glassesTargetY, 22, delta);
    this.glassesLagRotZ = damp(this.glassesLagRotZ, glassesTargetRotZ, 22, delta);

    // Section 11: Earphone & Cable Secondary Movement
    const cableTargetRot = -totalHeadRotZ * 0.18 - mx * 0.012;
    const cableLeftRot = this.reducedMotion
      ? 0
      : stepSpring(this.cableLeftSpringRot, cableTargetRot, 90, 11, delta);
    const cableRightRot = this.reducedMotion
      ? 0
      : stepSpring(this.cableRightSpringRot, cableTargetRot * 0.92, 85, 11, delta);

    // Section 6 & 13: Eye Cursor Tracking & Blink Scale (clamped safely inside glasses lenses)
    const eyeTrackX = clamp(mx * (3.6 + this.hoverBlend * 1.0), -4.8, 4.8) * pxToWorld;
    const eyeTrackY = clamp(my * (2.4 + this.hoverBlend * 0.7), -3.4, 3.4) * pxToWorld;

    // Update all hierarchical RigBones via animatePart()
    animatePart(this.parts.ROOT, {
      y: pose.rootY,
      scaleX: pose.happyBounceScale,
      scaleY: pose.happyBounceScale,
    });

    animatePart(this.parts.BODY, {
      x: bodyCounterX,
      y: pose.bodyY,
      rotationZ: bodyCounterRotZ,
      scaleY: pose.bodyScaleY,
    });

    animatePart(this.parts.HOODIE, {
      rotationZ: pose.hoodieRotZ,
    });

    animatePart(this.parts.ARM_LEFT, {
      x: pose.armLeftX,
      y: pose.armLeftY,
      rotationZ: pose.armLeftRotZ,
    });

    animatePart(this.parts.ARM_RIGHT, {
      x: pose.armRightX,
      y: pose.armRightY,
      rotationZ: pose.armRightRotZ,
    });

    animatePart(this.parts.STRING_LEFT, {
      rotationZ: pose.stringLeftRotZ + cableLeftRot * 0.35,
    });

    animatePart(this.parts.STRING_RIGHT, {
      rotationZ: pose.stringRightRotZ + cableRightRot * 0.35,
    });

    animatePart(this.parts.HEAD, {
      x: totalHeadX,
      y: totalHeadY,
      rotationZ: totalHeadRotZ,
    });

    animatePart(this.parts.HAIR_BACK, {
      x: hairBackX,
      y: hairBackY,
      rotationZ: hairBackRot,
    });

    animatePart(this.parts.FACE, {
      x: 0,
      y: 0,
    });

    // Crossfade Cozy closed-eyes expression when Cozy ASMR soundscape is playing
    if (this.cozyMesh) {
      const targetCozyOpacity = this.isCozyMode ? 1 : 0;
      this.cozyMesh.material.opacity = damp(
        this.cozyMesh.material.opacity,
        targetCozyOpacity,
        10,
        delta
      );
      this.cozyMesh.visible = this.cozyMesh.material.opacity > 0.002;
    }

    const eyesVisibleOpacity = this.isCozyMode ? 0 : 1;
    if (this.parts.EYE_LEFT.material && this.parts.EYE_RIGHT.material) {
      this.parts.EYE_LEFT.material.opacity = damp(
        this.parts.EYE_LEFT.material.opacity,
        eyesVisibleOpacity,
        14,
        delta
      );
      this.parts.EYE_RIGHT.material.opacity = damp(
        this.parts.EYE_RIGHT.material.opacity,
        eyesVisibleOpacity,
        14,
        delta
      );
      const showEyes = this.parts.EYE_LEFT.material.opacity > 0.002;
      if (this.parts.EYE_LEFT.mesh) this.parts.EYE_LEFT.mesh.visible = showEyes;
      if (this.parts.EYE_RIGHT.mesh) this.parts.EYE_RIGHT.mesh.visible = showEyes;
    }

    animatePart(this.parts.EYE_LEFT, {
      x: eyeTrackX,
      y: eyeTrackY,
      scaleX: pose.eyeScaleX,
      scaleY: pose.eyeScaleY,
    });

    animatePart(this.parts.EYE_RIGHT, {
      x: eyeTrackX,
      y: eyeTrackY,
      scaleX: pose.eyeScaleX,
      scaleY: pose.eyeScaleY,
    });

    // 2D Rig Mouth: Always visible (`mouthSmile` in idle/cozy state, animated lip-sync when speech bubble is active)
    const animateMouthRig = this.isBubbleActive && pose.isTalking;
    if (this.parts.MOUTH.material && this.textures) {
      this.parts.MOUTH.material.opacity = 1;
      if (this.parts.MOUTH.mesh) {
        this.parts.MOUTH.mesh.visible = true;
      }

      const desiredMouthMap =
        animateMouthRig && pose.mouthOpenAmount > 0.24
          ? this.textures.mouthOpen
          : this.textures.mouthSmile;
      if (this.parts.MOUTH.material.map !== desiredMouthMap) {
        this.parts.MOUTH.material.map = desiredMouthMap;
        this.parts.MOUTH.material.needsUpdate = true;
      }
    }

    animatePart(this.parts.MOUTH, {
      y: animateMouthRig ? pose.mouthY : 0,
      rotationZ: animateMouthRig ? pose.mouthRotZ : 0,
      scaleX: animateMouthRig ? pose.mouthScaleX : 1,
      scaleY: animateMouthRig ? pose.mouthScaleY : 1,
    });

    animatePart(this.parts.EAR_LEFT, {
      x: -mx * 0.7 * pxToWorld,
    });

    animatePart(this.parts.EAR_RIGHT, {
      x: -mx * 0.7 * pxToWorld,
    });

    animatePart(this.parts.GLASSES, {
      x: this.glassesLagX,
      y: this.glassesLagY,
      rotationZ: this.glassesLagRotZ,
    });

    animatePart(this.parts.HAIR_FRONT, {
      x: hairFrontX,
      y: hairFrontY,
      rotationZ: hairFrontRot,
    });

    animatePart(this.parts.ACCESSORIES, {
      x: totalHeadX * 0.85,
      y: totalHeadY * 0.85,
      rotationZ: totalHeadRotZ * 0.65,
    });

    animatePart(this.parts.EARPHONE_LEFT, {
      rotationZ: cableLeftRot * 0.35,
    });

    animatePart(this.parts.EARPHONE_RIGHT, {
      rotationZ: cableRightRot * 0.35,
    });

    animatePart(this.parts.CABLE_LEFT, {
      rotationZ: cableLeftRot,
    });

    animatePart(this.parts.CABLE_RIGHT, {
      rotationZ: cableRightRot,
    });

    // Apply hierarchical bone transforms to the continuous 2.5D character mesh
    this.updateDeformerMesh();

    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.renderer || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);

    // Match `object-contain object-bottom` aspect ratio without clipping or stretching (Section 15)
    const containerAspect = width / height;
    const paddedHeight = this.planeHeight * 1.045;
    const paddedWidth = this.planeWidth * 1.06;

    let viewHeight = paddedHeight;
    let viewWidth = viewHeight * containerAspect;

    if (viewWidth < paddedWidth) {
      viewWidth = paddedWidth;
      viewHeight = viewWidth / containerAspect;
    }

    const bottomOffset = (viewHeight - this.planeHeight) * 0.25;

    this.camera.left = -viewWidth / 2;
    this.camera.right = viewWidth / 2;
    this.camera.top = viewHeight / 2 + bottomOffset;
    this.camera.bottom = -viewHeight / 2 + bottomOffset;
    this.camera.updateProjectionMatrix();
  }

  private handleWindowMouseMove(e: MouseEvent): void {
    const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    this.setMousePosition(nx, ny);
  }

  private handleWindowTouchMove(e: TouchEvent): void {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    this.lastTouchTime = performance.now();
    const nx = (touch.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = -((touch.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    this.setMousePosition(nx, ny);
  }

  private handleWindowTouchEnd(): void {
    this.lastTouchTime = performance.now();
  }

  private handleDeviceOrientation(e: DeviceOrientationEvent): void {
    if (performance.now() - this.lastTouchTime < 2500) return;
    if (typeof e.gamma === 'number' && typeof e.beta === 'number') {
      const nx = clamp(e.gamma / 30, -1, 1);
      const ny = clamp((45 - e.beta) / 30, -1, 1);
      this.setMousePosition(nx * 0.65, ny * 0.65);
    }
  }

  private handleMouseEnter(): void {
    this.isHovering = true;
  }

  private handleMouseLeave(): void {
    this.isHovering = false;
  }

  private handleContainerClick(): void {
    if (this.isBubbleActive) {
      const played = this.animationController.playRandomPlayfulAnimation();
      if (this.onAnimationTrigger) {
        this.onAnimationTrigger(played);
      }
    }
    if (this.onTap) {
      this.onTap();
    }
  }

  private handleReducedMotionChange(e: MediaQueryListEvent): void {
    this.reducedMotion = e.matches;
  }

  /**
   * character.dispose()
   * Cleans up RAF loop, event listeners, geometries, materials, textures, and WebGLRenderer.
   */
  public dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('resize', this.boundResize);
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('touchend', this.boundTouchEnd);
    window.removeEventListener('deviceorientation', this.boundDeviceOrientation);
    document.removeEventListener('visibilitychange', this.boundVisibilityChange);
    this.container.removeEventListener('mouseenter', this.boundMouseEnter);
    this.container.removeEventListener('mouseleave', this.boundMouseLeave);
    this.container.removeEventListener('click', this.boundClick);

    if (this.reducedMotionQuery) {
      this.reducedMotionQuery.removeEventListener('change', this.boundReducedMotionChange);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    this.customTextureManager.disposeAll();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}
