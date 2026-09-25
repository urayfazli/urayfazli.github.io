import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Bespoke, multi-part rigged SVG characters for each portfolio card.
 * Engineered on a precision grid with layered hardware shading, visor expressions,
 * and independent limb/antenna motion — zero generic AI-slop geometry.
 */

/* ============================================================================
 * 1. ABOUT ME CARD CHARACTER — "DEV-UNIT 01" (Headphone CRT Coder + Coffee)
 * ============================================================================ */
export const AboutCoderCharacter: React.FC = () => {
  const [excited, setExcited] = useState(false);

  return (
    <div
      onClick={() => setExcited((prev) => !prev)}
      onMouseEnter={() => setExcited(true)}
      onMouseLeave={() => setExcited(false)}
      role="button"
      tabIndex={0}
      aria-label="Interactive Chibi Operator Character"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExcited((prev) => !prev);
        }
      }}
      className="relative inline-flex items-center select-none cursor-pointer group/char focus:outline-none"
    >
      {/* Interactive Speech Bubble */}
      <AnimatePresence>
        {excited && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute -top-8 right-0 sm:-left-20 whitespace-nowrap px-3 py-0.5 rounded-[14px_10px_15px_11px] bg-[#0b1018] border-2 border-[#fbeee0] text-xs font-hand tracking-wide text-[#fbeee0] shadow-[3px_3px_0px_#9d613c] rotate-[-2deg] z-20 pointer-events-none"
          >
            <span className="text-emerald-400">●</span> building web3... ✎
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 96 84"
        className="w-20 h-18 sm:w-24 sm:h-20 overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
        fill="none"
      >
        <defs>
          <linearGradient id="coderHoodie" x1="24" y1="48" x2="68" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#26354A" />
            <stop offset="100%" stopColor="#131B26" />
          </linearGradient>
          <linearGradient id="coderHead" x1="22" y1="14" x2="70" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBEEE0" />
            <stop offset="100%" stopColor="#D8C2AC" />
          </linearGradient>
          <linearGradient id="coderPhone" x1="14" y1="12" x2="78" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E59B63" />
            <stop offset="100%" stopColor="#9D613C" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="48" cy="78" rx="28" ry="4" fill="#070A0F" fillOpacity="0.7" />

        {/* Torso / Hoodie */}
        <path
          d="M27 52C27 47.5 31 45 36 45H56C61 45 65 47.5 65 52L68 72H24L27 52Z"
          fill="url(#coderHoodie)"
          stroke="#334763"
          strokeWidth="1.5"
        />
        {/* Hoodie Pocket & Drawstrings */}
        <path d="M35 62H57L59 71H33L35 62Z" fill="#0F1620" stroke="#233145" strokeWidth="1" />
        <line x1="42" y1="48" x2="42" y2="56" stroke="#E59B63" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="50" y1="48" x2="50" y2="56" stroke="#E59B63" strokeWidth="1.8" strokeLinecap="round" />

        {/* Floating / Breathing Head & Headphones Group */}
        <motion.g
          animate={{
            y: excited ? [0, -3.5, 0] : [0, -2, 0],
            rotate: excited ? [-2, 2, -2] : [0, 1, 0],
          }}
          transition={{
            duration: excited ? 0.6 : 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Headphone Band */}
          <path
            d="M19 32C19 16.5 31 8 46 8C61 8 73 16.5 73 32"
            stroke="url(#coderPhone)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Antenna on Right Earcup */}
          <line x1="74" y1="26" x2="79" y2="14" stroke="#E59B63" strokeWidth="2" strokeLinecap="round" />
          <motion.circle
            cx="79"
            cy="13"
            r="2.8"
            fill="#22C55E"
            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />

          {/* Left & Right Headphone Earcups */}
          <rect x="14" y="24" width="8" height="17" rx="4" fill="url(#coderPhone)" stroke="#FBEEE0" strokeWidth="1.2" />
          <rect x="70" y="24" width="8" height="17" rx="4" fill="url(#coderPhone)" stroke="#FBEEE0" strokeWidth="1.2" />

          {/* Main CRT / Bot Head Chassis */}
          <rect
            x="21"
            y="14"
            width="50"
            height="36"
            rx="11"
            fill="url(#coderHead)"
            stroke="#9D613C"
            strokeWidth="1.8"
          />
          {/* Top Chassis Vent Detail */}
          <line x1="40" y1="17.5" x2="52" y2="17.5" stroke="#9D613C" strokeWidth="1.5" strokeLinecap="round" />

          {/* Dark Glass Visor Screen */}
          <rect
            x="26"
            y="20"
            width="40"
            height="24"
            rx="7"
            fill="#0A0F17"
            stroke="#253549"
            strokeWidth="1.5"
          />
          {/* Visor Glass Glare */}
          <path d="M29 23H37L33 29H28V24C28 23.4 28.4 23 29 23Z" fill="#FFFFFF" fillOpacity="0.08" />

          {/* Expressive Visor Eyes & Mouth */}
          {excited ? (
            <g>
              {/* Happy Arc Eyes ^ ^ */}
              <path
                d="M33 31C34.5 27.5 38.5 27.5 40 31"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path
                d="M52 31C53.5 27.5 57.5 27.5 59 31"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              {/* Warm Blush Pixels */}
              <rect x="30" y="33.5" width="4" height="2" rx="1" fill="#E59B63" fillOpacity="0.8" />
              <rect x="58" y="33.5" width="4" height="2" rx="1" fill="#E59B63" fillOpacity="0.8" />
              {/* Happy Cat/Bot Smile */}
              <path
                d="M43 35C44.2 37 47.8 37 49 35"
                stroke="#FBEEE0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              {/* Focused Blinking LED Eyes */}
              <motion.rect
                x="34"
                y="27"
                width="5"
                height="7"
                rx="2.5"
                fill="#FBEEE0"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.46, 0.49, 0.52, 1] }}
              />
              <motion.rect
                x="53"
                y="27"
                width="5"
                height="7"
                rx="2.5"
                fill="#FBEEE0"
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.46, 0.49, 0.52, 1] }}
              />
              {/* Subtle Cheek Glow */}
              <circle cx="32" cy="35" r="1.5" fill="#9D613C" fillOpacity="0.6" />
              <circle cx="60" cy="35" r="1.5" fill="#9D613C" fillOpacity="0.6" />
              {/* Determined Little Mouth */}
              <line x1="44" y1="36" x2="48" y2="36" stroke="#E59B63" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </motion.g>

        {/* Animated Typing Hands on Mini Mechanical Keyboard */}
        <motion.circle
          cx="35"
          cy="68"
          r="4"
          fill="#FBEEE0"
          stroke="#9D613C"
          strokeWidth="1.4"
          animate={{ y: [0, -3, 0, -2, 0] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
        <motion.circle
          cx="57"
          cy="68"
          r="4"
          fill="#FBEEE0"
          stroke="#9D613C"
          strokeWidth="1.4"
          animate={{ y: [-2.5, 0, -3, 0, -2.5] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />

        {/* Mini Mechanical Keyboard Deck */}
        <rect x="26" y="70" width="40" height="7" rx="2.5" fill="#0B1018" stroke="#E59B63" strokeWidth="1.3" />
        <line x1="31" y1="73.5" x2="61" y2="73.5" stroke="#FBEEE0" strokeWidth="1.8" strokeDasharray="3 3" />

        {/* Cozy Coffee Mug Beside Operator */}
        <g transform="translate(73, 58)">
          <rect x="0" y="6" width="12" height="13" rx="2.5" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.3" />
          <path d="M12 9H14.5C15.8 9 16.5 10 16.5 11.5C16.5 13 15.8 14 14.5 14H12" stroke="#FBEEE0" strokeWidth="1.3" />
          {/* Rising Steam Wisps */}
          <motion.path
            d="M4 3C4 1 6 1 6 -1"
            stroke="#FBEEE0"
            strokeWidth="1.3"
            strokeLinecap="round"
            animate={{ y: [0, -4], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.path
            d="M8.5 4C8.5 2 10.5 2 10.5 0"
            stroke="#E59B63"
            strokeWidth="1.3"
            strokeLinecap="round"
            animate={{ y: [0, -4], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, delay: 0.7, repeat: Infinity, ease: 'easeOut' }}
          />
        </g>
      </svg>
    </div>
  );
};

/* ============================================================================
 * 2. NODE OPERATIONS CARD CHARACTER — "SENTRY-99" (Hovering Validator Mech)
 * ============================================================================ */
export const NodeSentryCharacter: React.FC = () => {
  const [scanning, setScanning] = useState(false);

  return (
    <div
      onClick={() => setScanning((prev) => !prev)}
      onMouseEnter={() => setScanning(true)}
      onMouseLeave={() => setScanning(false)}
      role="button"
      tabIndex={0}
      aria-label="Interactive Validator Sentry Mech"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setScanning((prev) => !prev);
        }
      }}
      className="relative inline-flex items-center select-none cursor-pointer focus:outline-none"
    >
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute -top-8 right-0 whitespace-nowrap px-3 py-0.5 rounded-[14px_10px_15px_11px] bg-[#0b1018] border-2 border-[#fbeee0] text-xs font-hand tracking-wide text-emerald-300 shadow-[3px_3px_0px_#9d613c] rotate-[2deg] z-20 pointer-events-none"
          >
            ✓ ZERO SLASHING • 99.9%
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 88 80"
        className="w-18 h-16 sm:w-22 sm:h-19 overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
        fill="none"
      >
        <defs>
          <linearGradient id="sentryArmor" x1="20" y1="16" x2="68" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#233146" />
            <stop offset="100%" stopColor="#0E1520" />
          </linearGradient>
          <linearGradient id="sentryTrim" x1="16" y1="14" x2="72" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E59B63" />
            <stop offset="100%" stopColor="#9D613C" />
          </linearGradient>
        </defs>

        {/* Pulsing Ground Thruster Ring */}
        <motion.ellipse
          cx="44"
          cy="73"
          rx="18"
          ry="3.5"
          fill="#22C55E"
          fillOpacity="0.25"
          animate={{ rx: [15, 21, 15], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />

        {/* Levitating Mech Body */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Top Rotating Radar Dish */}
          <motion.g
            animate={{ rotate: [-14, 14, -14] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '44px 16px' }}
          >
            <line x1="44" y1="16" x2="44" y2="8" stroke="#E59B63" strokeWidth="2.2" />
            <path d="M36 9C39 5.5 49 5.5 52 9" stroke="#FBEEE0" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="6" r="2.2" fill="#22C55E" />
          </motion.g>

          {/* Left & Right Hover Wing Stabilizers */}
          <path d="M12 32L22 26V44L14 46L12 32Z" fill="url(#sentryTrim)" stroke="#FBEEE0" strokeWidth="1.2" />
          <path d="M76 32L66 26V44L74 46L76 32Z" fill="url(#sentryTrim)" stroke="#FBEEE0" strokeWidth="1.2" />

          {/* Main Octagonal Armored Pod */}
          <path
            d="M28 16H60L67 24V48L59 56H29L21 48V24L28 16Z"
            fill="url(#sentryArmor)"
            stroke="url(#sentryTrim)"
            strokeWidth="2"
          />

          {/* Recessed Tactical Visor Slot */}
          <rect x="26" y="25" width="36" height="17" rx="5" fill="#070B10" stroke="#31445E" strokeWidth="1.4" />

          {/* Scanning Laser Optic Eye */}
          <motion.g
            animate={{ x: scanning ? [-7, 7, -7] : [-3, 3, -3] }}
            transition={{ duration: scanning ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="44" cy="33.5" r="5.5" fill="#10B981" fillOpacity="0.25" />
            <circle cx="44" cy="33.5" r="3.8" fill="#22C55E" />
            <circle cx="42.8" cy="32.2" r="1.3" fill="#DCFCE7" />
          </motion.g>

          {/* Front Chest Telemetry Bars */}
          <rect x="31" y="46" width="10" height="4" rx="1.5" fill="#22C55E" />
          <rect x="43" y="46" width="6" height="4" rx="1.5" fill="#E59B63" />
          <rect x="51" y="46" width="6" height="4" rx="1.5" fill="#FBEEE0" fillOpacity="0.5" />

          {/* Floating Mini Security Shield on Right Side */}
          <motion.g
            animate={{ y: [-2, 2, -2], rotate: [-4, 4, -4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <path
              d="M74 44L82 47V54C82 58.5 78.5 61.5 74 63C69.5 61.5 66 58.5 66 54V47L74 44Z"
              fill="#141C28"
              stroke="#22C55E"
              strokeWidth="1.6"
            />
            <path d="M71.5 53.5L73.5 55.5L77 51.5" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          {/* Bottom Jet Thruster Flame */}
          <motion.path
            d="M38 56H50L47 65L44 62L41 65L38 56Z"
            fill="#22C55E"
            animate={{ scaleY: [0.85, 1.25, 0.85], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 0.45, repeat: Infinity }}
            style={{ transformOrigin: '44px 56px' }}
          />
        </motion.g>
      </svg>
    </div>
  );
};

/* ============================================================================
 * 3. NETWORK SUB-CARD MINI COMPANIONS (Aptos, Sei, SubQuery)
 * ============================================================================ */
export const NetworkDroidCharacter: React.FC<{ type: 'aptos' | 'sei' | 'subquery' }> = ({ type }) => {
  if (type === 'aptos') {
    // Aptos Aero-Sprinter Droid (High-TPS Speed Unit with Cyan/Emerald Visor)
    return (
      <motion.svg
        viewBox="0 0 48 48"
        className="w-11 h-11 overflow-visible shrink-0"
        fill="none"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Speed Halo Ring */}
        <motion.ellipse
          cx="24"
          cy="10"
          rx="10"
          ry="2.5"
          stroke="#22C55E"
          strokeWidth="1.5"
          animate={{ scaleX: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Sleek Aero Helmet */}
        <path
          d="M12 22C12 15.5 17 12 24 12C31 12 36 15.5 36 22V33C36 36.5 33 39 29 39H19C15 39 12 36.5 12 33V22Z"
          fill="#182334"
          stroke="#FBEEE0"
          strokeWidth="1.5"
        />
        {/* Aero Side Fins */}
        <path d="M12 23L7 20V29L12 31V23Z" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1" />
        <path d="M36 23L41 20V29L36 31V23Z" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1" />
        {/* Visor */}
        <rect x="15" y="19" width="18" height="11" rx="4.5" fill="#080C12" stroke="#9D613C" strokeWidth="1.2" />
        {/* Expressive Speed Eyes */}
        <path d="M18.5 23.5L22 25L18.5 26.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29.5 23.5L26 25L29.5 26.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Aptos Stripe Detail */}
        <line x1="19" y1="34.5" x2="29" y2="34.5" stroke="#E59B63" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (type === 'sei') {
    // Sei Twin-Turbo Parallel Bot (Dual-Core Lightning Horns & Crimson/Amber Visor)
    return (
      <motion.svg
        viewBox="0 0 48 48"
        className="w-11 h-11 overflow-visible shrink-0"
        fill="none"
        animate={{ y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Dual Parallel Horns / Antennas */}
        <path d="M15 14L11 7L18 11" fill="#E59B63" stroke="#FBEEE0" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M33 14L37 7L30 11" fill="#E59B63" stroke="#FBEEE0" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Armored Cube Head */}
        <rect x="11" y="13" width="26" height="25" rx="7" fill="#182334" stroke="#E59B63" strokeWidth="1.6" />
        {/* Visor */}
        <rect x="14.5" y="18" width="19" height="12" rx="4" fill="#080C12" />
        {/* Glowing Twin Eyes */}
        <motion.circle
          cx="20"
          cy="24"
          r="2.3"
          fill="#F97316"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <motion.circle
          cx="28"
          cy="24"
          r="2.3"
          fill="#F97316"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        {/* Happy Grin */}
        <path d="M21.5 27.5H26.5" stroke="#FBEEE0" strokeWidth="1.6" strokeLinecap="round" />
        {/* Parallel Core Indicator Dots */}
        <circle cx="21" cy="34" r="1.3" fill="#22C55E" />
        <circle cx="27" cy="34" r="1.3" fill="#22C55E" />
      </motion.svg>
    );
  }

  // SubQuery Indexer Owl-Bot (Big Analytical Monocle Lens + Data Antenna)
  return (
    <motion.svg
      viewBox="0 0 48 48"
      className="w-11 h-11 overflow-visible shrink-0"
      fill="none"
      animate={{ y: [0, -2.5, 0] }}
      transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Top Data Dish */}
      <line x1="24" y1="12" x2="24" y2="6" stroke="#FBEEE0" strokeWidth="1.6" />
      <motion.circle
        cx="24"
        cy="5.5"
        r="2.2"
        fill="#38BDF8"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.3, repeat: Infinity }}
      />
      {/* Round Owl-Bot Chassis */}
      <rect x="11" y="12" width="26" height="26" rx="9" fill="#182334" stroke="#9D613C" strokeWidth="1.6" />
      {/* Visor */}
      <rect x="14" y="17" width="20" height="13" rx="5" fill="#080C12" />
      {/* Left Standard Eye */}
      <circle cx="19.5" cy="23.5" r="2" fill="#FBEEE0" />
      {/* Right Enlarged Indexer Monocle Scope */}
      <circle cx="28.5" cy="23.5" r="4.2" fill="#0F172A" stroke="#E59B63" strokeWidth="1.6" />
      <motion.circle
        cx="28.5"
        cy="23.5"
        r="1.8"
        fill="#38BDF8"
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {/* Little Owl Beak / Data Port */}
      <polygon points="23,26 25,26 24,28.5" fill="#E59B63" />
      {/* Bottom Indexed Bars */}
      <line x1="18" y1="34" x2="30" y2="34" stroke="#FBEEE0" strokeWidth="1.6" strokeDasharray="2 2" />
    </motion.svg>
  );
};

/* ============================================================================
 * 3B. EXPERIENCE HEADER CHARACTER — "FORGE-03" (Isometric Block-Keeper Bot)
 * ============================================================================ */
export const ExperienceForgeCharacter: React.FC = () => {
  const [active, setActive] = useState(false);

  return (
    <div
      onClick={() => setActive((prev) => !prev)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      role="button"
      tabIndex={0}
      aria-label="Interactive Block Forger Character"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive((prev) => !prev);
        }
      }}
      className="relative inline-flex items-center select-none cursor-pointer focus:outline-none"
    >
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute -top-8 right-0 whitespace-nowrap px-3 py-0.5 rounded-[14px_10px_15px_11px] bg-[#0b1018] border-2 border-[#fbeee0] text-xs font-hand tracking-wide text-[#fbeee0] shadow-[3px_3px_0px_#9d613c] rotate-[-2deg] z-20 pointer-events-none"
          >
            ⛓ blocks validated!
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 88 76"
        className="w-18 h-15 sm:w-20 sm:h-17 overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
        fill="none"
      >
        <ellipse cx="44" cy="71" rx="22" ry="3.5" fill="#070A0F" fillOpacity="0.65" />

        {/* Levitating Isometric Genesis Block above hands */}
        <motion.g
          animate={{ y: active ? [0, -6, 0] : [0, -3.5, 0] }}
          transition={{ duration: active ? 0.8 : 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Top Face */}
          <polygon points="71,16 81,21 71,26 61,21" fill="#FBEEE0" stroke="#9D613C" strokeWidth="1.2" />
          {/* Left Face */}
          <polygon points="61,21 71,26 71,37 61,32" fill="#E59B63" stroke="#9D613C" strokeWidth="1.2" />
          {/* Right Face */}
          <polygon points="71,26 81,21 81,32 71,37" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1" />
        </motion.g>

        {/* Main Bot Chassis */}
        <motion.g
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Twin Rack Ears */}
          <rect x="13" y="24" width="5" height="14" rx="2" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.2" />
          <rect x="56" y="24" width="5" height="14" rx="2" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1.2" />

          {/* Server-Rack Styled Head */}
          <rect x="17" y="16" width="40" height="30" rx="8" fill="#1A2536" stroke="#E59B63" strokeWidth="1.8" />
          <rect x="22" y="21" width="30" height="18" rx="5" fill="#080D14" />

          {/* Visor Eyes */}
          {active ? (
            <g>
              <path d="M27 30L30 27L33 30" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M41 30L44 27L47 30" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            <g>
              <rect x="28" y="26" width="4.5" height="6.5" rx="2" fill="#22C55E" />
              <rect x="41.5" y="26" width="4.5" height="6.5" rx="2" fill="#22C55E" />
            </g>
          )}

          {/* Server Chassis Body with Blinking Rack LEDs */}
          <rect x="22" y="47" width="30" height="20" rx="5" fill="#121A26" stroke="#334763" strokeWidth="1.5" />
          <line x1="27" y1="53" x2="47" y2="53" stroke="#26364D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="59" x2="47" y2="59" stroke="#26364D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="29" cy="53" r="1.5" fill="#22C55E" />
          <circle cx="34" cy="53" r="1.5" fill="#E59B63" />
          <circle cx="29" cy="59" r="1.5" fill="#22C55E" />

          {/* Right Arm Projecting Hologram Beam toward Isometric Block */}
          <path d="M52 52L64 41" stroke="#FBEEE0" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="65" cy="40" r="3" fill="#22C55E" />
        </motion.g>
      </svg>
    </div>
  );
};

/* ============================================================================
 * 4. CONNECT CARD CHARACTER — "COURIER-7" (Waving Signal Messenger Bot)
 * ============================================================================ */
export const ConnectMessengerCharacter: React.FC = () => {
  const [waving, setWaving] = useState(false);

  return (
    <div
      onClick={() => setWaving((prev) => !prev)}
      onMouseEnter={() => setWaving(true)}
      onMouseLeave={() => setWaving(false)}
      role="button"
      tabIndex={0}
      aria-label="Interactive Messenger Bot Character"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setWaving((prev) => !prev);
        }
      }}
      className="relative inline-flex items-center select-none cursor-pointer focus:outline-none"
    >
      <AnimatePresence>
        {waving && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute -top-8 right-0 whitespace-nowrap px-3 py-0.5 rounded-[14px_10px_15px_11px] bg-[#0b1018] border-2 border-[#fbeee0] text-xs font-hand tracking-wide text-[#fbeee0] shadow-[3px_3px_0px_#9d613c] rotate-[2deg] z-20 pointer-events-none"
          >
            gm ser! let&apos;s connect ✉
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 88 80"
        className="w-18 h-16 sm:w-22 sm:h-19 overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
        fill="none"
      >
        {/* Ground Shadow */}
        <ellipse cx="44" cy="74" rx="22" ry="3.5" fill="#070A0F" fillOpacity="0.7" />

        {/* Bouncing Messenger Bot */}
        <motion.g
          animate={{ y: waving ? [0, -5, 0] : [0, -2.5, 0] }}
          transition={{ duration: waving ? 0.55 : 2.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Signal Broadcast Waves from Antenna */}
          <motion.path
            d="M35 8C39 4 49 4 53 8"
            stroke="#22C55E"
            strokeWidth="1.6"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <line x1="44" y1="16" x2="44" y2="9" stroke="#E59B63" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="44" cy="8.5" r="2.5" fill="#22C55E" />

          {/* Waving Left Arm */}
          <motion.g
            animate={{ rotate: waving ? [-28, 22, -28] : [-10, 12, -10] }}
            transition={{ duration: waving ? 0.4 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '23px 46px' }}
          >
            <path d="M23 46L11 35" stroke="#FBEEE0" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="10" cy="34" r="3.5" fill="#E59B63" stroke="#FBEEE0" strokeWidth="1.2" />
          </motion.g>

          {/* Right Arm Holding Digital Letter / Packet */}
          <g>
            <path d="M65 46L73 42" stroke="#FBEEE0" strokeWidth="3" strokeLinecap="round" />
            {/* Mini Sealed Message Envelope */}
            <motion.g
              animate={{ rotate: [-5, 6, -5], y: [0, -2, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: '76px 40px' }}
            >
              <rect x="67" y="33" width="17" height="12" rx="2" fill="#FBEEE0" stroke="#9D613C" strokeWidth="1.4" />
              <path d="M68 34.5L75.5 40L83 34.5" stroke="#9D613C" strokeWidth="1.4" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Courier Satchel Body */}
          <rect x="25" y="45" width="38" height="24" rx="7" fill="#182334" stroke="#9D613C" strokeWidth="1.6" />
          {/* Crossbody Messenger Strap */}
          <line x1="28" y1="46" x2="58" y2="68" stroke="#E59B63" strokeWidth="3.5" />
          <rect x="40" y="54" width="10" height="7" rx="2" fill="#9D613C" stroke="#FBEEE0" strokeWidth="1" />

          {/* Courier Bot Head */}
          <rect x="22" y="16" width="44" height="31" rx="10" fill="#FBEEE0" stroke="#9D613C" strokeWidth="1.8" />
          {/* Courier Cap Visor Brim */}
          <path d="M20 20C28 14 60 14 68 20L64 16H24L20 20Z" fill="#9D613C" />

          {/* Dark Face Screen */}
          <rect x="27" y="22" width="34" height="20" rx="6" fill="#090E16" />

          {/* Expressive Eyes */}
          {waving ? (
            <g>
              <path d="M33 31L36 28L39 31" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M49 31L52 28L55 31" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 35C42 37.5 46 37.5 48 35" stroke="#FBEEE0" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <circle cx="36" cy="30" r="3" fill="#FBEEE0" />
              <circle cx="37" cy="29" r="1" fill="#22C55E" />
              <circle cx="52" cy="30" r="3" fill="#FBEEE0" />
              <circle cx="53" cy="29" r="1" fill="#22C55E" />
              <path d="M41 35.5C42.5 37 45.5 37 47 35.5" stroke="#E59B63" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};
