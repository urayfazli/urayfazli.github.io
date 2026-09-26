import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DoodleRays,
  DoodleStar,
  SpeechBubble,
  GitHubIcon,
  XIcon,
  DoodleTape,
  SketchbookPaperPlaneDoodle,
  SketchbookOrbitRocketDoodle,
} from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { TypingText } from './TypingText';
import { ASSET_IMAGES } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';
import { robotSound } from '../utils/robotSoundEngine';

interface HeroSectionProps {
  onScrollDown: () => void;
  onSelectNetwork: (networkId: string) => void;
  isLoaded?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollDown,
  isLoaded = true,
}) => {
  const { lang } = useLanguage();
  const [heroBounce, setHeroBounce] = useState(false);

  const handleHeroCharacterPress = () => {
    robotSound.play('hero');
    setHeroBounce(true);
    window.setTimeout(() => setHeroBounce(false), 320);
  };

  return (
    <section
      id="home"
      className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Greeting, Title, Tagline, Socials */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left">
            {/* Step 1: "Hi, I'm" with cute hand-drawn rays */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -4 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, rotate: 0 }
                  : { opacity: 0, y: 20, rotate: -4 }
              }
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 22,
                delay: 0.08,
              }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="font-fredoka text-2xl sm:text-3xl text-[#fbeee0] font-normal">
                {lang === 'id' ? 'Halo, saya' : "Hi, I'm"}
              </span>
              <DoodleRays className="w-6 h-6 text-[#fbeee0] rotate-[-10deg]" />
            </motion.div>

            {/* Step 2: Giant Title: Uray Fazli Alman */}
            <motion.h1
              initial={{ opacity: 0, y: 34, scale: 0.94 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 34, scale: 0.94 }
              }
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 22,
                delay: 0.18,
              }}
              className="font-fredoka text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#fbeee0] leading-[1.08] mb-4"
            >
              Uray Fazli
              <br />
              Alman
            </motion.h1>

            {/* Step 3: Caramel Doodle Badge: Node Operator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={
                isLoaded
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 0.7, rotate: -6 }
              }
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 18,
                delay: 0.3,
              }}
              className="mb-5"
            >
              <span className="inline-flex items-center px-5 py-1.5 rounded-[18px_14px_20px_15px] bg-[#9d613c] border-2 border-[#fbeee0] text-[#fbeee0] font-fredoka text-lg md:text-xl font-medium tracking-wide shadow-[4px_4px_0px_#0b1018] hover:bg-[#b06f44] hover:-translate-y-0.5 transition-all cursor-default">
                {lang === 'id' ? 'Operator Node' : 'Node Operator'}
              </span>
            </motion.div>

            {/* Step 4: Tagline with Typing Animation (starts only after loading finishes!) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="min-h-[4rem] sm:min-h-[3.75rem] max-w-md mb-8 flex items-center"
            >
              {isLoaded && (
                <TypingText
                  key={lang}
                  text={
                    lang === 'id'
                      ? 'Membangun masa depan yang lebih terdesentralisasi, satu node setiap waktu.'
                      : 'Building a more decentralized future, one node at a time.'
                  }
                  speed={38}
                  delay={420}
                  className="text-[#d6c4b2] text-lg sm:text-xl font-normal leading-relaxed"
                  cursorClassName="bg-[#e59b63]"
                />
              )}
            </motion.div>

            {/* Step 5: Social Action Doodle Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* GitHub Button */}
              <motion.a
                href={SOCIAL_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={
                  isLoaded
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 20, scale: 0.9 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 20,
                  delay: 0.48,
                }}
                className="doodle-subcard group flex items-center gap-3 px-5 py-2.5 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <GitHubIcon className="w-5 h-5 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.github}
                </span>
              </motion.a>

              {/* X.com Button */}
              <motion.a
                href={SOCIAL_DATA.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={
                  isLoaded
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 20, scale: 0.9 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 20,
                  delay: 0.58,
                }}
                className="doodle-subcard group flex items-center gap-3 px-5 py-2.5 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <XIcon className="w-4.5 h-4.5 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[6deg] transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.twitter}
                </span>
              </motion.a>
            </div>

            {/* Subtle doodle star near text */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.7 }}
              className="mt-8 ml-2"
            >
              <DoodleStar className="w-6 h-6 text-[#9d613c] animate-twinkle" />
            </motion.div>
          </div>

          {/* Right Column: Cute Chibi Character, Speech Bubble, Doodles */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Floating Sparkle Stars */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.55 }}
              className="absolute -top-4 left-6 sm:left-12 pointer-events-none"
            >
              <DoodleStar className="w-7 h-7 text-[#fbeee0] animate-twinkle" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.65 }}
              className="absolute top-1/2 -left-4 sm:left-2 pointer-events-none"
            >
              <DoodleStar className="w-6 h-6 text-[#d8c3ad] animate-twinkle [animation-delay:1s]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.75 }}
              className="absolute top-1/4 right-2 sm:right-6 pointer-events-none"
            >
              <DoodleStar className="w-5 h-5 text-[#fbeee0] animate-twinkle [animation-delay:1.8s]" />
            </motion.div>

            {/* Speech Bubble: "Node Operator" smooth fade-in above character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={
                isLoaded
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.96, y: 10 }
              }
              transition={{
                duration: 0.65,
                delay: 0.34,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute -top-6 sm:-top-8 right-4 sm:right-8 z-30 animate-float-slow will-change-[transform,opacity]"
            >
              <SpeechBubble text={lang === 'id' ? 'Operator Node' : 'Node Operator'} />
            </motion.div>

            {/* Character Main Visual Art Frame with Smooth Anti-Slop Fade-In */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={
                isLoaded
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.97, y: 14 }
              }
              transition={{
                duration: 0.75,
                delay: 0.16,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[440px] lg:max-w-[520px] aspect-square flex items-center justify-center will-change-[transform,opacity]"
            >
              {/* Soft warm aura backdrop behind character */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#9d613c]/25 via-[#402d23]/40 to-transparent blur-2xl" />

              {/* Photo Profile Card Wrapper + Perimeter Looping Paper Plane & Rocket System */}
              <div className="relative w-[276px] xs:w-[312px] sm:w-[380px] lg:w-[440px] h-[276px] xs:h-[312px] sm:h-[380px] lg:h-[440px] flex items-center justify-center">
                {/* Character Illustration Doodle Frame */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleHeroCharacterPress}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleHeroCharacterPress();
                    }
                  }}
                  aria-label="Interactive Uray Fazli Chibi Avatar"
                  className={`doodle-card relative z-10 w-full h-full overflow-hidden group cursor-pointer transition-transform duration-200 ${
                    heroBounce ? 'scale-[0.97] -rotate-1' : 'active:scale-[0.98]'
                  }`}
                >
                  {/* Top Sketchbook Tape on Avatar Frame */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
                    <DoodleTape className="w-24 h-5" />
                  </div>

                  <img
                    src={ASSET_IMAGES.avatar}
                    alt="Uray Fazli Alman - Cute Chibi Illustration"
                    className="w-full h-full object-cover object-center scale-105 group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Subtle vignette border gradient overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0f141d]/75 via-transparent to-transparent" />

                  {/* In-corner subtle aesthetic doodle badge */}
                  <div className="absolute bottom-3.5 left-3.5 sm:left-4 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-[#fbeee0] bg-[#0b1018]/95 px-3 py-1 rounded-xl border-[1.5px] border-dashed border-[#fbeee0]/60 max-w-[90%] truncate shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">
                      {lang === 'id'
                        ? 'Node Aktif Aptos · Sei · SubQuery'
                        : 'Aptos · Sei · SubQuery Active Nodes'}
                    </span>
                  </div>
                </div>

                {/* =====================================================================
                    PERIMETER LOOPING FLIGHT SYSTEM (ANTI-AI-SLOP PAPER PLANE & ROCKET)
                    Continuous C² tangent-smooth orbital & gliding paths around the
                    Photo Profile Card with hand-drafted sketchbook telemetry trails
                   ===================================================================== */}
                <svg
                  viewBox="0 0 560 560"
                  fill="none"
                  aria-hidden="true"
                  className="absolute -inset-5 xs:-inset-6 sm:-inset-8 lg:-inset-10 w-[calc(100%+2.5rem)] xs:w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] lg:w-[calc(100%+5rem)] h-[calc(100%+2.5rem)] xs:h-[calc(100%+3rem)] sm:h-[calc(100%+4rem)] lg:h-[calc(100%+5rem)] pointer-events-none overflow-visible z-20 select-none"
                >
                  {/* Hand-Drafted Corner Registration Crosshairs & Telemetry Notes */}
                  <g opacity="0.55" stroke="#E59B63" strokeWidth="1.4" strokeLinecap="round">
                    {/* Top-Left Crosshair */}
                    <line x1="34" y1="40" x2="46" y2="40" />
                    <line x1="40" y1="34" x2="40" y2="46" />
                    {/* Bottom-Right Crosshair */}
                    <line x1="514" y1="520" x2="526" y2="520" />
                    <line x1="520" y1="514" x2="520" y2="526" />
                    {/* Bottom-Left Waypoint Ring */}
                    <circle cx="44" cy="516" r="3.5" stroke="#FBEEE0" strokeDasharray="2 2" />
                  </g>

                  {/* -------------------------------------------------------------------
                      ORBIT 1 (+4° TILT): VALIDATOR ROCKET CLOCKWISE PERIMETER LOOP
                     ------------------------------------------------------------------- */}
                  <g transform="rotate(4 280 280)">
                    {/* Hand-Drawn Dashed Orbital Track */}
                    <path
                      d="M 280,16 C 478,16 544,82 544,280 C 544,478 478,544 280,544 C 82,544 16,478 16,280 C 16,82 82,16 280,16 Z"
                      stroke="#9D613C"
                      strokeWidth="1.6"
                      strokeDasharray="6 8"
                      strokeLinecap="round"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-56"
                        dur="2.8s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Trailing Orbital Telemetry Beacon Dot (Opposite Phase) */}
                    <g>
                      <circle r="2.4" fill="#22C55E" stroke="#0B1018" strokeWidth="1.2" />
                      <circle r="4.5" stroke="#22C55E" strokeWidth="0.9" opacity="0.45">
                        <animate
                          attributeName="r"
                          values="2.6;6.2;2.6"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <animateMotion
                        path="M 280,16 C 478,16 544,82 544,280 C 544,478 478,544 280,544 C 82,544 16,478 16,280 C 16,82 82,16 280,16 Z"
                        dur="13.5s"
                        begin="-6.75s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </g>

                    {/* Bespoke Anti-AI-Slop Validator Rocket Riding Orbit 1 (Compact Scale) */}
                    <g style={{ filter: 'drop-shadow(0px 3px 4px rgba(11, 16, 24, 0.82))' }}>
                      <g transform="scale(0.52) translate(-39, -22)">
                        <SketchbookOrbitRocketDoodle />
                      </g>
                      <animateMotion
                        path="M 280,16 C 478,16 544,82 544,280 C 544,478 478,544 280,544 C 82,544 16,478 16,280 C 16,82 82,16 280,16 Z"
                        dur="13.5s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </g>
                  </g>

                  {/* -------------------------------------------------------------------
                      ORBIT 2 (-6° TILT): ORIGAMI PAPER PLANE COUNTER-CLOCKWISE GLIDE LOOP
                     ------------------------------------------------------------------- */}
                  <g transform="rotate(-6 280 280)">
                    {/* Fine Sketchbook Wind-Current Dotted Trail */}
                    <path
                      d="M 280,32 C 94,32 32,94 32,280 C 32,466 94,528 280,528 C 466,528 528,466 528,280 C 528,94 466,32 280,32 Z"
                      stroke="#FBEEE0"
                      strokeWidth="1.2"
                      strokeDasharray="3 7"
                      strokeLinecap="round"
                      opacity="0.35"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-40"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Bespoke Anti-AI-Slop Origami Paper Plane Gliding on Orbit 2 (Compact Scale) */}
                    <g style={{ filter: 'drop-shadow(0px 3px 4px rgba(11, 16, 24, 0.82))' }}>
                      <g transform="scale(0.48) translate(-46, -26)">
                        <SketchbookPaperPlaneDoodle />
                      </g>
                      <animateMotion
                        path="M 280,32 C 94,32 32,94 32,280 C 32,466 94,528 280,528 C 466,528 528,466 528,280 C 528,94 466,32 280,32 Z"
                        dur="16s"
                        begin="-4s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* Scroll Down Affordance on bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.45, delay: 0.78 }}
              className="hidden lg:flex flex-col items-center gap-1.5 absolute -bottom-10 right-0 cursor-pointer group"
              onClick={onScrollDown}
            >
              <div className="w-6 h-10 rounded-full border-2 border-[#fbeee0]/70 flex items-start justify-center p-1.5 group-hover:border-[#e59b63] transition-colors">
                <div className="w-1.5 h-2.5 rounded-full bg-[#fbeee0] animate-bounce" />
              </div>
              <span className="text-xs font-hand tracking-wider text-[#d6c4b2] group-hover:text-[#fbeee0] transition-colors uppercase">
                {lang === 'id' ? 'Gulir ke Bawah' : 'Scroll Down'}
              </span>
              <svg
                className="w-4 h-4 text-[#fbeee0] group-hover:translate-y-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
