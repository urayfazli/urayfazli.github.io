import React from 'react';
import { DoodleRays, AptosLogo, SeiLogo, SubQueryLogo } from './Doodles';
import { NETWORKS_DATA } from '../data/portfolioData';

interface ExperienceCardProps {
  onSelectNetwork: (networkId: string) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ onSelectNetwork }) => {
  return (
    <div className="relative rounded-3xl bg-[#141c28] border border-[#232f42] p-5 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#9d613c]/50 hover:shadow-2xl hover:shadow-[#9d613c]/5 h-full">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#fbeee0] text-xl font-fredoka">〔</span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0]">
            Experience
          </h2>
          <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-12" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <p className="font-fredoka text-lg text-[#d6c4b2]">
            Node Operator & Infrastructure
          </p>
          <span className="text-[11px] font-mono text-[#bba998] bg-[#0f1520] px-3 py-1 rounded-full border border-white/5 hidden sm:inline-block">
            Mainnet & Testnet Active
          </span>
        </div>

        {/* 3 Network Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NETWORKS_DATA.map((net) => {
            return (
              <div
                key={net.id}
                role="button"
                tabIndex={0}
                aria-label={`View specs and infrastructure for ${net.name}`}
                onClick={() => onSelectNetwork(net.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectNetwork(net.id);
                  }
                }}
                className="group relative rounded-2xl bg-[#101721] border border-[#232f42] hover:border-[#9d613c] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] touch-manipulation active:scale-[0.98]"
              >
                <div>
                  {/* Network Logo */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#17212e] border border-white/5 group-hover:border-[#9d613c]/40 group-hover:scale-105 transition-all duration-300">
                      {net.logoType === 'aptos' && <AptosLogo className="w-8 h-8 sm:w-10 sm:h-10" />}
                      {net.logoType === 'sei' && <SeiLogo className="w-8 h-8 sm:w-10 sm:h-10" />}
                      {net.logoType === 'subquery' && <SubQueryLogo className="w-8 h-8 sm:w-10 sm:h-10" />}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9d613c] bg-[#9d613c]/10 px-2 py-0.5 rounded-md border border-[#9d613c]/20">
                      Active
                    </span>
                  </div>

                  {/* Network Name & Role */}
                  <h3 className="font-fredoka text-lg sm:text-xl font-medium text-[#fbeee0] group-hover:text-white transition-colors">
                    {net.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#bba998] mt-1 line-clamp-2">
                    {net.role}
                  </p>
                </div>

                {/* Card Action Affordance */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {net.status}
                  </span>
                  
                  <span className="text-xs font-medium text-[#9d613c] group-hover:text-[#fbeee0] transition-colors flex items-center gap-1">
                    Specs ↗
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Network Specs Footnote */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#bba998]">
        <div className="flex items-center gap-2">
          <span className="text-[#9d613c]">✦</span>
          <span>Click any network card to view hardware telemetry & infrastructure specs</span>
        </div>
        <div className="font-mono text-[11px] text-[#bba998] bg-[#0f1520] px-2.5 py-1 rounded-full border border-white/5">
          Dedicated Bare-Metal
        </div>
      </div>

    </div>
  );
};
