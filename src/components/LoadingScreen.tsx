import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoodleStar } from './Doodles';

interface LoadingScreenProps {
  onStartExit?: () => void;
  onFinish: () => void;
}

interface BootStage {
  threshold: number;
  text: string;
}

const BOOT_STAGES: BootStage[] = [
  { threshold: 0, text: 'Booting Uray Fazli Node OS...' },
  { threshold: 16, text: 'Mounting validator keystore...' },
  { threshold: 34, text: 'Fetching Aptos & Sei RPC state...' },
  { threshold: 58, text: 'Syncing SubQuery indexer blocks...' },
  { threshold: 80, text: 'Arming 24/7 slashing sentry...' },
  { threshold: 94, text: 'All nodes synced! Ready ✓' },
];

interface ScreenShard {
  id: number;
  /** Polygon points in 0..100 viewport percentage space */
  points: Array<[number, number]>;
  /** Center of shard for transformOrigin */
  cx: number;
  cy: number;
  /** Outward explosion trajectory */
  tx: string;
  ty: string;
  rotZ: number;
  rotX: number;
  rotY: number;
  scale: number;
  delay: number;
  edgeColor: string;
  glintOpacity: number;
}

/**
 * 16 Mathematically Interlocking Voronoi / Spiderweb Screen Shards
 * Tiling 100% of the [0..100] x [0..100] viewport from the central impact point (50, 50).
 * Inner ring: P0(50,22), P1(73,27), P2(78,50), P3(71,74), P4(50,79), P5(27,72), P6(21,49), P7(28,26)
 * Outer boundary: E0(48,0), E1(100,0), E2(100,52), E3(100,100), E4(52,100), E5(0,100), E6(0,48), E7(0,0)
 */
const SCREEN_SHARDS: ScreenShard[] = [
  // --- 8 INNER CORE SHARDS (Radiating directly from impact center 50,50) ---
  {
    id: 0,
    points: [[50, 50], [50, 22], [73, 27]],
    cx: 58,
    cy: 33,
    tx: '28vw',
    ty: '-46vh',
    rotZ: 42,
    rotX: 38,
    rotY: -28,
    scale: 0.72,
    delay: 0,
    edgeColor: '#22C55E',
    glintOpacity: 0.22,
  },
  {
    id: 1,
    points: [[50, 50], [73, 27], [78, 50]],
    cx: 67,
    cy: 42,
    tx: '52vw',
    ty: '-18vh',
    rotZ: 58,
    rotX: -25,
    rotY: 42,
    scale: 0.68,
    delay: 0.01,
    edgeColor: '#E59B63',
    glintOpacity: 0.16,
  },
  {
    id: 2,
    points: [[50, 50], [78, 50], [71, 74]],
    cx: 66,
    cy: 58,
    tx: '48vw',
    ty: '26vh',
    rotZ: 64,
    rotX: -36,
    rotY: 32,
    scale: 0.7,
    delay: 0.015,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.2,
  },
  {
    id: 3,
    points: [[50, 50], [71, 74], [50, 79]],
    cx: 57,
    cy: 68,
    tx: '22vw',
    ty: '52vh',
    rotZ: -48,
    rotX: -42,
    rotY: 24,
    scale: 0.74,
    delay: 0.005,
    edgeColor: '#E59B63',
    glintOpacity: 0.18,
  },
  {
    id: 4,
    points: [[50, 50], [50, 79], [27, 72]],
    cx: 42,
    cy: 67,
    tx: '-26vw',
    ty: '50vh',
    rotZ: -54,
    rotX: -38,
    rotY: -30,
    scale: 0.7,
    delay: 0.01,
    edgeColor: '#22C55E',
    glintOpacity: 0.15,
  },
  {
    id: 5,
    points: [[50, 50], [27, 72], [21, 49]],
    cx: 33,
    cy: 57,
    tx: '-52vw',
    ty: '22vh',
    rotZ: -62,
    rotX: 28,
    rotY: -40,
    scale: 0.68,
    delay: 0.015,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.22,
  },
  {
    id: 6,
    points: [[50, 50], [21, 49], [28, 26]],
    cx: 33,
    cy: 42,
    tx: '-50vw',
    ty: '-20vh',
    rotZ: -46,
    rotX: 34,
    rotY: -36,
    scale: 0.72,
    delay: 0.005,
    edgeColor: '#E59B63',
    glintOpacity: 0.19,
  },
  {
    id: 7,
    points: [[50, 50], [28, 26], [50, 22]],
    cx: 43,
    cy: 33,
    tx: '-24vw',
    ty: '-48vh',
    rotZ: -38,
    rotX: 44,
    rotY: 22,
    scale: 0.74,
    delay: 0,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.24,
  },

  // --- 8 OUTER PERIMETER SHARDS (Connecting inner ring to viewport edges/corners) ---
  {
    id: 8,
    points: [[50, 22], [48, 0], [100, 0], [73, 27]],
    cx: 68,
    cy: 12,
    tx: '38vw',
    ty: '-64vh',
    rotZ: 34,
    rotX: 28,
    rotY: 22,
    scale: 0.82,
    delay: 0.025,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.12,
  },
  {
    id: 9,
    points: [[73, 27], [100, 0], [100, 52], [78, 50]],
    cx: 88,
    cy: 32,
    tx: '68vw',
    ty: '-26vh',
    rotZ: 44,
    rotX: -20,
    rotY: 34,
    scale: 0.84,
    delay: 0.03,
    edgeColor: '#E59B63',
    glintOpacity: 0.14,
  },
  {
    id: 10,
    points: [[78, 50], [100, 52], [100, 100], [71, 74]],
    cx: 87,
    cy: 69,
    tx: '66vw',
    ty: '42vh',
    rotZ: 52,
    rotX: -30,
    rotY: 28,
    scale: 0.82,
    delay: 0.035,
    edgeColor: '#22C55E',
    glintOpacity: 0.12,
  },
  {
    id: 11,
    points: [[71, 74], [100, 100], [52, 100], [50, 79]],
    cx: 68,
    cy: 88,
    tx: '34vw',
    ty: '68vh',
    rotZ: 38,
    rotX: -35,
    rotY: 18,
    scale: 0.85,
    delay: 0.025,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.15,
  },
  {
    id: 12,
    points: [[50, 79], [52, 100], [0, 100], [27, 72]],
    cx: 32,
    cy: 88,
    tx: '-36vw',
    ty: '66vh',
    rotZ: -40,
    rotX: -32,
    rotY: -22,
    scale: 0.84,
    delay: 0.03,
    edgeColor: '#E59B63',
    glintOpacity: 0.13,
  },
  {
    id: 13,
    points: [[27, 72], [0, 100], [0, 48], [21, 49]],
    cx: 12,
    cy: 67,
    tx: '-68vw',
    ty: '36vh',
    rotZ: -48,
    rotX: 22,
    rotY: -34,
    scale: 0.82,
    delay: 0.035,
    edgeColor: '#22C55E',
    glintOpacity: 0.14,
  },
  {
    id: 14,
    points: [[21, 49], [0, 48], [0, 0], [28, 26]],
    cx: 12,
    cy: 31,
    tx: '-66vw',
    ty: '-32vh',
    rotZ: -42,
    rotX: 28,
    rotY: -30,
    scale: 0.84,
    delay: 0.025,
    edgeColor: '#FBEEE0',
    glintOpacity: 0.16,
  },
  {
    id: 15,
    points: [[28, 26], [0, 0], [48, 0], [50, 22]],
    cx: 32,
    cy: 12,
    tx: '-34vw',
    ty: '-64vh',
    rotZ: -32,
    rotX: 34,
    rotY: -20,
    scale: 0.85,
    delay: 0.02,
    edgeColor: '#E59B63',
    glintOpacity: 0.15,
  },
];

interface GlassSplinter {
  id: number;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
  color: string;
  shape: string;
}

const GLASS_SPLINTERS: GlassSplinter[] = [
  { id: 0, tx: -290, ty: -210, rot: -165, scale: 1.4, color: '#FBEEE0', shape: '0,-14 11,6 -9,12' },
  { id: 1, tx: -110, ty: -310, rot: 140, scale: 1.2, color: '#22C55E', shape: '-8,-16 12,-4 2,15 -10,8' },
  { id: 2, tx: 125, ty: -305, rot: -130, scale: 1.35, color: '#E59B63', shape: '0,-15 14,8 -12,10' },
  { id: 3, tx: 310, ty: -195, rot: 175, scale: 1.45, color: '#FBEEE0', shape: '-10,-12 13,-6 8,14 -12,6' },
  { id: 4, tx: 350, ty: -15, rot: 210, scale: 1.25, color: '#22C55E', shape: '0,-16 10,12 -11,8' },
  { id: 5, tx: 295, ty: 210, rot: 155, scale: 1.35, color: '#E59B63', shape: '-9,-14 14,0 4,14 -12,9' },
  { id: 6, tx: 115, ty: 300, rot: -145, scale: 1.3, color: '#FBEEE0', shape: '0,-13 13,9 -10,11' },
  { id: 7, tx: -120, ty: 295, rot: 135, scale: 1.25, color: '#22C55E', shape: '-11,-10 12,-5 6,15 -9,10' },
  { id: 8, tx: -305, ty: 195, rot: -170, scale: 1.4, color: '#E59B63', shape: '0,-15 12,10 -13,7' },
  { id: 9, tx: -345, ty: 10, rot: -200, scale: 1.3, color: '#FBEEE0', shape: '-8,-14 14,-2 5,13 -11,8' },
  { id: 10, tx: -185, ty: -135, rot: -95, scale: 1.5, color: '#22C55E', shape: '0,-12 10,8 -8,10' },
  { id: 11, tx: 190, ty: -130, rot: 105, scale: 1.5, color: '#FBEEE0', shape: '-7,-11 11,2 -2,12' },
  { id: 12, tx: 185, ty: 135, rot: 115, scale: 1.45, color: '#E59B63', shape: '0,-13 11,7 -9,9' },
  { id: 13, tx: -180, ty: 140, rot: -115, scale: 1.45, color: '#FBEEE0', shape: '-9,-10 10,-3 4,12 -8,7' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onStartExit,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);
  const [exitPhase, setExitPhase] = useState<'idle' | 'cracking' | 'shattering'>('idle');
  const exitTriggeredRef = useRef(false);

  const triggerScreenShatterExit = () => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;

    // Reveal the live website immediately behind the loading screen so it shows through the cracks & flying shards!
    onStartExit?.();

    // Stage 1 (0ms - 260ms): Character punches/overcharges the screen -> Full-screen spiderweb glass cracks appear + impact shake
    setExitPhase('cracking');

    // Stage 2 (260ms - 1180ms): The cracked screen violently shatters into 16 3D polygonal glass shards & character parts blast outward
    setTimeout(() => {
      setExitPhase('shattering');
    }, 260);

    // Stage 3 (1180ms): Cleanly unmount after all glass shards have flown off-screen
    setTimeout(() => {
      onFinish();
    }, 1180);
  };

  useEffect(() => {
    // Realistic staged data-loading simulation (~5.2 seconds total)
    let current = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (current >= 100) return;

      let increment = 1;
      let nextDelay = 65;

      if (current < 15) {
        increment = 1.6;
        nextDelay = 55;
      } else if (current >= 15 && current < 28) {
        increment = 0.65;
        nextDelay = 85;
      } else if (current >= 28 && current < 48) {
        increment = current > 36 && current < 42 ? 0.35 : 1.15;
        nextDelay = current > 36 && current < 42 ? 110 : 65;
      } else if (current >= 48 && current < 72) {
        increment = current > 58 && current < 64 ? 0.4 : 1.05;
        nextDelay = current > 58 && current < 64 ? 105 : 70;
      } else if (current >= 72 && current < 92) {
        increment = current > 80 && current < 85 ? 0.35 : 1.2;
        nextDelay = current > 80 && current < 85 ? 115 : 65;
      } else {
        increment = 1.5;
        nextDelay = 50;
      }

      current = Math.min(100, current + increment);
      setProgress(current);

      if (current < 100) {
        timeoutId = setTimeout(tick, nextDelay);
      }
    };

    timeoutId = setTimeout(tick, 120);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !exitTriggeredRef.current) {
      const doneTimer = setTimeout(() => {
        triggerScreenShatterExit();
      }, 480);
      return () => clearTimeout(doneTimer);
    }
  }, [progress]);

  const roundedProgress = Math.min(100, Math.round(progress));
  const isReady = roundedProgress >= 94;
  const isSyncing = roundedProgress >= 32 && roundedProgress < 94;
  const isCracking = exitPhase === 'cracking';
  const isShattering = exitPhase === 'shattering';

  const currentStage =
    [...BOOT_STAGES].reverse().find((stage) => roundedProgress >= stage.threshold) ||
    BOOT_STAGES[0];

  return (
    <motion.div
      animate={
        isCracking
          ? {
              x: [-10, 11, -9, 9, -6, 6, 0],
              y: [7, -8, 6, -6, 3, -3, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        perspective: '1200px',
        pointerEvents: exitPhase !== 'idle' ? 'none' : 'auto',
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 overflow-hidden select-none ${
        isShattering ? 'bg-transparent' : 'bg-[#0a0e15]'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Uray Fazli Alman Portfolio"
    >
      {/* ==============================================================
          1. SOLID BACKGROUND & AMBIENT GLOW (ONLY PRIOR TO SHATTER)
          Once `isShattering` begins, the background splits into 16 flying
          polygonal screen shards so the real website shows through the cracks!
         ============================================================== */}
      {!isShattering && (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(rgba(251, 238, 224, 0.16) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <motion.div
            animate={
              isCracking
                ? { scale: 1.35, opacity: 0.9 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.22 }}
            className={`absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl pointer-events-none ${
              isCracking ? 'bg-[#e59b63]/50' : 'bg-[#9d613c]/25'
            }`}
          />
        </>
      )}

      {/* ==============================================================
          2. 16 INTERLOCKING FULL-VIEWPORT SHATTERING SCREEN SHARDS
          Covers 100% of the viewport and blasts apart in 3D on detonation!
         ============================================================== */}
      {(isCracking || isShattering) && (
        <div
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {SCREEN_SHARDS.map((shard) => {
            const clipPolygon = `polygon(${shard.points
              .map(([px, py]) => `${px}% ${py}%`)
              .join(', ')})`;
            const svgPoints = shard.points.map(([px, py]) => `${px},${py}`).join(' ');

            return (
              <motion.div
                key={shard.id}
                initial={{
                  x: 0,
                  y: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  opacity: 1,
                }}
                animate={
                  isShattering
                    ? {
                        x: shard.tx,
                        y: shard.ty,
                        rotateZ: shard.rotZ,
                        rotateX: shard.rotX,
                        rotateY: shard.rotY,
                        scale: shard.scale,
                        opacity: [1, 0.96, 0],
                      }
                    : {
                        // Subtle fracture separation during cracking phase
                        x: `${(shard.cx - 50) * 0.08}vw`,
                        y: `${(shard.cy - 50) * 0.08}vh`,
                        scale: 0.995,
                        opacity: 1,
                      }
                }
                transition={
                  isShattering
                    ? {
                        duration: 0.86,
                        delay: shard.delay,
                        times: [0, 0.72, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }
                    : { duration: 0.18, ease: 'easeOut' }
                }
                style={{
                  clipPath: clipPolygon,
                  WebkitClipPath: clipPolygon,
                  transformOrigin: `${shard.cx}% ${shard.cy}%`,
                }}
                className="absolute inset-0 bg-[#0a0e15] will-change-transform"
              >
                {/* Matching Sketchbook Dot-Grid Inside Each Broken Screen Shard */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(251, 238, 224, 0.16) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Glass Refraction Sheen Across Shard Surface */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, rgba(251,238,224,${shard.glintOpacity}) 0%, rgba(229,155,99,0.06) 48%, transparent 100%)`,
                  }}
                />

                {/* Glowing Fractured Glass Bevel Edge Along Shard Perimeter */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full"
                >
                  <polygon
                    points={svgPoints}
                    fill="none"
                    stroke={shard.edgeColor}
                    strokeWidth="0.65"
                     vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points={svgPoints}
                    fill="none"
                    stroke="#FBEEE0"
                    strokeWidth="0.3"
                    strokeOpacity="0.85"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ==============================================================
          3. SPIDERWEB GLASS CRACK LINES OVERLAY & IMPACT FLASH
          Flashes brightly at the moment of impact before shards fly apart!
         ============================================================== */}
      <AnimatePresence>
        {isCracking && (
          <motion.div
            key="spiderweb-crack-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-0 pointer-events-none z-30"
          >
            {/* Central Impact Flash */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#fbeee0] blur-xl"
            />

            {/* Full-Viewport Spiderweb Fracture Lines */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(251,238,224,0.85)]"
            >
              {/* Primary Radial Fracture Rays from Center (50, 50) */}
              <path
                d="M50,50 L50,22 L48,0 M50,50 L73,27 L100,0 M50,50 L78,50 L100,52 M50,50 L71,74 L100,100 M50,50 L50,79 L52,100 M50,50 L27,72 L0,100 M50,50 L21,49 L0,48 M50,50 L28,26 L0,0"
                stroke="#FBEEE0"
                strokeWidth="0.45"
                fill="none"
              />
              {/* Inner & Outer Concentric Spiderweb Fracture Rings */}
              <polygon
                points="50,22 73,27 78,50 71,74 50,79 27,72 21,49 28,26"
                stroke="#E59B63"
                strokeWidth="0.38"
                fill="none"
              />
              <polygon
                points="50,36 62,38 65,50 61,62 50,65 38,61 35,49 39,37"
                stroke="#22C55E"
                strokeWidth="0.35"
                fill="none"
              />
              {/* Secondary Branching Hairline Cracks */}
              <path
                d="M62,38 L86,18 M65,50 L92,38 M61,62 L88,82 M38,61 L14,84 M35,49 L8,62 M39,37 L15,18 M50,22 L64,8 M50,79 L36,94"
                stroke="#FBEEE0"
                strokeWidth="0.28"
                strokeOpacity="0.85"
                fill="none"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          4. SHATTER SHOCKWAVE, FLYING GLASS SPLINTERS & IMPACT BADGE
         ============================================================== */}
      <AnimatePresence>
        {isShattering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            {/* Expanding Glass-Break Shockwave Ring */}
            <motion.div
              initial={{ scale: 0.15, opacity: 1 }}
              animate={{ scale: 4.6, opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border-[3px] border-dashed border-[#fbeee0] shadow-[0_0_40px_rgba(251,238,224,0.75)]"
            />

            {/* Jagged Glass Starburst Flash at Impact Point */}
            <motion.svg
              viewBox="-120 -120 240 240"
              initial={{ scale: 0.2, opacity: 1, rotate: -8 }}
              animate={{ scale: [0.2, 1.85, 2.6], opacity: [1, 0.85, 0], rotate: 18 }}
              transition={{ duration: 0.62, times: [0, 0.38, 1], ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-68 h-68 sm:w-88 sm:h-88 overflow-visible"
            >
              <polygon
                points="0,-112 22,-48 84,-82 48,-22 114,-6 52,20 94,78 30,50 12,112 -18,52 -78,90 -48,24 -112,8 -52,-20 -90,-78 -24,-48"
                fill="#E59B63"
                stroke="#FBEEE0"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <polygon
                points="0,-72 16,-30 56,-52 32,-12 76,0 34,16 58,52 18,34 0,72 -16,34 -56,52 -32,12 -74,0 -34,-16 -56,-52 -18,-34"
                fill="#22C55E"
                stroke="#0A0E15"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <polygon
                points="0,-40 10,-16 34,-28 18,-6 42,4 18,12 30,34 8,20 -4,40 -12,18 -34,28 -18,6 -40,-6 -16,-14 -28,-34 -8,-18"
                fill="#FBEEE0"
              />
            </motion.svg>

            {/* 14 Sharp Crystalline Glass Splinters Flying Toward Camera */}
            {GLASS_SPLINTERS.map((splinter) => (
              <motion.div
                key={splinter.id}
                initial={{ x: 0, y: 0, scale: 0.25, rotate: 0, opacity: 1 }}
                animate={{
                  x: splinter.tx,
                  y: splinter.ty,
                  scale: [0.35, splinter.scale, splinter.scale * 0.8],
                  rotate: splinter.rot,
                  opacity: [1, 0.95, 0],
                }}
                transition={{
                  duration: 0.78,
                  times: [0, 0.66, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute"
              >
                <svg width="36" height="36" viewBox="-18 -18 36 36" className="overflow-visible">
                  <polygon
                    points={splinter.shape}
                    fill={splinter.color}
                    fillOpacity="0.88"
                    stroke="#FBEEE0"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="-5"
                    y1="-6"
                    x2="5"
                    y2="6"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    strokeOpacity="0.75"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Foreground Floating Doodle Stars */}
      <motion.div
        animate={
          isShattering
            ? { x: -250, y: -195, rotate: -145, scale: 1.8, opacity: 0 }
            : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/4 left-1/4 pointer-events-none hidden sm:block z-20 will-change-transform"
      >
        <DoodleStar className="w-6 h-6 text-[#e59b63]/60 animate-twinkle" />
      </motion.div>
      <motion.div
        animate={
          isShattering
            ? { x: 250, y: 195, rotate: 145, scale: 1.8, opacity: 0 }
            : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-1/4 right-1/4 pointer-events-none hidden sm:block z-20 will-change-transform"
      >
        <DoodleStar className="w-7 h-7 text-[#fbeee0]/50 animate-twinkle" />
      </motion.div>

      {/* ==============================================================
          5. ANIMATED CHARACTER SCENE (PUNCHES THE SCREEN TO SHATTER IT,
             THEN DETONATES OUTWARD WITH THE GLASS SHARDS!)
         ============================================================== */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={
          isCracking
            ? {
                y: -6,
                opacity: 1,
                scale: 1.18,
              }
            : {
                y: 0,
                opacity: 1,
                scale: 1,
              }
        }
        transition={
          isCracking
            ? { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            : { type: 'spring', stiffness: 280, damping: 22 }
        }
        style={{ transformOrigin: '50% 48%' }}
        className="relative z-20 flex flex-col items-center will-change-transform"
      >
        {/* Dynamic Doodle Speech Bubble Above Character */}
        <motion.div
          animate={
            isShattering
              ? { y: -195, x: -40, rotate: -28, scale: 1.35, opacity: 0 }
              : isCracking
              ? { y: -8, scale: 1.14, rotate: 2, opacity: 1 }
              : { y: 0, scale: 1, rotate: 0, opacity: 1 }
          }
          transition={{ duration: isShattering ? 0.58 : 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={
                isCracking || isShattering
                  ? 'shatter-msg'
                  : isReady
                  ? 'ready-msg'
                  : isSyncing
                  ? 'sync-msg'
                  : 'init-msg'
              }
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              className={`mb-2 px-4 py-1 rounded-[16px_11px_18px_12px] bg-[#101722] border-2 text-sm sm:text-base font-hand tracking-wide text-[#fbeee0] shadow-[4px_4px_0px_#9d613c] rotate-[-2deg] whitespace-nowrap ${
                isCracking || isShattering ? 'border-[#22c55e] bg-[#14221e]' : 'border-[#fbeee0]'
              }`}
            >
              {isCracking || isShattering ? (
                <span className="text-[#e59b63] font-bold">💥 SHATTERING SCREEN... LIVE! ⚡</span>
              ) : isReady ? (
                <span className="text-emerald-300">gm ser! we are live 🚀</span>
              ) : isSyncing ? (
                <span>fetching node data... ({roundedProgress}%) ⚡</span>
              ) : (
                <span>warming up node... ({roundedProgress}%) ☕</span>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Large Centerpiece Animated Character SVG (Rigged for Multi-Part Detonation with Screen Shatter) */}
        <svg
          viewBox="0 0 220 150"
          className="w-72 h-48 sm:w-88 sm:h-58 overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
          fill="none"
        >
          {/* Ground Sketch Shadow */}
          <motion.ellipse
            cx="110"
            cy="134"
            rx="78"
            ry="7"
            fill="#05080C"
            fillOpacity="0.8"
            animate={
              isShattering
                ? { scaleX: 2.2, opacity: 0 }
                : isCracking
                ? { scaleX: 1.15, opacity: 0.95 }
                : { scaleX: 1, opacity: 0.8 }
            }
            transition={{ duration: 0.45 }}
          />

          {/* PART 1: LEFT MINI VALIDATOR SERVER RACK TOWER */}
          <motion.g
            animate={
              isShattering
                ? { x: -235, y: -135, rotate: -58, scale: 1.25, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '40px 80px' }}
          >
            <g transform="translate(18, 38)">
              <rect
                x="0"
                y="12"
                width="44"
                height="78"
                rx="6"
                fill="#101824"
                stroke="#FBEEE0"
                strokeWidth="2.2"
              />
              <rect x="6" y="20" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.4" />
              <rect x="6" y="40" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.4" />
              <rect x="6" y="60" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.4" />

              <circle cx="12" cy="27" r="2.2" fill="#22C55E" />
              <motion.circle
                cx="19"
                cy="27"
                r="2.2"
                fill="#E59B63"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.45, repeat: Infinity }}
              />
              <circle cx="12" cy="47" r="2.2" fill={roundedProgress > 32 ? '#22C55E' : '#64748B'} />
              <motion.circle
                cx="19"
                cy="47"
                r="2.2"
                fill="#22C55E"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <circle cx="12" cy="67" r="2.2" fill={roundedProgress > 68 ? '#22C55E' : '#64748B'} />
              <circle cx="19" cy="67" r="2.2" fill={roundedProgress > 88 ? '#22C55E' : '#E59B63'} />

              <motion.g
                animate={{ rotate: [-18, 18, -18] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '22px 12px' }}
              >
                <line x1="22" y1="12" x2="22" y2="3" stroke="#FBEEE0" strokeWidth="2" />
                <path d="M13 4C16 0 28 0 31 4" stroke="#E59B63" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="22" cy="1" r="2.2" fill="#22C55E" />
              </motion.g>
            </g>
          </motion.g>

          {/* PART 2: POWER CONDUIT CABLE */}
          <motion.g
            animate={
              isShattering
                ? { x: -140, y: 155, rotate: 72, scale: 0.85, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.66, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '78px 110px' }}
          >
            <path
              d="M62 106C74 118 84 118 94 108"
              stroke="#9D613C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <motion.path
              d="M62 106C74 118 84 118 94 108"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [20, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </motion.g>

          {/* CENTER: CHIBI CRT NODE OPERATOR ("UNIT-00") */}
          <g transform="translate(68, 18)">
            {/* PART 3: Operator Hoodie Torso */}
            <motion.g
              animate={
                isShattering
                  ? { x: -105, y: 175, rotate: -42, scale: 1.25, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '45px 84px' }}
            >
              <path
                d="M21 72C21 65 26 61 33 61H57C64 61 69 65 69 72L73 106H17L21 72Z"
                fill="#1B283B"
                stroke="#FBEEE0"
                strokeWidth="2.2"
              />
              <rect x="36" y="75" width="18" height="11" rx="3" fill="#0B1018" stroke="#E59B63" strokeWidth="1.4" />
              <text x="45" y="83" textAnchor="middle" fill="#22C55E" fontSize="7" fontFamily="monospace" fontWeight="bold">
                U_
              </text>
            </motion.g>

            {/* Animated Head + Headphones Assembly */}
            <motion.g
              animate={
                isShattering
                  ? { y: 0, rotate: 0 }
                  : {
                      y: isReady ? [0, -6, 0] : [0, -3.5, 0],
                      rotate: isReady ? [-3, 3, -3] : [-1.2, 1.2, -1.2],
                    }
              }
              transition={{
                duration: isReady ? 0.55 : 1.4,
                repeat: isShattering ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* PART 4: Headphone Band & Top Antenna */}
              <motion.g
                animate={
                  isShattering
                    ? { x: -20, y: -245, rotate: -36, scale: 1.38, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '45px 20px' }}
              >
                <path
                  d="M11 40C11 19 26 9 45 9C64 9 79 19 79 40"
                  stroke="#E59B63"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line x1="45" y1="9" x2="45" y2="0" stroke="#FBEEE0" strokeWidth="2.2" strokeLinecap="round" />
                <motion.circle
                  cx="45"
                  cy="-1"
                  r="3.8"
                  fill={isReady || isCracking ? '#22C55E' : '#E59B63'}
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </motion.g>

              {/* PART 5A & 5B: Left & Right Earcups */}
              <motion.rect
                x="5"
                y="30"
                width="10"
                height="22"
                rx="5"
                fill="#9D613C"
                stroke="#FBEEE0"
                strokeWidth="1.8"
                animate={
                  isShattering
                    ? { x: -220, y: -70, rotate: -125, scale: 1.35, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.rect
                x="75"
                y="30"
                width="10"
                height="22"
                rx="5"
                fill="#9D613C"
                stroke="#FBEEE0"
                strokeWidth="1.8"
                animate={
                  isShattering
                    ? { x: 220, y: -65, rotate: 125, scale: 1.35, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* PART 6: CRT Monitor Head Shell & Visor */}
              <motion.g
                animate={
                  isShattering
                    ? { x: 38, y: -210, rotate: 28, scale: 1.6, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '45px 39px' }}
              >
                <rect
                  x="14"
                  y="16"
                  width="62"
                  height="46"
                  rx="13"
                  fill="#FBEEE0"
                  stroke="#141C28"
                  strokeWidth="2.2"
                />
                <rect
                  x="16"
                  y="18"
                  width="58"
                  height="42"
                  rx="11"
                  fill="none"
                  stroke={isCracking ? '#22C55E' : '#9D613C'}
                  strokeWidth="1.5"
                />

                <rect
                  x="21"
                  y="23"
                  width="48"
                  height="31"
                  rx="8"
                  fill="#090E16"
                  stroke="#26364D"
                  strokeWidth="1.6"
                />
                <path d="M25 27H35L30 34H24V28C24 27.4 24.4 27 25 27Z" fill="#FFFFFF" fillOpacity="0.1" />

                {isCracking || isShattering ? (
                  <g>
                    <path
                      d="M28 32L37 37L28 42"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M62 32L53 37L62 42"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="45" cy="45" r="4" fill="#E59B63" stroke="#FBEEE0" strokeWidth="1.5" />
                  </g>
                ) : isReady ? (
                  <g>
                    <path
                      d="M29 38C31 33.5 36 33.5 38 38"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M52 38C54 33.5 59 33.5 61 38"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <rect x="25" y="41" width="5" height="2.5" rx="1" fill="#E59B63" />
                    <rect x="60" y="41" width="5" height="2.5" rx="1" fill="#E59B63" />
                    <path
                      d="M40 43C42 47 48 47 50 43"
                      stroke="#FBEEE0"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </g>
                ) : (
                  <g>
                    <motion.rect
                      x="31"
                      y="32"
                      width="6"
                      height="9"
                      rx="3"
                      fill="#22C55E"
                      animate={{ scaleY: [1, 1, 0.15, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
                    />
                    <motion.rect
                      x="53"
                      y="32"
                      width="6"
                      height="9"
                      rx="3"
                      fill="#22C55E"
                      animate={{ scaleY: [1, 1, 0.15, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
                    />
                    <rect x="38" y="45" width="14" height="3" rx="1.5" fill="#E59B63" />
                  </g>
                )}
              </motion.g>
            </motion.g>

            {/* PART 7A & 7B: Chibi Hands (Punch screen on crack, blast outward on shatter!) */}
            <motion.circle
              cx="29"
              cy={isReady ? 84 : 98}
              r="5"
              fill="#FBEEE0"
              stroke="#9D613C"
              strokeWidth="1.8"
              animate={
                isShattering
                  ? { x: -200, y: -40, scale: 1.4, opacity: 0 }
                  : isCracking
                  ? { x: -8, y: -18, scale: 1.65 }
                  : isReady
                  ? { y: [-6, 2, -6] }
                  : { y: [0, -4.5, 0, -3.5, 0] }
              }
              transition={{ duration: isShattering ? 0.68 : isCracking ? 0.16 : 0.45, repeat: isShattering || isCracking ? 0 : Infinity }}
            />
            <motion.circle
              cx="61"
              cy={isReady ? 84 : 98}
              r="5"
              fill="#FBEEE0"
              stroke="#9D613C"
              strokeWidth="1.8"
              animate={
                isShattering
                  ? { x: 200, y: -35, scale: 1.4, opacity: 0 }
                  : isCracking
                  ? { x: 8, y: -18, scale: 1.65 }
                  : isReady
                  ? { y: [2, -6, 2] }
                  : { y: [-4, 0, -4.5, 0, -4] }
              }
              transition={{ duration: isShattering ? 0.68 : isCracking ? 0.16 : 0.45, repeat: isShattering || isCracking ? 0 : Infinity }}
            />

            {/* PART 8: Mechanical Terminal Keyboard Deck & Progress Strip */}
            <motion.g
              animate={
                isShattering
                  ? { x: 42, y: 195, rotate: 40, scale: 1.35, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '45px 110px' }}
            >
              <rect
                x="15"
                y="102"
                width="60"
                height="10"
                rx="3.5"
                fill="#0B1018"
                stroke="#FBEEE0"
                strokeWidth="1.8"
              />
              <line
                x1="22"
                y1="107"
                x2="68"
                y2="107"
                stroke="#E59B63"
                strokeWidth="2.2"
                strokeDasharray="4 3"
              />
              <rect
                x="20"
                y="116"
                width="50"
                height="4.5"
                rx="2.2"
                fill="#090D14"
                stroke="#FBEEE0"
                strokeWidth="1"
              />
              <rect
                x="21"
                y="117"
                width={Math.max(2, (48 * roundedProgress) / 100)}
                height="2.5"
                rx="1.2"
                fill="#22C55E"
              />
            </motion.g>
          </g>

          {/* PART 9: RIGHT SIDE LEVITATING ISOMETRIC BLOCKCHAIN CUBES */}
          <motion.g
            transform="translate(168, 48)"
            animate={
              isShattering
                ? { x: 240, y: -160, rotate: 98, scale: 1.5, opacity: 0 }
                : { y: [0, -8, 0], rotate: [-2, 3, -2] }
            }
            transition={{
              duration: isShattering ? 0.72 : 2,
              repeat: isShattering ? 0 : Infinity,
              ease: isShattering ? [0.16, 1, 0.3, 1] : 'easeInOut',
            }}
          >
            <polygon
              points="18,4 34,12 18,20 2,12"
              fill="#FBEEE0"
              stroke="#141C28"
              strokeWidth="1.6"
            />
            <polygon
              points="2,12 18,20 18,38 2,30"
              fill="#E59B63"
              stroke="#141C28"
              strokeWidth="1.6"
            />
            <polygon
              points="18,20 34,12 34,30 18,38"
              fill="#9D613C"
              stroke="#FBEEE0"
              strokeWidth="1.4"
            />
            <motion.circle
              cx="36"
              cy="6"
              r="3.5"
              fill="#22C55E"
              stroke="#0B1018"
              strokeWidth="1.2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.g>

          {/* PART 10: STEAMING COFFEE MUG ON RIGHT DESK CORNER */}
          <motion.g
            animate={
              isShattering
                ? { x: 230, y: 145, rotate: 135, scale: 1.35, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '180px 112px' }}
          >
            <g transform="translate(172, 102)">
              <rect
                x="0"
                y="8"
                width="16"
                height="18"
                rx="3"
                fill="#9D613C"
                stroke="#FBEEE0"
                strokeWidth="1.8"
              />
              <path
                d="M16 12H19.5C21.5 12 22.5 13.5 22.5 15.5C22.5 17.5 21.5 19 19.5 19H16"
                stroke="#FBEEE0"
                strokeWidth="1.8"
              />
              <motion.path
                d="M5 4C5 1 8 1 8 -2"
                stroke="#FBEEE0"
                strokeWidth="1.6"
                strokeLinecap="round"
                animate={{ y: [0, -5], opacity: [0.8, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <motion.path
                d="M11 5C11 2 14 2 14 -1"
                stroke="#E59B63"
                strokeWidth="1.6"
                strokeLinecap="round"
                animate={{ y: [0, -5], opacity: [0.8, 0] }}
                transition={{ duration: 1.4, delay: 0.5, repeat: Infinity }}
              />
            </g>
          </motion.g>
        </svg>

        {/* Floating Hand-Drawn Status Caption & Skip Button Below Character */}
        <motion.div
          animate={
            isShattering
              ? { y: 130, scale: 0.85, opacity: 0 }
              : isCracking
              ? { y: 4, scale: 0.95, opacity: 0.9 }
              : { y: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: isShattering ? 0.52 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p className="mt-2 font-hand text-lg sm:text-xl text-[#fbeee0] tracking-wide">
            {currentStage.text}
          </p>

          {/* Subtle Skip Button */}
          <button
            type="button"
            onClick={triggerScreenShatterExit}
            className="mt-3 font-hand text-sm text-[#bba998] hover:text-[#e59b63] underline decoration-dashed underline-offset-4 cursor-pointer transition-colors"
          >
            Skip →
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
