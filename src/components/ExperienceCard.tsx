import React from 'react';
import { DoodleRays, AptosLogo, SeiLogo, SubQueryLogo, DoodleTape, DoodleCornerHatch } from './Doodles';
import { ExperienceForgeCharacter, NetworkDroidCharacter } from './CardCharacters';
import { useLanguage } from '../context/LanguageContext';
import { robotSound } from '../utils/robotSoundEngine';

interface ExperienceCardProps {
  onSelectNetwork: (networkId: string) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ onSelectNetwork }) => {
  const { lang, networks } = useLanguage();

  return (
    <div className="doodle-card p-5 sm:p-8 flex flex-col justify-between h-full">
      {/* Top Sketchbook Masking Tape */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-[-1.5deg] pointer-events-none z-20">
        <DoodleTape className="w-24 sm:w-28 h-6" />
      </div>

      {/* Top-Left Corner Sketch Hatch Marks */}
      <DoodleCornerHatch className="absolute top-2.5 left-2.5 w-6 h-6 text-[#9d613c]/45 pointer-events-none" />

      {/* Top Header with Animated Block-Forger Bot */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#e59b63] text-2xl font-hand font-bold">〔</span>
              <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0]">
                {lang === 'id' ? 'Pengalaman' : 'Experience'}
              </h2>
              <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-12" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <p className="font-hand text-xl text-[#e59b63]">
                {lang === 'id'
                  ? 'Operator Node & Infrastruktur'
                  : 'Node Operator & Infrastructure'}
              </p>
              <span className="text-[11px] font-mono text-[#fbeee0] bg-[#0b1018] px-2.5 py-0.5 rounded-lg border-[1.5px] border-dashed border-[#fbeee0]/50 hidden sm:inline-block">
                {lang === 'id' ? 'Mainnet & Testnet Aktif' : 'Mainnet & Testnet Active'}
              </span>
            </div>
          </div>

          {/* Animated Isometric Block-Forger Companion */}
          <div className="-mt-2 -mr-1 shrink-0">
            <ExperienceForgeCharacter />
          </div>
        </div>

        {/* 3 Network Doodle Subcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {networks.map((net) => {
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                robotSound.play(net.logoType);
                onSelectNetwork(net.id);
              }
            };

            return (
              <div
                key={net.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  robotSound.play(net.logoType);
                  onSelectNetwork(net.id);
                }}
                onKeyDown={handleKeyDown}
                aria-label={`View operational details for ${net.name}`}
                className="doodle-subcard group p-4 sm:p-5 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] touch-manipulation active:scale-[0.98]"
              >
                <div>
                  {/* Network Logo + Custom Animated Network Droid Character */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="p-2 rounded-xl bg-[#17212e] border-[1.8px] border-[#fbeee0]/60 group-hover:border-[#e59b63] group-hover:rotate-[-3deg] transition-all duration-300">
                      {net.logoType === 'aptos' && <AptosLogo className="w-8 h-8 sm:w-9 sm:h-9" />}
                      {net.logoType === 'sei' && <SeiLogo className="w-8 h-8 sm:w-9 sm:h-9" />}
                      {net.logoType === 'subquery' && <SubQueryLogo className="w-8 h-8 sm:w-9 sm:h-9" />}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <NetworkDroidCharacter type={net.logoType} />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#fbeee0] bg-[#9d613c]/30 px-2 py-0.5 rounded-md border border-dashed border-[#fbeee0]/50">
                        {net.status}
                      </span>
                    </div>
                  </div>

                  {/* Network Name & Role */}
                  <h3 className="font-fredoka text-lg font-medium text-[#fbeee0] group-hover:text-white transition-colors leading-snug mb-0.5">
                    {net.name}
                  </h3>
                  <p className="text-xs font-hand text-[#e59b63] text-sm mb-2">
                    {net.role}
                  </p>
                  <p className="text-[11px] text-[#bba998] font-mono mb-3 truncate">
                    {net.category}
                  </p>
                </div>

                {/* Bottom Metrics Preview & Interactive Prompt */}
                <div className="pt-3 border-t-[1.5px] border-dashed border-[#fbeee0]/20 flex items-center justify-between text-[11px] font-mono text-[#d8c7b6]">
                  <span>99.9% Uptime</span>
                  <span className="font-hand text-sm text-[#e59b63] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    {lang === 'id' ? 'Detail →' : 'Inspect →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Hint */}
      <div className="relative z-10 mt-6 pt-3 border-t-2 border-dashed border-[#fbeee0]/20 flex items-center justify-between text-xs text-[#d6c4b2]">
        <span className="font-hand text-base text-[#fbeee0]/90">
          {lang === 'id'
            ? '✎ Klik kartu jaringan di atas untuk melihat spesifikasi & telemetri node'
            : '✎ Click any network card above for live node telemetry & architecture specs'}
        </span>
        <span className="hidden sm:inline font-mono text-[11px] text-[#e59b63] bg-[#0b1018] px-2.5 py-0.5 rounded-lg border border-dashed border-[#fbeee0]/40">
          {lang === 'id' ? '3/3 Aktif Validasi' : '3/3 Validating'}
        </span>
      </div>
    </div>
  );
};
