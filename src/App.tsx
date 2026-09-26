/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutCard } from './components/AboutCard';
import { ExperienceCard } from './components/ExperienceCard';
import { ConnectCard } from './components/ConnectCard';
import { NodeTelemetryTerminal } from './components/NodeTelemetryTerminal';
import { NetworkDetailModal } from './components/NetworkDetailModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { RevealOnScroll } from './components/RevealOnScroll';
import { DoodleStar, DoodleTape, DoodleCornerHatch } from './components/Doodles';
import { BackgroundLayer } from './components/BackgroundLayer';
import { RetroAudioPlayer } from './components/RetroAudioPlayer';
import { RunningTextMarquee } from './components/RunningTextMarquee';
import { NodeSentryCharacter } from './components/CardCharacters';
import { LoadingScreen } from './components/LoadingScreen';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { lang, networks } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  const isNavigatingRef = useRef(false);

  const selectedNetwork = selectedNetworkId
    ? networks.find((n) => n.id === selectedNetworkId) || null
    : null;

  // Smooth scroll handler with robust mobile and desktop support
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'contact') {
      setContactModalOpen(true);
      return;
    }

    isNavigatingRef.current = true;

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 750);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const navbarOffset = isMobile ? 65 : 85;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, elementTop - navbarOffset);

      window.scrollTo({ top: targetY, behavior: 'smooth' });

      // Visual feedback highlight
      setHighlightedCard(sectionId);
      setTimeout(() => {
        setHighlightedCard(null);
        isNavigatingRef.current = false;
      }, 800);
    }
  };

  // Scroll spy to detect active section dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const scrollPos = window.scrollY;

      const aboutEl = document.getElementById('about');
      const expEl = document.getElementById('experience');

      if (!aboutEl || !expEl) return;

      const expTop = expEl.getBoundingClientRect().top + scrollPos - 180;
      const aboutTop = aboutEl.getBoundingClientRect().top + scrollPos - 180;

      if (scrollPos >= expTop) {
        setActiveSection('experience');
      } else if (scrollPos >= aboutTop) {
        setActiveSection('about');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectNetwork = (networkId: string) => {
    setSelectedNetworkId(networkId);
  };

  const handleStartReveal = () => {
    setIsRevealed(true);
  };

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#fbeee0] flex flex-col font-sans selection:bg-[#9d613c] selection:text-white relative overflow-x-clip">
      {/* Initial Boot Loading Screen with Smooth Cross-Dissolve */}
      {isLoading && (
        <LoadingScreen
          onStartExit={handleStartReveal}
          onFinish={handleLoadingFinish}
        />
      )}

      {/* Permanent Responsive Background Layer */}
      <BackgroundLayer />

      {/* Sticky Top Bar Navigation with Scroll Progress Indicator & Animated Rocket */}
      <div
        className={`sticky top-0 z-50 transition-opacity duration-700 ease-out ${
          isRevealed
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
        />
      </div>

      {/* Smooth Cross-Dissolve & Gentle Elevation Glide Wrapper on Web Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={
          isRevealed
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
              }
            : { opacity: 0, y: 18, scale: 0.985 }
        }
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 35vh' }}
        className={`flex flex-col flex-grow relative z-10 ${
          isLoading ? 'will-change-transform' : ''
        }`}
      >
        {/* Running Text Marquee Banner with Unfurl Entrance */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <RunningTextMarquee />
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-grow relative z-10">
          
          {/* 1. Hero Section */}
          <section id="home" className="scroll-mt-20">
            <HeroSection
              onScrollDown={() => handleNavigate('about')}
              onSelectNetwork={handleSelectNetwork}
              isLoaded={isRevealed}
            />
          </section>

          {/* 2. About Section */}
          <section
            id="about"
            className={`py-12 md:py-20 relative scroll-mt-20 transition-all duration-500 ${
              highlightedCard === 'about' ? 'bg-[#9d613c]/5' : ''
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Main Bio Card */}
                <div className="lg:col-span-7 flex flex-col">
                  <RevealOnScroll delay={0} ready={isRevealed} className="h-full flex flex-col">
                    <AboutCard />
                  </RevealOnScroll>
                </div>

                {/* Infrastructure Philosophy & Stats Side Card */}
                <div className="lg:col-span-5 flex flex-col">
                  <RevealOnScroll delay={150} ready={isRevealed} className="h-full flex flex-col">
                  <div className="doodle-card doodle-card-alt p-6 sm:p-8 flex flex-col justify-between h-full">
                    {/* Top Sketchbook Tape */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-[2deg] pointer-events-none z-20">
                      <DoodleTape className="w-24 sm:w-28 h-6" />
                    </div>

                    {/* Top-Left Corner Sketch Hatch Marks */}
                    <DoodleCornerHatch className="absolute top-2.5 left-2.5 w-6 h-6 text-[#9d613c]/45 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[#e59b63] text-2xl font-hand font-bold">〔</span>
                            <h3 className="font-fredoka text-2xl font-medium text-[#fbeee0]">
                              {lang === 'id' ? 'Operasi Node' : 'Node Operations'}
                            </h3>
                            <DoodleStar className="w-5 h-5 text-[#e59b63] animate-twinkle" />
                          </div>
                          <span className="font-hand text-sm text-[#e59b63] ml-6 -mt-1">
                            {lang === 'id'
                              ? '~ sentry & telemetri 24/7 ~'
                              : '~ 24/7 sentry & telemetry ~'}
                          </span>
                        </div>

                        {/* Animated Hovering Validator Sentry Mech */}
                        <div className="-mt-2 -mr-1 shrink-0">
                          <NodeSentryCharacter />
                        </div>
                      </div>
                      
                      <p className="text-sm text-[#f0e4d6] leading-relaxed mb-4 pl-3 border-l-2 border-dashed border-[#9d613c]/70">
                        {lang === 'id'
                          ? 'Berdedikasi pada arsitektur validator ketersediaan tinggi dengan telemetri otomatis 24/7, rotasi kunci tanpa downtime, dan pengamanan sistem yang ketat.'
                          : 'Dedicated to high-availability validator architecture with 24/7 automated telemetry, zero-downtime key rotation, and strict security hardening.'}
                      </p>

                      {/* Unboxed Hairline-Divided Tabular Summary Strip */}
                      <div className="grid grid-cols-4 divide-x divide-[#fbeee0]/15 border-y border-[#fbeee0]/15 py-2.5 mb-4 text-center">
                        <div className="px-1.5">
                          <span className="block text-base sm:text-lg font-mono tabular-nums font-semibold text-[#fbeee0]">
                            99.9%
                          </span>
                          <span className="block text-[11px] text-[#e59b63] truncate">
                            {lang === 'id' ? 'Uptime' : 'Uptime'}
                          </span>
                        </div>
                        <div className="px-1.5">
                          <span className="block text-base sm:text-lg font-mono tabular-nums font-semibold text-[#fbeee0]">
                            3+
                          </span>
                          <span className="block text-[11px] text-[#e59b63] truncate">
                            {lang === 'id' ? 'Jaringan' : 'Networks'}
                          </span>
                        </div>
                        <div className="px-1.5">
                          <span className="block text-base sm:text-lg font-mono tabular-nums font-semibold text-[#fbeee0]">
                            24/7
                          </span>
                          <span className="block text-[11px] text-[#e59b63] truncate">
                            {lang === 'id' ? 'Sentry' : 'Sentry'}
                          </span>
                        </div>
                        <div className="px-1.5">
                          <span className="block text-base sm:text-lg font-mono tabular-nums font-semibold text-[#fbeee0]">
                            100%
                          </span>
                          <span className="block text-[11px] text-[#e59b63] truncate">
                            {lang === 'id' ? 'Anti-Slash' : 'Slashing Guard'}
                          </span>
                        </div>
                      </div>

                      {/* Anti-AI-Slop Live Node Telemetry Terminal */}
                      <NodeTelemetryTerminal onSelectNetwork={handleSelectNetwork} />
                    </div>

                    {/* Footer badge */}
                    <div className="relative z-10 pt-4 border-t-2 border-dashed border-[#fbeee0]/20 flex items-center justify-between text-xs text-[#d6c4b2]">
                      <span className="flex items-center gap-1.5 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {lang === 'id' ? 'Kelas Produksi' : 'Production Grade'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavigate('experience')}
                        className="font-hand text-base text-[#e59b63] hover:text-[#fbeee0] font-medium cursor-pointer transition-colors"
                      >
                        {lang === 'id' ? 'Lihat Jaringan ↓' : 'View Networks ↓'}
                      </button>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

            </div>

          </div>
        </section>

        {/* 3. Experience Section */}
        <section
          id="experience"
          className={`py-12 md:py-20 relative scroll-mt-20 transition-all duration-500 ${
            highlightedCard === 'experience' ? 'bg-[#9d613c]/5' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Experience Validator Cards */}
              <div className="lg:col-span-8 flex flex-col">
                <RevealOnScroll delay={0} ready={isRevealed} className="h-full flex flex-col">
                  <ExperienceCard onSelectNetwork={handleSelectNetwork} />
                </RevealOnScroll>
              </div>

              {/* Connect Card */}
              <div id="connect" className="lg:col-span-4 flex flex-col scroll-mt-20">
                <RevealOnScroll delay={150} ready={isRevealed} className="h-full flex flex-col">
                  <ConnectCard onOpenContact={() => setContactModalOpen(true)} />
                </RevealOnScroll>
              </div>

            </div>

          </div>
        </section>

        </main>

        {/* Footer */}
        <Footer onScrollToTop={() => handleNavigate('home')} />
      </motion.div>

      {/* Retro 8-bit Backsound Player Widget (Synced with Post-Loading Reveal) */}
      <RetroAudioPlayer isReady={isRevealed} />

      {/* Modals */}
      <NetworkDetailModal
        network={selectedNetwork}
        onClose={() => setSelectedNetworkId(null)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

    </div>
  );
}
