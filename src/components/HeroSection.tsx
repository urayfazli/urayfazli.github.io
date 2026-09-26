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
    <div className="relative pt-6 pb-12 md:pt-12 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Greeting, Title, Tagline, Socials & Primary CTA */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left">
            {/* Step 1: "Hi, I'm" with cute hand-drawn rays */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 14 }
              }
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
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
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 20, scale: 0.97 }
              }
              transition={{
                duration: 0.65,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-fredoka text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#fbeee0] leading-[1.06] mb-4"
            >
              Uray Fazli
              <br />
              Alman
            </motion.h1>

            {/* Step 3: Caramel Doodle Role Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 12, scale: 0.96 }
              }
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-3 mb-5"
            >
              <span
                id="hero-operator-node-badge"
                className="inline-flex items-center px-5 py-1.5 rounded-[18px_14px_20px_15px] bg-[#9d613c] border-2 border-[#fbeee0] text-[#fbeee0] font-fredoka text-lg md:text-xl font-medium tracking-wide shadow-[4px_4px_0px_#0b1018]"
              >
                {lang === 'id' ? 'Operator Node' : 'Node Operator'}
              </span>
            </motion.div>

            {/* Step 4: Tagline with Typing Animation (starts only after loading finishes!) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[4rem] sm:min-h-[3.75rem] max-w-lg mb-7 flex items-center"
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

            {/* Step 5: Primary Explore CTA & Social Action Doodle Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 14 }
              }
              transition={{
                duration: 0.55,
                delay: 0.42,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap items-center gap-3 sm:gap-3.5"
            >
              {/* Explore Node Ops CTA */}
              <button
                type="button"
                onClick={onScrollDown}
                className="doodle-subcard group flex items-center gap-2.5 px-5 py-2.5 !bg-[#9d613c] hover:!bg-[#b06f44] text-white font-medium text-sm sm:text-base tracking-wide cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbeee0]"
              >
                <span>{lang === 'id' ? 'Eksplorasi Node' : 'Explore Nodes'}</span>
                <span className="font-mono text-sm group-hover:translate-y-0.5 transition-transform">
                  ↓
                </span>
              </button>

              {/* GitHub Button */}
              <a
                href={SOCIAL_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doodle-subcard group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <GitHubIcon className="w-5 h-5 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform" />
                <span className="font-mono text-xs sm:text-sm tracking-wide">
                  {SOCIAL_DATA.github}
                </span>
              </a>

              {/* X.com Button */}
              <a
                href={SOCIAL_DATA.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doodle-subcard group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <XIcon className="w-4 h-4 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[6deg] transition-transform" />
                <span className="font-mono text-xs sm:text-sm tracking-wide">
                  {SOCIAL_DATA.twitter}
                </span>
              </a>
            </motion.div>

            {/* Subtle doodle star near text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-6 ml-2 hidden sm:block"
            >
              <DoodleStar className="w-5 h-5 text-[#9d613c] animate-twinkle" />
            </motion.div>
          </div>

          {/* Right Column: Cute Chibi Character, Solar System Orrery, Speech Bubble */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center py-4 sm:py-6">
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

            {/* Speech Bubble: "Node Operator" smooth fade-in directly above character's head */}
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
              className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30 animate-float-slow will-change-[transform,opacity]"
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
                    SOLAR SYSTEM & PLANETARY ORRERY LOOPING SYSTEM (ANTI-AI-SLOP)
                    3 Keplerian perimeter orbits with Helios Sun crest, Mercury, Venus,
                    Terra + orbiting Luna moon, Mars, Saturn (double-ringed gas giant) +
                    Titan moon, Jupiter, plus the Validator Rocket & Origami Paper Plane
                   ===================================================================== */}
                <svg
                  viewBox="0 0 600 600"
                  fill="none"
                  aria-hidden="true"
                  className="absolute -inset-6 xs:-inset-7 sm:-inset-10 lg:-inset-12 w-[calc(100%+3rem)] xs:w-[calc(100%+3.5rem)] sm:w-[calc(100%+5rem)] lg:w-[calc(100%+6rem)] h-[calc(100%+3rem)] xs:h-[calc(100%+3.5rem)] sm:h-[calc(100%+5rem)] lg:h-[calc(100%+6rem)] pointer-events-none overflow-visible z-20 select-none"
                >
                  {/* Astronomical Orrery Calibration Ticks & Ecliptic Crosshairs */}
                  <g opacity="0.55" stroke="#E59B63" strokeWidth="1.3" strokeLinecap="round">
                    {/* Top-Right & Bottom-Left Astrometric Crosshairs */}
                    <line x1="546" y1="48" x2="558" y2="48" />
                    <line x1="552" y1="42" x2="552" y2="54" />
                    <line x1="42" y1="552" x2="54" y2="552" />
                    <line x1="48" y1="546" x2="48" y2="558" />
                    {/* Bottom-Right Orbital Node Ring */}
                    <circle cx="550" cy="550" r="4" stroke="#FBEEE0" strokeDasharray="2 2" />
                  </g>

                  {/* Helios Solar Beacon (Top-Left Perihelion Anchor with Rotating Corona) */}
                  <g transform="translate(46, 46)">
                    {/* Pulsing Solar Corona Halo */}
                    <circle r="14" fill="#E59B63" fillOpacity="0.16">
                      <animate attributeName="r" values="12;16.5;12" dur="3.2s" repeatCount="indefinite" />
                      <animate attributeName="fill-opacity" values="0.12;0.26;0.12" dur="3.2s" repeatCount="indefinite" />
                    </circle>
                    {/* Rotating 8-Point Solar Rays */}
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="18s"
                        repeatCount="indefinite"
                      />
                      <line x1="0" y1="-13.5" x2="0" y2="-10.5" stroke="#FBEEE0" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="10.5" x2="0" y2="13.5" stroke="#FBEEE0" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="-13.5" y1="0" x2="-10.5" y2="0" stroke="#FBEEE0" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="10.5" y1="0" x2="13.5" y2="0" stroke="#FBEEE0" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="-9.5" y1="-9.5" x2="-7.4" y2="-7.4" stroke="#E59B63" strokeWidth="1.4" strokeLinecap="round" />
                      <line x1="7.4" y1="7.4" x2="9.5" y2="9.5" stroke="#E59B63" strokeWidth="1.4" strokeLinecap="round" />
                      <line x1="9.5" y1="-9.5" x2="7.4" y2="-7.4" stroke="#E59B63" strokeWidth="1.4" strokeLinecap="round" />
                      <line x1="-7.4" y1="7.4" x2="-9.5" y2="9.5" stroke="#E59B63" strokeWidth="1.4" strokeLinecap="round" />
                    </g>
                    {/* Solar Photosphere Core */}
                    <circle r="7.5" fill="#E59B63" stroke="#0B1018" strokeWidth="1.8" />
                    <circle r="4.5" fill="#FBEEE0" />
                  </g>

                  {/* -------------------------------------------------------------------
                      ORBIT 1 (INNER TERRESTRIAL BELT — CLOCKWISE, 11.5s PERIOD)
                      Planets: Mercury (Cratered World) & Venus (Golden Cloud Sphere)
                     ------------------------------------------------------------------- */}
                  <g transform="rotate(2 300 300)">
                    <path
                      d="M 300,38 C 500,38 562,100 562,300 C 562,500 500,562 300,562 C 100,562 38,500 38,300 C 38,100 100,38 300,38 Z"
                      stroke="#FBEEE0"
                      strokeWidth="1.1"
                      strokeDasharray="2 7"
                      strokeLinecap="round"
                      opacity="0.32"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-36"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Planet 1: Mercury (Compact Cratered Terrestrial Sphere) */}
                    <g style={{ filter: 'drop-shadow(0px 2px 3px rgba(11, 16, 24, 0.85))' }}>
                      <circle r="5.5" fill="#DEC6B0" stroke="#0B1018" strokeWidth="1.6" />
                      <path d="M 1.5,-5.2 A 5.5,5.5 0 0,1 1.5,5.2 A 4,5.3 0 0,0 1.5,-5.2 Z" fill="#9D613C" opacity="0.65" />
                      <circle cx="-1.8" cy="-1.2" r="1.1" fill="#9D613C" />
                      <circle cx="0.8" cy="2" r="0.8" fill="#9D613C" />
                      <animateMotion
                        path="M 300,38 C 500,38 562,100 562,300 C 562,500 500,562 300,562 C 100,562 38,500 38,300 C 38,100 100,38 300,38 Z"
                        dur="11.5s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>

                    {/* Planet 2: Venus (Golden Amber Cloud-Banded World — Opposite Phase) */}
                    <g style={{ filter: 'drop-shadow(0px 2px 4px rgba(11, 16, 24, 0.85))' }}>
                      <circle r="9" fill="#E59B63" fillOpacity="0.18" />
                      <circle r="6.8" fill="#E59B63" stroke="#0B1018" strokeWidth="1.7" />
                      <path d="M -5.2,-2 Q 0,-3.8 5.2,-1.5" stroke="#FBEEE0" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                      <path d="M -4.8,2 Q 0,0.4 4.8,2.2" stroke="#9D613C" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                      <circle cx="-2.2" cy="-2.4" r="1.1" fill="#FBEEE0" />
                      <animateMotion
                        path="M 300,38 C 500,38 562,100 562,300 C 562,500 500,562 300,562 C 100,562 38,500 38,300 C 38,100 100,38 300,38 Z"
                        dur="11.5s"
                        begin="-5.75s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>
                  </g>

                  {/* -------------------------------------------------------------------
                      ORBIT 2 (MIDDLE ECLIPTIC BELT — COUNTER-CLOCKWISE, 15.5s PERIOD)
                      Planets: Terra + Orbiting Luna Moon, Mars, & Origami Paper Plane
                     ------------------------------------------------------------------- */}
                  <g transform="rotate(-5 300 300)">
                    <path
                      d="M 300,24 C 86,24 24,86 24,300 C 24,514 86,576 300,576 C 514,576 576,514 576,300 C 576,86 514,24 300,24 Z"
                      stroke="#9D613C"
                      strokeWidth="1.4"
                      strokeDasharray="5 8"
                      strokeLinecap="round"
                      opacity="0.45"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-52"
                        dur="2.8s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Planet 3: Terra (Earth) + Active Orbiting Luna Moon */}
                    <g style={{ filter: 'drop-shadow(0px 3px 5px rgba(11, 16, 24, 0.88))' }}>
                      {/* Luna Sub-Orbit Track */}
                      <circle r="13.5" stroke="#FBEEE0" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.5" />
                      {/* Orbiting Luna Moon */}
                      <g>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0"
                          to="360"
                          dur="2.8s"
                          repeatCount="indefinite"
                        />
                        <circle cx="13.5" cy="0" r="2.5" fill="#FBEEE0" stroke="#0B1018" strokeWidth="1.2" />
                      </g>
                      {/* Terra Globe */}
                      <circle r="8.2" fill="#1E3A5F" stroke="#0B1018" strokeWidth="1.8" />
                      <circle r="7.2" fill="#38BDF8" fillOpacity="0.88" />
                      {/* Emerald Continents */}
                      <path
                        d="M -4,-3.5 C -1.5,-4.5 1,-2.5 0.5,0 C 0,2 -3,3.5 -4.8,1.5 Z"
                        fill="#22C55E"
                      />
                      <path
                        d="M 2.2,-1.5 C 4.5,-2 5.8,0.5 4.5,3.2 C 3.2,4.5 1.5,3 2.2,0.5 Z"
                        fill="#22C55E"
                      />
                      {/* Polar Cloud Cap */}
                      <path d="M -3.5,-6 A 6.5,6.5 0 0,1 3.5,-6" stroke="#FBEEE0" strokeWidth="1.4" strokeLinecap="round" />
                      <animateMotion
                        path="M 300,24 C 86,24 24,86 24,300 C 24,514 86,576 300,576 C 514,576 576,514 576,300 C 576,86 514,24 300,24 Z"
                        dur="15.5s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>

                    {/* Planet 4: Mars (Red-Terracotta Oxide Planet — Opposite Phase) */}
                    <g style={{ filter: 'drop-shadow(0px 2px 4px rgba(11, 16, 24, 0.85))' }}>
                      <circle r="6.4" fill="#C85A32" stroke="#0B1018" strokeWidth="1.7" />
                      {/* Martian Canyon Belt & North Polar Ice Cap */}
                      <path d="M -4.2,0.8 Q 0,2.4 4.2,0.2" stroke="#7C2D12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                      <path d="M -2.6,-5.2 A 5.5,5.5 0 0,1 2.6,-5.2" stroke="#FBEEE0" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="-1.8" cy="-1.6" r="1" fill="#E59B63" />
                      <animateMotion
                        path="M 300,24 C 86,24 24,86 24,300 C 24,514 86,576 300,576 C 514,576 576,514 576,300 C 576,86 514,24 300,24 Z"
                        dur="15.5s"
                        begin="-7.75s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>

                    {/* Origami Paper Plane Gliding on Orbit 2 */}
                    <g style={{ filter: 'drop-shadow(0px 3px 4px rgba(11, 16, 24, 0.82))' }}>
                      <g transform="scale(0.45) translate(-46, -26)">
                        <SketchbookPaperPlaneDoodle />
                      </g>
                      <animateMotion
                        path="M 300,24 C 86,24 24,86 24,300 C 24,514 86,576 300,576 C 514,576 576,514 576,300 C 576,86 514,24 300,24 Z"
                        dur="15.5s"
                        begin="-3.8s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </g>
                  </g>

                  {/* -------------------------------------------------------------------
                      ORBIT 3 (OUTER JOVIAN GAS GIANT BELT — CLOCKWISE, 21s PERIOD)
                      Planets: Saturn (Double-Ringed Gas Giant + Titan), Jupiter, & Rocket
                     ------------------------------------------------------------------- */}
                  <g transform="rotate(5 300 300)">
                    <path
                      d="M 300,10 C 524,10 590,76 590,300 C 590,524 524,590 300,590 C 76,590 10,524 10,300 C 10,76 76,10 300,10 Z"
                      stroke="#E59B63"
                      strokeWidth="1.2"
                      strokeDasharray="8 10"
                      strokeLinecap="round"
                      opacity="0.38"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-72"
                        dur="3.6s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Planet 5: Saturn (Ringed Gas Giant with Cassini Division & Titan Moon) */}
                    <g style={{ filter: 'drop-shadow(0px 3px 6px rgba(11, 16, 24, 0.9))' }}>
                      {/* Orbiting Titan Moon */}
                      <g>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="360"
                          to="0"
                          dur="4.2s"
                          repeatCount="indefinite"
                        />
                        <circle cx="19" cy="0" r="2.1" fill="#E59B63" stroke="#0B1018" strokeWidth="1.1" />
                      </g>

                      <g transform="rotate(-22)">
                        {/* Back Half of Planetary Rings (Behind Sphere) */}
                        <path
                          d="M -16.5,0 A 16.5,5.8 0 0,1 16.5,0"
                          stroke="#9D613C"
                          strokeWidth="2.6"
                          fill="none"
                        />
                        <path
                          d="M -13.5,0 A 13.5,4.4 0 0,1 13.5,0"
                          stroke="#FBEEE0"
                          strokeWidth="1.2"
                          opacity="0.7"
                          fill="none"
                        />

                        {/* Saturn Planetary Sphere */}
                        <circle r="8.6" fill="#E59B63" stroke="#0B1018" strokeWidth="1.8" />
                        {/* Atmospheric Bands */}
                        <path d="M -7.4,-2.8 Q 0,-4.2 7.4,-2.8" stroke="#FBEEE0" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                        <path d="M -7.8,0.5 Q 0,-0.8 7.8,0.5" stroke="#9D613C" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                        <path d="M -6.8,3.6 Q 0,2.4 6.8,3.6" stroke="#FBEEE0" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                        {/* Front Half of Planetary Rings (Crossing in Front of Sphere) */}
                        <path
                          d="M 16.5,0 A 16.5,5.8 0 0,1 -16.5,0"
                          stroke="#FBEEE0"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M 13.5,0 A 13.5,4.4 0 0,1 -13.5,0"
                          stroke="#E59B63"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </g>

                      <animateMotion
                        path="M 300,10 C 524,10 590,76 590,300 C 590,524 524,590 300,590 C 76,590 10,524 10,300 C 10,76 76,10 300,10 Z"
                        dur="21s"
                        begin="-2s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>

                    {/* Planet 6: Jupiter (Banded Storm Giant with Great Red Spot & Io Moon) */}
                    <g style={{ filter: 'drop-shadow(0px 3px 6px rgba(11, 16, 24, 0.9))' }}>
                      {/* Orbiting Galilean Moon Io */}
                      <g>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0"
                          to="360"
                          dur="3.1s"
                          repeatCount="indefinite"
                        />
                        <circle cx="14.5" cy="0" r="2.1" fill="#22C55E" stroke="#0B1018" strokeWidth="1.1" />
                      </g>
                      {/* Jupiter Sphere */}
                      <circle r="9.4" fill="#FBEEE0" stroke="#0B1018" strokeWidth="1.8" />
                      {/* Equatorial Storm Belts */}
                      <path d="M -8.2,-3.2 H 8.2" stroke="#9D613C" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M -8.5,0.6 H 8.5" stroke="#E59B63" strokeWidth="2" strokeLinecap="round" />
                      <path d="M -7.4,4.2 H 7.4" stroke="#9D613C" strokeWidth="1.6" strokeLinecap="round" />
                      {/* Great Red Spot */}
                      <ellipse cx="2.6" cy="2.1" rx="2.6" ry="1.6" fill="#C85A32" stroke="#0B1018" strokeWidth="0.9" />
                      <animateMotion
                        path="M 300,10 C 524,10 590,76 590,300 C 590,524 524,590 300,590 C 76,590 10,524 10,300 C 10,76 76,10 300,10 Z"
                        dur="21s"
                        begin="-12.5s"
                        repeatCount="indefinite"
                        rotate="0"
                      />
                    </g>

                    {/* Validator Rocket Cruising Along Outer Orbit 3 */}
                    <g style={{ filter: 'drop-shadow(0px 3px 4px rgba(11, 16, 24, 0.82))' }}>
                      <g transform="scale(0.48) translate(-39, -22)">
                        <SketchbookOrbitRocketDoodle />
                      </g>
                      <animateMotion
                        path="M 300,10 C 524,10 590,76 590,300 C 590,524 524,590 300,590 C 76,590 10,524 10,300 C 10,76 76,10 300,10 Z"
                        dur="21s"
                        begin="-7.2s"
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
              initial={{ opacity: 0, y: 12 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.45, delay: 0.65 }}
              className="hidden lg:flex flex-col items-center gap-1 absolute -bottom-4 right-0 cursor-pointer group"
              onClick={onScrollDown}
            >
              <div className="w-5 h-8 rounded-full border-[1.5px] border-[#fbeee0]/70 flex items-start justify-center p-1 group-hover:border-[#e59b63] transition-colors">
                <div className="w-1.5 h-2 rounded-full bg-[#fbeee0] animate-bounce" />
              </div>
              <span className="text-[11px] font-hand tracking-wider text-[#d6c4b2] group-hover:text-[#fbeee0] transition-colors uppercase">
                {lang === 'id' ? 'Gulir' : 'Scroll'}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
