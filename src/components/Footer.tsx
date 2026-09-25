import React from 'react';
import { CrownDoodle, GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { VisitorCounterBadge } from './VisitorCounterBadge';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0e14]/85 backdrop-blur-md py-12 text-[#9a8978] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <span className="font-fredoka text-lg font-medium text-[#fbeee0]">
              Uray Fazli Alman
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-[#a39483]">Blockchain Node Operator</span>
            <CrownDoodle className="w-4 h-4 text-[#9d613c] rotate-12" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#fbeee0] transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>{SOCIAL_DATA.github}</span>
            </a>
            <span className="text-white/20">·</span>
            <a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#fbeee0] transition-colors"
            >
              <XIcon className="w-3.5 h-3.5" />
              <span>{SOCIAL_DATA.twitter}</span>
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-2 text-xs text-[#a39483] hover:text-[#fbeee0] transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>

        </div>

        {/* Real-time Telemetry Bar with Visitor Counter Badge & Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[#786a5d] font-mono text-center sm:text-left">
            © {new Date().getFullYear()} Uray Fazli Alman · Aptos · Sei · SubQuery Node Infrastructure
          </div>

          {/* Live Visitor Counter Badge */}
          <VisitorCounterBadge />
        </div>
      </div>
    </footer>
  );
};

