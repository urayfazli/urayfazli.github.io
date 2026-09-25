import React, { useState } from 'react';
import { CrownDoodle, GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';

interface ConnectCardProps {
  onOpenContact: () => void;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({ onOpenContact }) => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedHandle(label);
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-[#141c28] border border-[#232f42] p-5 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#9d613c]/50 h-full">
      
      <div>
        {/* Title */}
        <h2 className="font-fredoka text-2xl sm:text-3xl font-medium tracking-wide text-[#fbeee0] mb-6">
          Connect
        </h2>

        {/* Social Connect Action Buttons */}
        <div className="space-y-3">
          
          {/* GitHub Action */}
          <div className="flex items-center gap-2">
            <a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between px-5 py-3 rounded-2xl border border-[#232f42] bg-[#101721] hover:bg-[#1a2535] hover:border-[#9d613c]/60 text-[#fbeee0] transition-all duration-200 group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
            >
              <div className="flex items-center gap-3">
                <GitHubIcon className="w-5 h-5 text-[#fbeee0] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.github}
                </span>
              </div>
              <span className="text-xs text-[#d8c8b8] group-hover:text-white transition-colors">
                Profile
              </span>
            </a>

            <button
              onClick={(e) => handleCopy(SOCIAL_DATA.github, 'github', e)}
              title="Copy handle"
              className="px-3.5 py-3 rounded-2xl border border-[#232f42] bg-[#101721] hover:bg-[#1a2535] text-[#d8c8b8] hover:text-[#fbeee0] transition-colors cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
            >
              {copiedHandle === 'github' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* X.com Action */}
          <div className="flex items-center gap-2">
            <a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between px-5 py-3 rounded-2xl border border-[#232f42] bg-[#101721] hover:bg-[#1a2535] hover:border-[#9d613c]/60 text-[#fbeee0] transition-all duration-200 group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
            >
              <div className="flex items-center gap-3">
                <XIcon className="w-4.5 h-4.5 text-[#fbeee0] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base tracking-wide">
                  {SOCIAL_DATA.twitter}
                </span>
              </div>
              <span className="text-xs text-[#d8c8b8] group-hover:text-white transition-colors">
                Profile
              </span>
            </a>

            <button
              onClick={(e) => handleCopy(SOCIAL_DATA.twitter, 'twitter', e)}
              title="Copy handle"
              className="px-3.5 py-3 rounded-2xl border border-[#232f42] bg-[#101721] hover:bg-[#1a2535] text-[#d8c8b8] hover:text-[#fbeee0] transition-colors cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
            >
              {copiedHandle === 'twitter' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* Direct Message Option */}
          <button
            onClick={onOpenContact}
            className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-[#9d613c]/20 hover:bg-[#9d613c] border border-[#9d613c]/50 text-[#fbeee0] hover:text-white text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Send Direct Message</span>
          </button>

        </div>
      </div>

      {/* Hand-drawn doodle note: "Let's build together!" with little crown sketch */}
      <div className="mt-8 pt-4 flex flex-col items-end">
        <div className="relative inline-flex items-center gap-2 rotate-[-3deg] group cursor-default">
          <span className="font-hand text-2xl sm:text-3xl text-[#fbeee0] tracking-wide leading-none group-hover:text-[#9d613c] transition-colors">
            Let's build together!
          </span>
          <CrownDoodle className="w-6 h-5 text-[#fbeee0] rotate-12 group-hover:scale-110 transition-transform" />
        </div>
      </div>

    </div>
  );
};
