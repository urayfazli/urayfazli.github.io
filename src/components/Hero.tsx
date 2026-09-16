import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, ArrowRight, Server, ShieldCheck, Zap } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { ProfileCard } from './ProfileCard';
import { HeroParticleBackground } from './HeroParticleBackground';

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onContactClick }) => {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden scroll-mt-16">
      {/* Background Web3 Particle Node Mesh */}
      <HeroParticleBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Content */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#EBF8FF] text-[#2B6CB0] text-xs font-semibold border border-[#BEE3F8]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#38A169] animate-pulse"></span>
              <span>{t.hero.tagline}</span>
            </motion.div>

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#1A202C] tracking-tight leading-tight">
                {t.hero.greeting} <span className="text-[#2B6CB0]">{personalInfo.name}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#718096] leading-relaxed max-w-2xl">
                {t.hero.bio}
              </p>
            </motion.div>

            {/* Featured Network Badges */}
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="text-xs uppercase font-semibold text-[#718096] tracking-wider mb-3">
                {t.hero.operatingNetworksTitle}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#2B6CB0] transition-colors shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#2B6CB0]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">Sei Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">Cosmos SDK</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#38A169] transition-colors shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#38A169]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">Aptos Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">Block-STM</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded hover:border-[#DD6B20] transition-colors shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#DD6B20]"></span>
                  <span className="text-xs font-semibold text-[#1A202C]">SubQuery Network</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-[#EDF2F7] text-[#718096] rounded font-medium">GraphQL Indexer</span>
                </div>
              </div>
            </motion.div>

            {/* CTA & Socials */}
            <motion.div 
              className="pt-4 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="btn-primary cursor-pointer text-sm py-2.5 px-5 shadow-xs"
              >
                <span>{t.hero.viewExperienceBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-contact-btn"
                onClick={onContactClick}
                className="btn-secondary cursor-pointer text-sm py-2.5 px-5"
              >
                {t.hero.contactBtn}
              </button>

              <div className="flex items-center gap-2 sm:ml-2">
                <a
                  id="hero-github-link"
                  href={personalInfo.socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
                  title="GitHub @urayfazli"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">{personalInfo.socials.github.username}</span>
                </a>
                <a
                  id="hero-twitter-link"
                  href={personalInfo.socials.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-[#E2E8F0] text-[#1A202C] hover:text-[#2B6CB0] hover:border-[#2B6CB0] rounded transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
                  title="X (Twitter) @urayfazli17"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="hidden sm:inline">{personalInfo.socials.x.username}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Profile Card with Photo */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfileCard />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

