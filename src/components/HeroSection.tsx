import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DoodleRays,
  DoodleStar,
  SpeechBubble,
  GitHubIcon,
  XIcon,
  DoodleTape,
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
    <div className="relative pt-4 pb-8 md:pt-8 md:pb-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Greeting, Title, Tagline, Socials & Primary CTA */}
          <div className="lg:col-span-6 z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Step 1: "Hi, I'm" with cute hand-drawn rays */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 12 }
              }
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-1.5 mb-1.5"
            >
              <span className="font-fredoka text-lg sm:text-xl text-[#fbeee0] font-normal">
                {lang === 'id' ? 'Halo, saya' : "Hi, I'm"}
              </span>
              <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-[-10deg]" />
            </motion.div>

            {/* Step 2: Title: Uray Fazli Alman */}
            <motion.h1
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 16, scale: 0.97 }
              }
              transition={{
                duration: 0.65,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-fredoka text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight text-[#fbeee0] leading-[1.08] mb-3"
            >
              Uray Fazli
              <br />
              Alman
            </motion.h1>

            {/* Step 3: Caramel Doodle Role Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 10, scale: 0.96 }
              }
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-2.5 mb-3.5"
            >
              <span
                id="hero-operator-node-badge"
                className="inline-flex items-center px-3.5 py-1 rounded-[14px_11px_16px_12px] bg-[#9d613c] border-[1.8px] border-[#fbeee0] text-[#fbeee0] font-fredoka text-sm sm:text-base font-medium tracking-wide shadow-[3px_3px_0px_#0b1018]"
              >
                {lang === 'id' ? 'Operator Node' : 'Node Operator'}
              </span>
            </motion.div>

            {/* Step 4: Tagline with Typing Animation (starts only after loading finishes!) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[2.75rem] sm:min-h-[3rem] max-w-md mb-5 flex items-center justify-center lg:justify-start"
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
                  className="text-[#d6c4b2] text-sm sm:text-base font-normal leading-relaxed"
                  cursorClassName="bg-[#e59b63]"
                />
              )}
            </motion.div>

            {/* Step 5: Primary Explore CTA & Social Action Doodle Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={
                isLoaded
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 12 }
              }
              transition={{
                duration: 0.55,
                delay: 0.42,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
            >
              {/* Explore Node Ops CTA */}
              <button
                type="button"
                onClick={onScrollDown}
                className="doodle-subcard group flex items-center gap-2 px-4 py-2 !bg-[#9d613c] hover:!bg-[#b06f44] text-white font-medium text-xs sm:text-sm tracking-wide cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbeee0]"
              >
                <span>{lang === 'id' ? 'Eksplorasi Node' : 'Explore Nodes'}</span>
                <span className="font-mono text-xs group-hover:translate-y-0.5 transition-transform">
                  ↓
                </span>
              </button>

              {/* GitHub Button */}
              <a
                href={SOCIAL_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doodle-subcard group flex items-center gap-2 px-3.5 py-2 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <GitHubIcon className="w-4 h-4 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform" />
                <span className="font-mono text-xs tracking-wide">
                  {SOCIAL_DATA.github}
                </span>
              </a>

              {/* X.com Button */}
              <a
                href={SOCIAL_DATA.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doodle-subcard group flex items-center gap-2 px-3.5 py-2 text-[#fbeee0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
              >
                <XIcon className="w-3.5 h-3.5 text-[#fbeee0] group-hover:scale-110 group-hover:rotate-[6deg] transition-transform" />
                <span className="font-mono text-xs tracking-wide">
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
              className="mt-4 ml-2 hidden lg:block"
            >
              <DoodleStar className="w-4 h-4 text-[#9d613c]" />
            </motion.div>
          </div>

          {/* Right Column: Cute Chibi Character, Solar System Orrery, Speech Bubble */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-5 pb-2 sm:py-4">
            {/* Floating Sparkle Stars */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.55 }}
              className="absolute -top-2 left-8 sm:left-14 pointer-events-none"
            >
              <DoodleStar className="w-5 h-5 text-[#fbeee0]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.65 }}
              className="absolute top-1/2 left-2 sm:left-6 pointer-events-none"
            >
              <DoodleStar className="w-4.5 h-4.5 text-[#d8c3ad]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
              }
              transition={{ type: 'spring', delay: 0.75 }}
              className="absolute top-1/4 right-4 sm:right-8 pointer-events-none"
            >
              <DoodleStar className="w-4 h-4 text-[#fbeee0]" />
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
              className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-30"
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
              className="relative w-full max-w-[260px] xs:max-w-[284px] sm:max-w-[336px] lg:max-w-[376px] aspect-square flex items-center justify-center"
            >
              {/* Soft warm aura backdrop behind character (zero filter:blur GPU cost) */}
              <div
                className="absolute inset-2 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(157, 97, 60, 0.28) 0%, rgba(64, 45, 35, 0.22) 45%, transparent 72%)',
                }}
              />

              {/* Photo Profile Card Wrapper + Perimeter Looping Paper Plane & Rocket System */}
              <div className="relative w-[220px] xs:w-[242px] sm:w-[288px] lg:w-[324px] h-[220px] xs:h-[242px] sm:h-[288px] lg:h-[324px] flex items-center justify-center">
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
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
                    <DoodleTape className="w-20 h-4.5" />
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
                  <div className="absolute bottom-2.5 left-2.5 sm:left-3 flex items-center gap-1.5 text-[9.5px] sm:text-[11px] font-mono text-[#fbeee0] bg-[#0b1018]/95 px-2.5 py-0.5 rounded-lg border border-dashed border-[#fbeee0]/60 max-w-[90%] truncate shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">
                      {lang === 'id'
                        ? 'Node Aktif Aptos · Sei · SubQuery'
                        : 'Aptos · Sei · SubQuery Active Nodes'}
                    </span>
                  </div>
                </div>
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
                <div className="w-1.5 h-2 rounded-full bg-[#fbeee0] group-hover:translate-y-1 transition-transform" />
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
