import React from 'react';
import { CrownDoodle, GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { VisitorCounterBadge } from './VisitorCounterBadge';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const { lang } = useLanguage();

  return (
    <footer className="w-full border-t border-[#fbeee0]/10 bg-[#0b0e14]/95 pt-10 pb-24 sm:pb-12 text-[#9a8978] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Brand & Title */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="font-fredoka text-lg font-medium text-[#fbeee0]">
              Uray Fazli Alman
            </span>
            <span className="text-[#fbeee0]/20">·</span>
            <span className="text-xs font-mono text-[#c5b4a3]">
              {lang === 'id' ? 'Operator Node Blockchain' : 'Blockchain Node Operator'}
            </span>
            <CrownDoodle className="w-4 h-4 text-[#e59b63] rotate-12" />
          </div>

          {/* Social Links & Back to top */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[#c5b4a3] hover:text-[#fbeee0] transition-colors"
            >
              <GitHubIcon className="w-4 h-4 text-[#e59b63]" />
              <span>{SOCIAL_DATA.github}</span>
            </a>
            <span className="text-[#fbeee0]/20">·</span>
            <a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[#c5b4a3] hover:text-[#fbeee0] transition-colors"
            >
              <XIcon className="w-3.5 h-3.5 text-[#e59b63]" />
              <span>{SOCIAL_DATA.twitter}</span>
            </a>
            <span className="text-[#fbeee0]/20">·</span>
            <button
              type="button"
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#121926] hover:bg-[#9d613c] text-xs font-mono text-[#fbeee0] hover:text-white border border-dashed border-[#fbeee0]/30 hover:border-[#fbeee0] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63]"
            >
              <span>{lang === 'id' ? 'Ke Atas' : 'Top'}</span>
              <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Bar with Visitor Counter Badge & Copyright */}
        <div className="mt-7 pt-5 border-t border-[#fbeee0]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[#9a8978] font-mono text-center sm:text-left">
            © {new Date().getFullYear()} Uray Fazli Alman · Aptos · Sei · SubQuery Validator Infrastructure
          </div>

          {/* Live Visitor Counter Badge */}
          <VisitorCounterBadge />
        </div>
      </div>
    </footer>
  );
};

