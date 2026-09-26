import React from 'react';
import { DoodleRays, WavyUnderline, DoodleTape, DoodleCornerHatch } from './Doodles';
import { TechnicalSkills } from './TechnicalSkills';
import { AboutCoderCharacter } from './CardCharacters';
import { useLanguage } from '../context/LanguageContext';

export const AboutCard: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="doodle-card group p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Top Sketchbook Masking Tape */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
        <DoodleTape className="w-20 h-4.5" />
      </div>

      {/* Top-Left Corner Sketch Hatch Marks */}
      <DoodleCornerHatch className="absolute top-2 left-2 w-5 h-5 text-[#9d613c]/45 pointer-events-none" />

      {/* Top Header with Hand-Drawn Accents & Animated Operator Companion */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 pt-0.5">
              {/* Hand drawn bracket / corner indicator */}
              <span className="text-[#e59b63] text-xl font-hand font-bold">〔</span>
              <h2 className="font-fredoka text-lg sm:text-xl font-medium tracking-wide text-[#fbeee0]">
                {lang === 'id' ? 'Tentang Saya' : 'About Me'}
              </h2>
              <DoodleRays className="w-4 h-4 text-[#fbeee0] rotate-12" />
            </div>
            <span className="font-hand text-xs sm:text-sm text-[#e59b63] ml-5 -mt-0.5">
              {lang === 'id'
                ? '~ catatan infrastruktur & validator ~'
                : '~ infrastructure & validator notes ~'}
            </span>
          </div>

          {/* Animated Chibi CRT Coder Companion */}
          <div className="-mt-1 -mr-1 shrink-0">
            <AboutCoderCharacter />
          </div>
        </div>

        {/* Bio paragraph in a subtle hand-drawn quote note */}
        <p className="text-xs sm:text-[13.5px] text-[#f0e4d6] leading-relaxed font-normal pl-2.5 border-l-2 border-dashed border-[#9d613c]/70">
          {lang === 'id'
            ? 'Operator node blockchain berpengalaman yang berfokus membangun infrastruktur terdesentralisasi yang andal, aman, dan skalabel di berbagai jaringan.'
            : 'Experienced blockchain node operator focused on building reliable and scalable decentralized infrastructure across multiple networks.'}
        </p>

        {/* Dedicated Technical Skills Subsection */}
        <TechnicalSkills />
      </div>

      {/* Bottom Infrastructure Specs Strip & Hand-Drawn Sketch Note */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#fbeee0]/15 space-y-2.5">
        <div className="grid grid-cols-3 divide-x divide-[#fbeee0]/15 text-[10px] sm:text-[11px] font-mono text-[#d6c4b2]">
          <div className="pr-2">
            <span className="block text-[9.5px] uppercase tracking-wider text-[#9a8978]">
              {lang === 'id' ? 'Arsitektur' : 'Architecture'}
            </span>
            <span className="text-[#fbeee0] font-medium truncate block mt-0.5">
              Bare-Metal · NVMe
            </span>
          </div>
          <div className="px-2">
            <span className="block text-[9.5px] uppercase tracking-wider text-[#9a8978]">
              {lang === 'id' ? 'Keamanan' : 'Security'}
            </span>
            <span className="text-[#fbeee0] font-medium truncate block mt-0.5">
              Sentry · WireGuard
            </span>
          </div>
          <div className="pl-2">
            <span className="block text-[9.5px] uppercase tracking-wider text-[#9a8978]">
              {lang === 'id' ? 'Observabilitas' : 'Observability'}
            </span>
            <span className="text-[#fbeee0] font-medium truncate block mt-0.5">
              Prometheus · Pager
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <WavyUnderline className="w-20 sm:w-24 h-4 text-[#fbeee0]/85 group-hover:text-[#e59b63] transition-colors" />
          <span className="font-hand text-sm text-[#e59b63] rotate-[-2deg] bg-[#0d131c] px-2 py-0.5 rounded-md border border-dashed border-[#fbeee0]/40">
            #DEV_UNIT_01 ✎
          </span>
        </div>
      </div>
    </div>
  );
};
