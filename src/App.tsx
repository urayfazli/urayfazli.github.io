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

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Portfolio render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC] px-6">
          <div className="max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm">
            <h1 className="font-heading text-2xl font-bold text-[#1A202C]">Something went wrong</h1>
            <p className="mt-3 text-sm text-[#718096]">
              The portfolio is temporarily unavailable. Please refresh the page or try again later.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 btn-primary"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    <AppErrorBoundary>
      <LanguageProvider>
        <PortfolioApp />
      </LanguageProvider>
    </AppErrorBoundary>
  );
}
