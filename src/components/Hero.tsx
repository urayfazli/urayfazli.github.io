import React from 'react';
import { Github, Twitter, ArrowRight, Server, ShieldCheck, Zap } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { ProfileCard } from './ProfileCard';

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onContactClick }) => {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#EBF8FF] text-[#2B6CB0] text-xs font-semibold border border-[#BEE3F8]">
              <span className="w-2 h-2 rounded-full bg-[#38A169] animate-pulse"></span>
              <span>{t.hero.tagline}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#1A202C] tracking-tight leading-tight">
                {t.hero.greeting} <span className="text-[#2B6CB0]">{personalInfo.name}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#718096] leading-relaxed max-w-2xl">
                {t.hero.bio}
              </p>
            </div>

            {/* Featured Network Badges */}
            <div className="pt-2">
              <div className="text-xs uppercase font-semibold text-[#718096] tracking-wider mb-3">
                {t.hero.operatingNetworksTitle}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#2B6CB0] transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#2B6CB0]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">Sei Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">Cosmos SDK</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#38A169] transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#38A169]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">Aptos Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">Block-STM</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#DD6B20] transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#DD6B20]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">SubQuery Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">GraphQL Indexer</span>
                </div>
              </div>
            </div>

            {/* CTA & Socials */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="btn-primary cursor-pointer text-sm py-2.5 px-5 shadow-xs"
              >
                <span>{t.hero.viewExperienceBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onContactClick}
                className="btn-secondary cursor-pointer text-sm py-2.5 px-5"
              >
                {t.hero.contactBtn}
              </button>

              <div className="flex items-center gap-2 sm:ml-2">
                <a
                  href={personalInfo.socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="GitHub @urayfazli"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">{personalInfo.socials.github.username}</span>
                </a>
                <a
                  href={personalInfo.socials.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="X (Twitter) @urayfazli17"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="hidden sm:inline">{personalInfo.socials.x.username}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Card with Photo */}
          <div className="lg:col-span-5">
            <ProfileCard />
          </div>

        </div>
      </div>
    </section>
  );
};

