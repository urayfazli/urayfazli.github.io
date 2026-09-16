import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Github, Twitter, Menu, X, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { id: 'tentang', label: t.nav.about },
    { id: 'pengalaman', label: t.nav.nodeExperience },
    { id: 'monitor', label: t.nav.liveTelemetry },
    { id: 'keahlian', label: t.nav.skills },
    { id: 'kontak', label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 64;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = Math.max(0, elementPosition - navbarHeight - 8);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  return (
    <motion.header 
      id="main-navbar"
      initial={{ y: -24, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FFFFFF]/95 border-b border-[#CBD5E0] shadow-sm py-0' 
          : 'bg-[#FFFFFF]/90 border-b border-[#E2E8F0] shadow-xs py-0.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo with Interactive Hover Animation & Identity Tags */}
          <div className="flex items-center gap-3">
            <motion.div 
              id="tag-logo-container"
              whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="relative group w-10 h-10 rounded-lg bg-[#2B6CB0] flex items-center justify-center text-white shadow-xs cursor-pointer overflow-hidden shrink-0"
              onClick={() => handleScrollTo('tentang')}
              title="Logo Uray Fazli Alman - Node Operator"
              aria-label="Logo Uray Fazli Alman"
            >
              {/* Subtle background ambient pulse on logo hover */}
              <motion.div 
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
              <Server className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <a 
                  id="tag-web-name"
                  href="#tentang" 
                  onClick={(e) => { e.preventDefault(); handleScrollTo('tentang'); }}
                  className="text-base sm:text-lg font-bold font-heading text-[#1A202C] hover:text-[#2B6CB0] transition-colors inline-block tracking-tight"
                  title={personalInfo.name}
                >
                  {personalInfo.name}
                </a>

                {/* Web Name Tag / Identity Badges */}
                <span 
                  id="tag-web-badge" 
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]"
                >
                  NODE.OPS
                </span>
                <span 
                  id="tag-infra-badge" 
                  className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F0FFF4] text-[#38A169] border border-[#C6F6D5]"
                >
                  WEB3
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#718096]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38A169] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38A169]"></span>
                </span>
                <span className="truncate">{t.nav.roleBadge}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links with Floating Pill & Spring Underline Indicator */}
          <nav 
            className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-lg bg-[#F7FAFC]/80 border border-[#E2E8F0]/60"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const isHovered = hoveredNav === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  onMouseEnter={() => setHoveredNav(link.id)}
                  className={`relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-[#2B6CB0] font-semibold' 
                      : 'text-[#4A5568] hover:text-[#1A202C]'
                  }`}
                >
                  {/* Floating Hover Background Pill */}
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="navHoverPill"
                      className="absolute inset-0 bg-[#FFFFFF] rounded-md shadow-xs -z-10 border border-[#E2E8F0]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                    />
                  )}

                  {/* Active Indicator with crisp spring physics */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#FFFFFF] rounded-md shadow-xs -z-10 border border-[#BEE3F8]"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    >
                      <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#2B6CB0] rounded-full" />
                    </motion.span>
                  )}

                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Language Toggle + Social Icons + Contact CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector */}
            <LanguageToggle />

            <div className="h-4 w-px bg-[#E2E8F0] mx-0.5"></div>

            <motion.a
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
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
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
              href={personalInfo.socials.x.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) Profile"
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors cursor-pointer"
              title={`X: ${personalInfo.socials.x.username}`}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>

            {/* Contact CTA with Shimmer & Scale */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleScrollTo('kontak')}
              className="relative group overflow-hidden btn-primary text-sm cursor-pointer shadow-xs"
            >
              {/* Shimmer light beam on hover */}
              <motion.span 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{t.nav.contact}</span>
              </span>
            </motion.button>
          </div>

          {/* Mobile menu button and language toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle variant="dropdown" />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMobileMenuOpen ? 'open' : 'closed'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown with staggered slide-in items */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-nav-dropdown"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1.5 overflow-hidden shadow-md"
          >
            {navLinks.map((link, idx) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => handleScrollTo(link.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-[#EBF8FF] text-[#2B6CB0] font-semibold border-l-4 border-[#2B6CB0] translate-x-1'
                    : 'text-[#1A202C] hover:bg-[#F7FAFC] hover:text-[#2B6CB0]'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: navLinks.length * 0.04 }}
              className="pt-3 mt-2 border-t border-[#E2E8F0] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};



