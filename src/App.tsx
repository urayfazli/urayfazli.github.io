/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NodeExperienceSection } from './components/NodeExperienceSection';
import { LiveNodeMonitor } from './components/LiveNodeMonitor';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

function PortfolioApp() {
  const [activeSection, setActiveSection] = useState<string>('tentang');

  // Handle active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['tentang', 'pengalaman', 'monitor', 'keahlian', 'kontak'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#1A202C]">
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


