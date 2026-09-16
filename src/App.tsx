/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Hero } from './components/Hero';
import { NodeExperienceSection } from './components/NodeExperienceSection';
import { LiveNodeMonitor } from './components/LiveNodeMonitor';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { useDynamicSEO } from './hooks/useDynamicSEO';

function PortfolioApp() {
  const [activeSection, setActiveSection] = useState<string>('tentang');

  // Dynamically update document title and SEO metadata according to active section and language
  useDynamicSEO(activeSection);

  // Handle active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['tentang', 'pengalaman', 'monitor', 'keahlian', 'kontak'];
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top - 80) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - navbarHeight - 8),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#1A202C]">
      {/* Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Top Navigation */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onExploreClick={() => scrollToSection('pengalaman')}
          onContactClick={() => scrollToSection('kontak')}
        />
        
        <NodeExperienceSection />
        
        <LiveNodeMonitor />
        
        <SkillsSection />
        
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioApp />
    </LanguageProvider>
  );
}


