import React from 'react';
import { DoodleRays, DoodleStar, SpeechBubble, GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { TypingText } from './TypingText';
import { ASSET_IMAGES } from '../assets/images';

interface HeroSectionProps {
  onScrollDown: () => void;
  onSelectNetwork: (networkId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollDown }) => {
  return (
    <section id="home" className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Greeting, Title, Tagline, Socials */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left">
            
            {/* "Hi, I'm" with cute hand-drawn rays */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-fredoka text-2xl sm:text-3xl text-[#fbeee0] font-normal">
                Hi, I'm
              </span>
              <DoodleRays className="w-6 h-6 text-[#fbeee0] rotate-[-10deg]" />
            </div>

            {/* Giant Title: Uray Fazli Alman */}
            <h1 className="font-fredoka text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#fbeee0] leading-[1.08] mb-4">
              Uray Fazli
              <br />
              Alman
            </h1>

            {/* Caramel Pill Badge: Node Operator */}
            <div className="mb-5">
              <span className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#9d613c] text-[#fbeee0] font-fredoka text-lg md:text-xl font-medium tracking-wide shadow-md hover:bg-[#b06f44] transition-colors cursor-default">
                Node Operator
              </span>
            </div>

            {/* Tagline with Typing Animation */}
            <div className="min-h-[4rem] sm:min-h-[3.75rem] max-w-md mb-8 flex items-center">
              <TypingText
                text="Building a more decentralized future, one node at a time."
                speed={42}
                delay={350}
                className="text-[#d6c4b2] text-lg sm:text-xl font-normal leading-relaxed"
                cursorClassName="bg-[#9d613c]"
              />
            </div>

            {/* Social Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* GitHub Button */}
              <a
                href={SOCIAL_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#2f3d52] bg-[#141c28] hover:bg-[#1b2636] hover:border-[#9d613c]/60 text-[#fbeee0] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
              >
                <GitHubIcon className="w-5 h-5 text-[#fbeee0] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.github}
                </span>
              </a>

              {/* X.com Button */}
              <a
                href={SOCIAL_DATA.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#2f3d52] bg-[#141c28] hover:bg-[#1b2636] hover:border-[#9d613c]/60 text-[#fbeee0] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
              >
                <XIcon className="w-4.5 h-4.5 text-[#fbeee0] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.twitter}
                </span>
              </a>
            </div>

            {/* Subtle doodle star near text */}
            <div className="mt-8 ml-2">
              <DoodleStar className="w-6 h-6 text-[#9d613c] animate-twinkle" />
            </div>
          </div>

          {/* Right Column: Cute Chibi Character, Speech Bubble, Doodles */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Floating Sparkle Stars */}
            <div className="absolute -top-4 left-6 sm:left-12 pointer-events-none">
              <DoodleStar className="w-7 h-7 text-[#fbeee0] animate-twinkle" />
            </div>
            <div className="absolute top-1/2 -left-4 sm:left-2 pointer-events-none">
              <DoodleStar className="w-6 h-6 text-[#d8c3ad] animate-twinkle [animation-delay:1s]" />
            </div>
            <div className="absolute top-1/4 right-2 sm:right-6 pointer-events-none">
              <DoodleStar className="w-5 h-5 text-[#fbeee0] animate-twinkle [animation-delay:1.8s]" />
            </div>

            {/* Speech Bubble: "Node Operator" positioned playfully above character */}
            <div className="absolute -top-6 sm:-top-8 right-4 sm:right-8 z-20 animate-float-slow">
              <SpeechBubble text="Node Operator" />
            </div>

            {/* Character Main Visual Art Frame */}
            <div className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[440px] lg:max-w-[520px] aspect-square flex items-center justify-center">
              
              {/* Soft warm aura backdrop behind character */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#9d613c]/20 via-[#402d23]/40 to-transparent blur-2xl" />

              {/* Character Illustration Card Container */}
              <div className="relative w-[280px] xs:w-[320px] sm:w-[380px] lg:w-[440px] h-[280px] xs:h-[320px] sm:h-[380px] lg:h-[440px] rounded-3xl overflow-hidden border-2 border-[#2b394e]/70 bg-gradient-to-b from-[#16202e] to-[#0f151f] shadow-2xl group transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={ASSET_IMAGES.avatar}
                  alt="Uray Fazli Alman - Cute Chibi Illustration"
                  className="w-full h-full object-cover object-center scale-105 group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle vignette border gradient overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0f141d]/70 via-transparent to-transparent" />
                
                {/* In-corner subtle aesthetic badge with honest status */}
                <div className="absolute bottom-3 left-3 sm:left-4 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-[#d6c4b2]/90 bg-[#121824]/90 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 max-w-[90%] truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">Aptos · Sei · SubQuery Active Nodes</span>
                </div>
              </div>
            </div>

            {/* Scroll Down Affordance on bottom right */}
            <div className="hidden lg:flex flex-col items-center gap-1.5 absolute -bottom-10 right-0 cursor-pointer group" onClick={onScrollDown}>
              <div className="w-6 h-10 rounded-full border-2 border-[#fbeee0]/70 flex items-start justify-center p-1.5 group-hover:border-[#9d613c] transition-colors">
                <div className="w-1.5 h-2.5 rounded-full bg-[#fbeee0] animate-bounce" />
              </div>
              <span className="text-xs font-medium tracking-wider text-[#d6c4b2] group-hover:text-[#fbeee0] transition-colors uppercase">
                Scroll Down
              </span>
              <svg className="w-4 h-4 text-[#fbeee0] group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
