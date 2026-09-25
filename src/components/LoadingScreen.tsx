import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoodleTape, DoodleCornerHatch, DoodleRays, DoodleStar, WavyUnderline } from './Doodles';

interface LoadingScreenProps {
  onFinish: () => void;
}

const BOOT_LOGS = [
  { threshold: 10, text: 'Mounting encrypted validator keystore...' },
  { threshold: 35, text: 'Establishing P2P mesh: Aptos • Sei • SubQuery...' },
  { threshold: 65, text: 'Arming 24/7 sentry & slashing guard...' },
  { threshold: 90, text: 'Consensus synced! Ready to launch portfolio ✓' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2200; // 2.2s snappy, engaging boot sequence
    const intervalMs = 25;
    const step = 100 / (duration / intervalMs);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Slight organic easing boost near the end
        const increment = prev > 80 ? step * 1.35 : step;
        return Math.min(100, prev + increment);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !isExiting) {
      const doneTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onFinish, 480);
      }, 380);
      return () => clearTimeout(doneTimer);
    }
  }, [progress, isExiting, onFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onFinish, 300);
  };

  const roundedProgress = Math.min(100, Math.round(progress));
  const isReady = roundedProgress >= 92;
  const isSyncing = roundedProgress >= 35 && roundedProgress < 92;

  const currentLog =
    [...BOOT_LOGS].reverse().find((log) => roundedProgress >= log.threshold)?.text ||
    'Booting Uray Fazli Node OS v2.6...';

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="boot-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#0a0e15] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none"
          role="status"
          aria-live="polite"
          aria-label="Loading Uray Fazli Alman Portfolio"
        >
          {/* Subtle Notebook Dot-Grid & Warm Ambient Glow */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(251, 238, 224, 0.16) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#9d613c]/15 blur-3xl pointer-events-none" />

          {/* Floating Background Doodle Stars */}
          <DoodleStar className="absolute top-12 left-12 w-6 h-6 text-[#e59b63]/50 animate-twinkle hidden sm:block" />
          <DoodleStar className="absolute bottom-14 right-14 w-7 h-7 text-[#fbeee0]/40 animate-twinkle hidden sm:block" />

          {/* Main Hand-Drawn Doodle Sketchbook Boot Card */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="doodle-card w-full max-w-md p-6 sm:p-8 relative z-10 flex flex-col items-center text-center"
          >
            {/* Top Sketchbook Masking Tape */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
              <DoodleTape className="w-28 h-6" />
            </div>

            {/* Corner Sketch Hatch Marks */}
            <DoodleCornerHatch className="absolute top-2.5 left-2.5 w-6 h-6 text-[#9d613c]/50 pointer-events-none" />

            {/* Top Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1018] border-[1.5px] border-dashed border-[#fbeee0]/50 mb-3">
              <span
                className={`w-2 h-2 rounded-full ${
                  isReady ? 'bg-emerald-400' : 'bg-[#e59b63] animate-ping'
                }`}
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#fbeee0]">
                {isReady ? 'NODE ONLINE • READY' : 'BOOTING VALIDATOR OS'}
              </span>
            </div>

            {/* ==============================================================
                BESPOKE RIGGED ANIMATED CHARACTER SCENE (NO AI SLOP)
                Chibi CRT Operator + Server Rack + Levitating Genesis Cube
               ============================================================== */}
            <div className="relative my-2 flex items-center justify-center">
              {/* Pop-up Hand-Drawn Speech Bubble */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isReady ? 'ready-msg' : isSyncing ? 'sync-msg' : 'init-msg'}
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="absolute -top-4 right-1 sm:-right-4 px-3 py-0.5 rounded-[14px_10px_15px_11px] bg-[#0b1018] border-2 border-[#fbeee0] text-xs font-hand tracking-wide text-[#fbeee0] shadow-[3px_3px_0px_#9d613c] rotate-[3deg] z-20 whitespace-nowrap"
                >
                  {isReady ? (
                    <span className="text-emerald-300">gm ser! we are live 🚀</span>
                  ) : isSyncing ? (
                    <span>syncing blocks... ⚡</span>
                  ) : (
                    <span>warming up node... ☕</span>
                  )}
                </motion.div>
              </AnimatePresence>

              <svg
                viewBox="0 0 220 145"
                className="w-56 h-36 sm:w-64 sm:h-40 overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                fill="none"
              >
                {/* Ground Sketch Shadow */}
                <ellipse cx="110" cy="134" rx="76" ry="6" fill="#070A0F" fillOpacity="0.75" />

                {/* ----------------------------------------------------------
                    LEFT SIDE: MINI VALIDATOR SERVER RACK TOWER
                   ---------------------------------------------------------- */}
                <g transform="translate(18, 38)">
                  {/* Rack Chassis */}
                  <rect
                    x="0"
                    y="12"
                    width="44"
                    height="78"
                    rx="6"
                    fill="#101824"
                    stroke="#FBEEE0"
                    strokeWidth="2"
                  />
                  {/* Rack Server Blades */}
                  <rect x="6" y="20" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.3" />
                  <rect x="6" y="40" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.3" />
                  <rect x="6" y="60" width="32" height="14" rx="3" fill="#090D14" stroke="#9D613C" strokeWidth="1.3" />

                  {/* Blinking Server Telemetry LEDs */}
                  <circle cx="12" cy="27" r="2.2" fill="#22C55E" />
                  <motion.circle
                    cx="19"
                    cy="27"
                    r="2.2"
                    fill="#E59B63"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.45, repeat: Infinity }}
                  />
                  <circle cx="12" cy="47" r="2.2" fill={roundedProgress > 30 ? '#22C55E' : '#64748B'} />
                  <motion.circle
                    cx="19"
                    cy="47"
                    r="2.2"
                    fill="#22C55E"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <circle cx="12" cy="67" r="2.2" fill={roundedProgress > 65 ? '#22C55E' : '#64748B'} />
                  <circle cx="19" cy="67" r="2.2" fill={roundedProgress > 85 ? '#22C55E' : '#E59B63'} />

                  {/* Top Rotating Radar Dish on Rack */}
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

                {/* Power Conduit Cable Connecting Server Rack to Operator Deck */}
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

                {/* ----------------------------------------------------------
                    CENTER: CHIBI CRT NODE OPERATOR ("UNIT-00")
                   ---------------------------------------------------------- */}
                <g transform="translate(68, 18)">
                  {/* Operator Hoodie Torso */}
                  <path
                    d="M21 72C21 65 26 61 33 61H57C64 61 69 65 69 72L73 106H17L21 72Z"
                    fill="#1B283B"
                    stroke="#FBEEE0"
                    strokeWidth="2"
                  />
                  {/* Hoodie Chest Badge */}
                  <rect x="36" y="75" width="18" height="11" rx="3" fill="#0B1018" stroke="#E59B63" strokeWidth="1.4" />
                  <text x="45" y="83" textAnchor="middle" fill="#22C55E" fontSize="7" fontFamily="monospace" fontWeight="bold">
                    U_
                  </text>

                  {/* Animated Head + Headphones Assembly */}
                  <motion.g
                    animate={{
                      y: isReady ? [0, -6, 0] : [0, -3, 0],
                      rotate: isReady ? [-3, 3, -3] : [-1, 1, -1],
                    }}
                    transition={{
                      duration: isReady ? 0.55 : 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {/* Headphone Arc */}
                    <path
                      d="M11 40C11 19 26 9 45 9C64 9 79 19 79 40"
                      stroke="#E59B63"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Left & Right Earcups */}
                    <rect x="5" y="30" width="10" height="22" rx="5" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.8" />
                    <rect x="75" y="30" width="10" height="22" rx="5" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.8" />

                    {/* Top Transceiver Antenna */}
                    <line x1="45" y1="9" x2="45" y2="0" stroke="#FBEEE0" strokeWidth="2.2" strokeLinecap="round" />
                    <motion.circle
                      cx="45"
                      cy="-1"
                      r="3.8"
                      fill={isReady ? '#22C55E' : '#E59B63'}
                      animate={{ scale: [1, 1.35, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />

                    {/* Main CRT Head Chassis */}
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
                    {/* Inner Sketch Border on CRT Chassis */}
                    <rect
                      x="16"
                      y="18"
                      width="58"
                      height="42"
                      rx="11"
                      fill="none"
                      stroke="#9D613C"
                      strokeWidth="1.5"
                    />

                    {/* Dark Visor Screen */}
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
                    {/* Visor Screen Glint */}
                    <path d="M25 27H35L30 34H24V28C24 27.4 24.4 27 25 27Z" fill="#FFFFFF" fillOpacity="0.1" />

                    {/* DYNAMIC VISOR EXPRESSIONS BASED ON PROGRESS */}
                    {isReady ? (
                      <g>
                        {/* Celebratory Happy Eyes ^ ^ */}
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
                        {/* Rosy Pixel Cheeks */}
                        <rect x="25" y="41" width="5" height="2.5" rx="1" fill="#E59B63" />
                        <rect x="60" y="41" width="5" height="2.5" rx="1" fill="#E59B63" />
                        {/* Big Happy Grin */}
                        <path
                          d="M40 43C42 47 48 47 50 43"
                          stroke="#FBEEE0"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : (
                      <g>
                        {/* Focused Coding Eyes */}
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
                        {/* Scanning Data Bar Mouth */}
                        <rect x="38" y="45" width="14" height="3" rx="1.5" fill="#E59B63" />
                      </g>
                    )}
                  </motion.g>

                  {/* Rapidly Typing / Celebrating Hands */}
                  <motion.circle
                    cx="29"
                    cy={isReady ? 84 : 98}
                    r="5"
                    fill="#FBEEE0"
                    stroke="#9D613C"
                    strokeWidth="1.8"
                    animate={
                      isReady
                        ? { y: [-6, 2, -6] }
                        : { y: [0, -4.5, 0, -3.5, 0] }
                    }
                    transition={{ duration: 0.45, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="61"
                    cy={isReady ? 84 : 98}
                    r="5"
                    fill="#FBEEE0"
                    stroke="#9D613C"
                    strokeWidth="1.8"
                    animate={
                      isReady
                        ? { y: [2, -6, 2] }
                        : { y: [-4, 0, -4.5, 0, -4] }
                    }
                    transition={{ duration: 0.45, repeat: Infinity }}
                  />

                  {/* Mechanical Terminal Keyboard Deck */}
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
                </g>

                {/* ----------------------------------------------------------
                    RIGHT SIDE: LEVITATING ISOMETRIC BLOCKCHAIN CUBES
                   ---------------------------------------------------------- */}
                <motion.g
                  transform="translate(168, 48)"
                  animate={{ y: [0, -8, 0], rotate: [-2, 3, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Isometric Block Top Face */}
                  <polygon
                    points="18,4 34,12 18,20 2,12"
                    fill="#FBEEE0"
                    stroke="#141C28"
                    strokeWidth="1.6"
                  />
                  {/* Isometric Block Left Face */}
                  <polygon
                    points="2,12 18,20 18,38 2,30"
                    fill="#E59B63"
                    stroke="#141C28"
                    strokeWidth="1.6"
                  />
                  {/* Isometric Block Right Face */}
                  <polygon
                    points="18,20 34,12 34,30 18,38"
                    fill="#9D613C"
                    stroke="#FBEEE0"
                    strokeWidth="1.4"
                  />

                  {/* Orbiting Mini Node Satellite */}
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

                {/* Steaming Coffee Mug on Right Desk Corner */}
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
              </svg>
            </div>

            {/* Title & Hand-Drawn Subtitle */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <h1 className="font-fredoka text-xl sm:text-2xl font-semibold tracking-wide text-[#fbeee0]">
                Uray Fazli Alman
              </h1>
              <DoodleRays className="w-5 h-5 text-[#e59b63] rotate-12" />
            </div>
            <p className="font-hand text-base sm:text-lg text-[#e59b63] -mt-0.5 mb-4">
              ~ Blockchain Node Operator & Systems Engineer ~
            </p>

            {/* Hand-Drawn Doodle Progress Bar */}
            <div className="w-full mb-2.5">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5 px-1">
                <span className="text-[#d8c7b6] truncate max-w-[78%] text-left">
                  &gt;_ {currentLog}
                </span>
                <span className="text-[#fbeee0] font-bold">{roundedProgress}%</span>
              </div>

              <div className="w-full h-4 p-0.5 bg-[#0b1018] border-2 border-[#fbeee0] rounded-[10px_8px_11px_9px] shadow-[3px_3px_0px_#9d613c] overflow-hidden">
                <motion.div
                  className="h-full rounded-[6px_5px_7px_6px] bg-gradient-to-r from-[#9d613c] via-[#e59b63] to-[#22c55e]"
                  style={{ width: `${roundedProgress}%` }}
                />
              </div>
            </div>

            {/* Bottom Wavy Doodle & Skip Button */}
            <div className="w-full mt-3 pt-2 border-t border-dashed border-[#fbeee0]/20 flex items-center justify-between">
              <WavyUnderline className="w-24 h-4 text-[#fbeee0]/70" />
              <button
                type="button"
                onClick={handleSkip}
                className="font-hand text-sm sm:text-base text-[#d8c7b6] hover:text-[#fbeee0] underline decoration-dashed underline-offset-4 cursor-pointer transition-colors"
              >
                Skip Boot →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
