import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Github, Twitter, Menu, X } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { id: 'tentang', label: t.nav.about },
    { id: 'pengalaman', label: t.nav.nodeExperience },
    { id: 'monitor', label: t.nav.liveTelemetry },
    { id: 'keahlian', label: t.nav.skills },
    { id: 'kontak', label: t.nav.contact },
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);

    // Give state time to update and close mobile menu before calculating scroll
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 64; // height of sticky header
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = Math.max(0, elementPosition - navbarHeight - 8);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <motion.header 
      id="main-navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg bg-[#2B6CB0] flex items-center justify-center text-white shadow-xs cursor-pointer"
              onClick={() => handleScrollTo('tentang')}
            >
              <Server className="w-5 h-5" />
            </motion.div>
            <div>
              <a 
                href="#tentang" 
                onClick={(e) => { e.preventDefault(); handleScrollTo('tentang'); }}
                className="text-lg font-bold font-heading text-[#1A202C] hover:text-[#2B6CB0] transition-colors inline-block"
              >
                {personalInfo.name}
              </a>
              <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38A169] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38A169]"></span>
                </span>
                <span>{t.nav.roleBadge}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer hover:bg-[#F7FAFC] ${
                    isActive ? 'text-[#2B6CB0] font-semibold' : 'text-[#718096] hover:text-[#1A202C]'
                  }`}
                >
                  {/* Active Bottom Underline Indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2B6CB0] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Language Toggle + Social Icons + Contact CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <LanguageToggle />

            <div className="h-4 w-px bg-[#E2E8F0] mx-0.5"></div>

            <motion.a
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors cursor-pointer"
              title={`GitHub: ${personalInfo.socials.github.username}`}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.socials.x.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) Profile"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors cursor-pointer"
              title={`X: ${personalInfo.socials.x.username}`}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScrollTo('kontak')}
              className="btn-primary text-sm cursor-pointer shadow-xs"
            >
              {t.nav.contact}
            </motion.button>
          </div>

          {/* Mobile menu button and language toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle variant="dropdown" />
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-nav-dropdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1.5 overflow-hidden shadow-md"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-[#EBF8FF] text-[#2B6CB0] font-semibold border-l-4 border-[#2B6CB0]'
                    : 'text-[#1A202C] hover:bg-[#F7FAFC] hover:text-[#2B6CB0]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 mt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href={personalInfo.socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1A202C] p-1.5 rounded hover:bg-[#F7FAFC] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={personalInfo.socials.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#718096] hover:text-[#1A202C] p-1.5 rounded hover:bg-[#F7FAFC] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>X.com</span>
                </a>
              </div>
              <button
                onClick={() => handleScrollTo('kontak')}
                className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
              >
                {t.nav.contact}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};



