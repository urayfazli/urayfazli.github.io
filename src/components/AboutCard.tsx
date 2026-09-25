import React from 'react';
import { DoodleRays, WavyUnderline, DoodleTape, DoodleCornerHatch } from './Doodles';
import { TechnicalSkills } from './TechnicalSkills';
import { AboutCoderCharacter } from './CardCharacters';

export const AboutCard: React.FC = () => {
  return (
    <div className="doodle-card group p-5 sm:p-8 flex flex-col justify-between h-full">
      {/* Top Sketchbook Masking Tape */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
        <DoodleTape className="w-24 sm:w-28 h-6" />
      </div>

      {/* Top-Left Corner Sketch Hatch Marks */}
      <DoodleCornerHatch className="absolute top-2.5 left-2.5 w-6 h-6 text-[#9d613c]/45 pointer-events-none" />

      {/* Top Header with Hand-Drawn Accents & Animated Operator Companion */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 pt-1">
              {/* Hand drawn bracket / corner indicator */}
              <span className="text-[#e59b63] text-2xl font-hand font-bold">〔</span>
              <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0]">
                About Me
              </h2>
              <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-12" />
            </div>
            <span className="font-hand text-sm text-[#e59b63] ml-6 -mt-1">
              ~ infrastructure & validator notes ~
            </span>
          </div>

          {/* Animated Chibi CRT Coder Companion */}
          <div className="-mt-2 -mr-1 shrink-0">
            <AboutCoderCharacter />
          </div>
        </div>

        {/* Bio paragraph in a subtle hand-drawn quote note */}
        <p className="text-sm sm:text-base text-[#f0e4d6] leading-relaxed font-normal pl-3 border-l-2 border-dashed border-[#9d613c]/70">
          Experienced blockchain node operator focused on building reliable and scalable
          decentralized infrastructure across multiple networks.
        </p>

        {/* Dedicated Technical Skills Subsection */}
        <TechnicalSkills />
      </div>

      {/* Bottom hand-drawn wavy underline & sketch note */}
      <div className="relative z-10 mt-6 flex items-center justify-between pt-2">
        <WavyUnderline className="w-24 sm:w-28 h-5 text-[#fbeee0]/85 group-hover:text-[#e59b63] transition-colors" />
        <span className="font-hand text-base text-[#e59b63] rotate-[-3deg] bg-[#0d131c] px-2.5 py-0.5 rounded-lg border border-dashed border-[#fbeee0]/40">
          #DEV_UNIT_01 ✎
        </span>
      </div>
    </div>
  );
};
