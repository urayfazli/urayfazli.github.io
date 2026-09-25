/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutCard } from './components/AboutCard';
import { ExperienceCard } from './components/ExperienceCard';
import { ConnectCard } from './components/ConnectCard';
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
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
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
    setTimeout(() => {
      setShowWelcomeBanner(true);
    }, 450);
    setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 4650);
  };

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#fbeee0] flex flex-col font-sans selection:bg-[#9d613c] selection:text-white relative overflow-x-hidden">
      {/* Initial Boot Loading Screen with Smooth Cross-Dissolve */}
      {isLoading && (
        <LoadingScreen
          onStartExit={handleStartReveal}
          onFinish={handleLoadingFinish}
        />
      )}

      {/* Post-Loading Welcome Doodle HUD Toast */}
      <AnimatePresence>
        {showWelcomeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -28, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
            exit={{ opacity: 0, y: -18, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            onClick={() => setShowWelcomeBanner(false)}
            className="fixed top-20 right-4 sm:right-8 z-50 cursor-pointer select-none px-4 py-2 rounded-[16px_11px_18px_12px] bg-[#101722]/95 border-2 border-[#fbeee0] shadow-[4px_4px_0px_#9d613c] flex items-center gap-2.5 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="text-left">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                {lang === 'id' ? '✓ SEMUA NODE SINKRON (100%)' : '✓ ALL NODES SYNCED (100%)'}
              </span>
              <span className="font-hand text-sm sm:text-base text-[#fbeee0]">
                {lang === 'id'
                  ? 'Selamat datang di Validator Sketchbook Uray! ✨'
                  : "Welcome to Uray's Validator Sketchbook! ✨"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permanent Responsive Background Layer */}
      <BackgroundLayer />

      {/* Smooth Whole-Page Camera Unblur & Glide Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.975, y: 22, filter: 'blur(8px)' }}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, scale: 0.975, y: 22, filter: 'blur(8px)' }
        }
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col flex-grow relative z-10"
      >
        {/* Top Bar Navigation with Post-Boot Slide-In */}
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-40"
        >
          <Navbar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </motion.div>

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
                      
                      <p className="text-sm text-[#f0e4d6] leading-relaxed mb-6 pl-3 border-l-2 border-dashed border-[#9d613c]/70">
                        {lang === 'id'
                          ? 'Berdedikasi pada arsitektur validator ketersediaan tinggi dengan telemetri otomatis 24/7, rotasi kunci tanpa downtime, dan pengamanan sistem yang ketat.'
                          : 'Dedicated to high-availability validator architecture with 24/7 automated telemetry, zero-downtime key rotation, and strict security hardening.'}
                      </p>

                      {/* Sketchbook Doodle Stat Grid */}
                      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-6">
                        <div className="doodle-subcard p-4">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            99.9%
                          </span>
                          <span className="text-xs font-hand tracking-wide text-[#e59b63] text-sm">
                            {lang === 'id' ? 'Uptime Historis' : 'Historical Uptime'}
                          </span>
                        </div>
                        <div className="doodle-subcard p-4">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            3+
                          </span>
                          <span className="text-xs font-hand tracking-wide text-[#e59b63] text-sm">
                            {lang === 'id' ? 'Jaringan Aktif' : 'Active Networks'}
                          </span>
                        </div>
                        <div className="doodle-subcard p-4">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            24/7
                          </span>
                          <span className="text-xs font-hand tracking-wide text-[#e59b63] text-sm">
                            {lang === 'id' ? 'Peringatan & Sentry' : 'Alerts & Sentry'}
                          </span>
                        </div>
                        <div className="doodle-subcard p-4">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            100%
                          </span>
                          <span className="text-xs font-hand tracking-wide text-[#e59b63] text-sm">
                            {lang === 'id' ? 'Proteksi Slashing' : 'Slashing Guard'}
                          </span>
                        </div>
                      </div>
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
