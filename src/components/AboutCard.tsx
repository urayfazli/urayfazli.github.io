import React from 'react';
import { DoodleRays, CrownDoodle, WavyUnderline } from './Doodles';
import { TechnicalSkills } from './TechnicalSkills';

export const AboutCard: React.FC = () => {
  return (
    <div className="relative rounded-3xl bg-[#141c28] border border-[#232f42] p-5 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#9d613c]/50 group h-full">
      
      {/* Top Header with Hand-Drawn Accents */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          {/* Hand drawn bracket / corner indicator */}
          <span className="text-[#fbeee0] text-xl font-fredoka">〔</span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0]">
            About Me
          </h2>
          <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-12" />
        </div>

        {/* Bio paragraph from user mockup */}
        <p className="text-[#d8c7b6] text-base leading-relaxed font-normal">
          I'm Uray Fazli Alman, a blockchain enthusiast and node operator with experience running nodes on several leading networks. I'm passionate about decentralization, infrastructure, and building a more open internet.
        </p>

        {/* Technical Skills Pill-Style Tag Cloud */}
        <TechnicalSkills />
      </div>

      {/* Bottom hand-drawn wavy underline & crown doodle matching the mockup */}
      <div className="mt-6 flex items-center justify-between pt-2">
        <WavyUnderline className="w-24 sm:w-28 h-5 text-[#fbeee0]/80 group-hover:text-[#fbeee0] transition-colors" />
        <CrownDoodle className="w-6 h-5 text-[#fbeee0]/80 group-hover:text-[#9d613c] transition-colors rotate-6" />
      </div>

    </div>
  );
};
