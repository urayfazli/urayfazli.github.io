import React, { useState } from 'react';
import { GitHubIcon, XIcon, DoodleTape, DoodleCornerHatch, DoodleRays } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { ConnectMessengerCharacter } from './CardCharacters';
import { useLanguage } from '../context/LanguageContext';

interface ConnectCardProps {
  onOpenContact: () => void;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({ onOpenContact }) => {
  const { lang } = useLanguage();
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedHandle(label);
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  return (
    <div className="doodle-card doodle-card-alt p-5 sm:p-8 flex flex-col justify-between h-full">
      {/* Top Sketchbook Masking Tape */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-[2deg] pointer-events-none z-20">
        <DoodleTape className="w-24 sm:w-28 h-6" />
      </div>

      {/* Top-Left Corner Sketch Hatch Marks */}
      <DoodleCornerHatch className="absolute top-2.5 left-2.5 w-6 h-6 text-[#9d613c]/45 pointer-events-none" />

      <div className="relative z-10">
        {/* Title & Animated Courier Bot Character */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#e59b63] text-2xl font-hand font-bold">〔</span>
              <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0]">
                {lang === 'id' ? 'Terhubung' : 'Connect'}
              </h2>
              <DoodleRays className="w-5 h-5 text-[#fbeee0] rotate-12" />
            </div>
            <span className="font-hand text-base text-[#e59b63] ml-6 block -mt-1">
              {lang === 'id'
                ? '~ terbuka untuk kolaborasi Node Ops & Web3 ~'
                : '~ open for Node Ops & Web3 collab ~'}
            </span>
          </div>

          <div className="-mt-2 -mr-1 shrink-0">
            <ConnectMessengerCharacter />
          </div>
        </div>

        {/* Social Connect Doodle Subcards */}
        <div className="space-y-3.5">
          {/* 1. GitHub Button */}
          <div className="doodle-subcard group flex items-center justify-between p-3.5 sm:px-4">
            <a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 flex-grow focus:outline-none"
            >
              <div className="p-2 rounded-xl bg-[#182230] text-[#fbeee0] border-[1.5px] border-[#fbeee0]/60 group-hover:bg-[#9d613c] group-hover:text-white group-hover:rotate-[-4deg] transition-all">
                <GitHubIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-hand text-[#e59b63] text-sm leading-tight">
                  {lang === 'id' ? 'Repositori GitHub' : 'GitHub Repository'}
                </span>
                <span className="font-mono text-sm sm:text-base font-medium text-[#fbeee0] group-hover:text-white">
                  {SOCIAL_DATA.github}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleCopy(e, SOCIAL_DATA.githubUrl, 'github')}
                className="px-2.5 py-1 rounded-lg bg-[#182230] hover:bg-[#223042] text-[11px] font-mono text-[#e8d8c8] hover:text-white border border-dashed border-[#fbeee0]/40 transition-colors cursor-pointer"
                title="Copy GitHub URL"
              >
                {copiedHandle === 'github'
                  ? lang === 'id'
                    ? 'Tersalin ✓'
                    : 'Copied ✓'
                  : lang === 'id'
                  ? 'Salin'
                  : 'Copy'}
              </button>
              <a
                href={SOCIAL_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#d4c3b3] hover:text-[#fbeee0] transition-colors"
                aria-label="Open GitHub in new tab"
              >
                ↗
              </a>
            </div>
          </div>

          {/* 2. X / Twitter Button */}
          <div className="doodle-subcard group flex items-center justify-between p-3.5 sm:px-4">
            <a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 flex-grow focus:outline-none"
            >
              <div className="p-2 rounded-xl bg-[#182230] text-[#fbeee0] border-[1.5px] border-[#fbeee0]/60 group-hover:bg-[#9d613c] group-hover:text-white group-hover:rotate-[4deg] transition-all">
                <XIcon className="w-4 h-4 m-0.5" />
              </div>
              <div>
                <span className="block text-xs font-hand text-[#e59b63] text-sm leading-tight">
                  X (Twitter)
                </span>
                <span className="font-mono text-sm sm:text-base font-medium text-[#fbeee0] group-hover:text-white">
                  {SOCIAL_DATA.twitter}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleCopy(e, SOCIAL_DATA.twitter, 'twitter')}
                className="px-2.5 py-1 rounded-lg bg-[#182230] hover:bg-[#223042] text-[11px] font-mono text-[#e8d8c8] hover:text-white border border-dashed border-[#fbeee0]/40 transition-colors cursor-pointer"
                title="Copy X Handle"
              >
                {copiedHandle === 'twitter'
                  ? lang === 'id'
                    ? 'Tersalin ✓'
                    : 'Copied ✓'
                  : lang === 'id'
                  ? 'Salin'
                  : 'Copy'}
              </button>
              <a
                href={SOCIAL_DATA.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#d4c3b3] hover:text-[#fbeee0] transition-colors"
                aria-label="Open X in new tab"
              >
                ↗
              </a>
            </div>
          </div>

          {/* 3. Direct Message / Contact Trigger */}
          <button
            type="button"
            onClick={onOpenContact}
            className="doodle-subcard w-full flex items-center justify-between p-3.5 sm:px-4 !bg-[#9d613c]/20 hover:!bg-[#9d613c]/30 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#9d613c] text-white border-[1.5px] border-[#fbeee0] group-hover:rotate-[-4deg] transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="block font-hand text-sm text-[#fbeee0] leading-tight">
                  {lang === 'id'
                    ? 'Pertanyaan Validator / Kolaborasi'
                    : 'Validator Inquiry / Collaboration'}
                </span>
                <span className="font-fredoka text-sm sm:text-base font-medium text-[#fbeee0]">
                  {lang === 'id' ? 'Kirim Pesan Langsung ✎' : 'Send Direct Message ✎'}
                </span>
              </div>
            </div>
            <span className="text-[#fbeee0] font-hand text-lg group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Hand-drawn note: "Let's build together!" with blinking terminal cursor */}
      <div className="relative z-10 mt-7 pt-4 border-t-2 border-dashed border-[#fbeee0]/20 flex flex-col items-end">
        <div className="relative inline-flex items-center gap-2 rotate-[-2deg] group cursor-default">
          <span className="font-hand text-2xl sm:text-3xl text-[#fbeee0] tracking-wide leading-none group-hover:text-[#e59b63] transition-colors">
            {lang === 'id' ? 'Mari membangun bersama!' : "Let's build together!"}
          </span>
          <span className="inline-block w-2.5 h-5 bg-[#22c55e] rounded-xs animate-pulse" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
