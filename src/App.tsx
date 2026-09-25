/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutCard } from './components/AboutCard';
import { ExperienceCard } from './components/ExperienceCard';
import { ConnectCard } from './components/ConnectCard';
import { NetworkDetailModal } from './components/NetworkDetailModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { RevealOnScroll } from './components/RevealOnScroll';
import { NETWORKS_DATA } from './data/portfolioData';
import { NetworkInfo } from './types';
import { DoodleStar } from './components/Doodles';
import { BackgroundLayer } from './components/BackgroundLayer';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  const isNavigatingRef = useRef(false);

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
    const net = NETWORKS_DATA.find((n) => n.id === networkId);
    if (net) {
      setSelectedNetwork(net);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#fbeee0] flex flex-col font-sans selection:bg-[#9d613c] selection:text-white relative">
      
      {/* Permanent Responsive Background Layer */}
      <BackgroundLayer />

      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        
        {/* 1. Hero Section */}
        <section id="home" className="scroll-mt-20">
          <HeroSection
            onScrollDown={() => handleNavigate('about')}
            onSelectNetwork={handleSelectNetwork}
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
                <RevealOnScroll delay={0} className="h-full flex flex-col">
                  <AboutCard />
                </RevealOnScroll>
              </div>

              {/* Infrastructure Philosophy & Stats Side Card */}
              <div className="lg:col-span-5 flex flex-col">
                <RevealOnScroll delay={150} className="h-full flex flex-col">
                  <div className="relative rounded-3xl bg-[#141c28] border border-[#232f42] p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#9d613c]/50 h-full">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#fbeee0] text-xl font-fredoka">〔</span>
                        <h3 className="font-fredoka text-2xl font-medium text-[#fbeee0]">
                          Node Operations
                        </h3>
                        <DoodleStar className="w-5 h-5 text-[#9d613c] animate-twinkle" />
                      </div>
                      
                      <p className="text-sm text-[#d8c7b6] leading-relaxed mb-6">
                        Dedicated to high-availability validator architecture with 24/7 automated telemetry, zero-downtime key rotation, and strict security hardening.
                      </p>

                      {/* Stat Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-[#0f1520] border border-[#232f42]/80">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            99.9%
                          </span>
                          <span className="text-xs font-mono text-[#bba998]">
                            Historical Uptime
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0f1520] border border-[#232f42]/80">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            3+
                          </span>
                          <span className="text-xs font-mono text-[#bba998]">
                            Active Networks
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0f1520] border border-[#232f42]/80">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            24/7
                          </span>
                          <span className="text-xs font-mono text-[#bba998]">
                            Alerts & Sentry
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0f1520] border border-[#232f42]/80">
                          <span className="block text-2xl sm:text-3xl font-fredoka font-semibold text-[#fbeee0]">
                            100%
                          </span>
                          <span className="text-xs font-mono text-[#bba998]">
                            Slashing Protection
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer badge */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#bba998]">
                      <span className="flex items-center gap-1.5 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Production Grade
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavigate('experience')}
                        className="text-[#9d613c] hover:text-[#fbeee0] font-medium cursor-pointer transition-colors"
                      >
                        View Networks ↓
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
                <RevealOnScroll delay={0} className="h-full flex flex-col">
                  <ExperienceCard onSelectNetwork={handleSelectNetwork} />
                </RevealOnScroll>
              </div>

              {/* Connect Card */}
              <div id="connect" className="lg:col-span-4 flex flex-col scroll-mt-20">
                <RevealOnScroll delay={150} className="h-full flex flex-col">
                  <ConnectCard onOpenContact={() => setContactModalOpen(true)} />
                </RevealOnScroll>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer onScrollToTop={() => handleNavigate('home')} />

      {/* Modals */}
      <NetworkDetailModal
        network={selectedNetwork}
        onClose={() => setSelectedNetwork(null)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

    </div>
  );
}
