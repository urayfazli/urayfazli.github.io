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
    <div className="doodle-card p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Top Sketchbook Masking Tape */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-1.5deg] pointer-events-none z-20">
        <DoodleTape className="w-20 h-4.5" />
      </div>

      {/* Top-Left Corner Sketch Hatch Marks */}
      <DoodleCornerHatch className="absolute top-2 left-2 w-5 h-5 text-[#9d613c]/45 pointer-events-none" />

      {/* Top Header with Animated Block-Forger Bot */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[#e59b63] text-xl font-hand font-bold">〔</span>
              <h2 className="font-fredoka text-lg sm:text-xl font-medium tracking-wide text-[#fbeee0]">
                {lang === 'id' ? 'Pengalaman' : 'Experience'}
              </h2>
              <DoodleRays className="w-4 h-4 text-[#fbeee0] rotate-12" />
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-5 -mt-0.5">
              <p className="font-hand text-sm sm:text-base text-[#e59b63]">
                {lang === 'id'
                  ? 'Operator Node & Infrastruktur'
                  : 'Node Operator & Infrastructure'}
              </p>
              <span className="text-[10px] font-mono text-[#fbeee0] bg-[#0b1018] px-2 py-0.5 rounded-md border border-dashed border-[#fbeee0]/40 hidden sm:inline-block">
                {lang === 'id' ? 'Mainnet & Testnet Aktif' : 'Mainnet & Testnet Active'}
              </span>
            </div>
          </div>

          {/* Animated Isometric Block-Forger Companion */}
          <div className="-mt-1 -mr-1 shrink-0">
            <ExperienceForgeCharacter />
          </div>
        </div>

        {/* 3 Network Doodle Subcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
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
                className="doodle-subcard group p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] touch-manipulation active:scale-[0.98]"
              >
                <div>
                  {/* Network Logo + Custom Animated Network Droid Character */}
                  <div className="mb-2.5 flex items-center justify-between gap-1.5">
                    <div className="p-1.5 rounded-lg bg-[#17212e] border border-[#fbeee0]/50 group-hover:border-[#e59b63] group-hover:rotate-[-3deg] transition-all duration-300 shrink-0">
                      {net.logoType === 'aptos' && <AptosLogo className="w-7 h-7 sm:w-8 sm:h-8" />}
                      {net.logoType === 'sei' && <SeiLogo className="w-7 h-7 sm:w-8 sm:h-8" />}
                      {net.logoType === 'subquery' && <SubQueryLogo className="w-7 h-7 sm:w-8 sm:h-8" />}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <NetworkDroidCharacter type={net.logoType} />
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-mono uppercase tracking-wider text-emerald-300 bg-[#0b1018]/90 px-1.5 py-0.5 rounded border border-dashed border-emerald-400/40">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {net.status}
                      </span>
                    </div>
                  </div>

                  {/* Network Name & Role */}
                  <h3 className="font-fredoka text-base font-medium text-[#fbeee0] group-hover:text-white transition-colors leading-snug mb-0.5">
                    {net.name}
                  </h3>
                  <p className="font-hand text-sm text-[#e59b63] leading-snug mb-1">
                    {net.role}
                  </p>
                  <p className="text-[10.5px] text-[#bba998] font-mono mb-2 truncate">
                    {net.category}
                  </p>
                </div>

                {/* Bottom Authentic Hardware & Telemetry Preview */}
                <div className="pt-2 border-t border-dashed border-[#fbeee0]/20 flex items-center justify-between gap-1.5 text-[10px] font-mono text-[#d8c7b6]">
                  <span className="truncate tabular-nums text-[#c9b7a6]" title={`${net.hardware.cpu} · ${net.hardware.ram}`}>
                    {net.hardware.ram.split(' ')[0]} RAM · {net.hardware.bandwidth.split(' ')[0]}
                  </span>
                  <span className="font-hand text-xs text-[#e59b63] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                    {lang === 'id' ? 'Detail →' : 'Specs →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Hint */}
      <div className="relative z-10 mt-4 pt-2.5 border-t border-dashed border-[#fbeee0]/20 flex items-center justify-between text-[11px] text-[#d6c4b2]">
        <span className="font-hand text-sm text-[#fbeee0]/90">
          {lang === 'id'
            ? '✎ Klik kartu jaringan di atas untuk melihat spesifikasi & telemetri node'
            : '✎ Click any network card above for live node telemetry & architecture specs'}
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-[#e59b63] bg-[#0b1018] px-2 py-0.5 rounded-md border border-dashed border-[#fbeee0]/35">
          {lang === 'id' ? '3/3 Aktif Validasi' : '3/3 Validating'}
        </span>
      </div>
    </div>
  );
};
