import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { ASSET_IMAGES } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenContact }) => {
  const { lang, setLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Real-time scroll progress for slim navbar indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Monitor scroll state for dynamic floating navbar animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape key handler for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: lang === 'id' ? 'Beranda' : 'Home' },
    { id: 'about', label: lang === 'id' ? 'Tentang' : 'About' },
    { id: 'experience', label: lang === 'id' ? 'Pengalaman' : 'Experience' },
    { id: 'contact', label: lang === 'id' ? 'Kontak' : 'Contact', isContact: true },
  ];

  const handleItemClick = (e: React.MouseEvent, item: (typeof navItems)[0]) => {
    e.preventDefault();
    if (item.isContact) {
      onOpenContact();
    } else {
      onNavigate(item.id);
    }
  };

  const handleMobileClick = (item: (typeof navItems)[0]) => {
    setMobileMenuOpen(false);
    if (item.isContact) {
      onOpenContact();
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 relative ${
        scrolled
          ? 'py-2.5 backdrop-blur-xl bg-[#0f141d]/90 border-b border-[#9d613c]/30 shadow-xl shadow-black/50'
          : 'py-4 backdrop-blur-md bg-[#0f141d]/80 border-b border-white/5'
      }`}
    >
      {/* Slim, elegant scroll progress indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/5 overflow-hidden pointer-events-none z-50"
        role="progressbar"
        aria-label="Page scroll progress"
      >
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="h-full bg-gradient-to-r from-[#9d613c] via-[#e59b63] to-[#fbeee0] shadow-[0_0_10px_rgba(229,155,99,0.7)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Zone: Mini Chibi Avatar + Name with Micro-Animations */}
        <a
          href="#home"
          title="Uray Fazli Alman - Blockchain Node Operator Portfolio"
          aria-label="Uray Fazli Alman Homepage & Brand Logo"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] rounded-full pr-2 cursor-pointer select-none transition-transform duration-200 active:scale-95 touch-manipulation"
        >
          <div className="relative">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#9d613c]/70 group-hover:border-[#9d613c] transition-all duration-300 bg-[#17212e] shadow-md flex-shrink-0 group-hover:shadow-[#9d613c]/30 group-hover:shadow-lg">
              <motion.img
                src={ASSET_IMAGES.avatar}
                alt="Uray Fazli Alman Avatar"
                className="w-full h-full object-cover object-top scale-110"
                whileHover={{ scale: 1.2, rotate: 2 }}
                transition={{ duration: 0.3 }}
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Live Node Operator Status Indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5" title="Node Operator Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0f141d]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-fredoka text-lg sm:text-xl font-medium tracking-wide text-[#fbeee0] group-hover:text-white transition-colors truncate max-w-[170px] xs:max-w-none">
              Uray Fazli Alman
            </span>
            <span className="text-[10px] uppercase tracking-wider font-mono text-[#9d613c] group-hover:text-[#c48255] transition-colors -mt-1 hidden sm:block">
              {lang === 'id' ? 'Operator Node & Engineer' : 'Node Operator & Engineer'}
            </span>
          </div>
        </a>

        {/* Center Zone: Navigation Links with Smooth Animated Sliding Active Pill */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#141b25]/90 border border-white/10 p-1.5 rounded-full shadow-inner backdrop-blur-md relative"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredTab === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleItemClick(e, item)}
                onMouseEnter={() => setHoveredTab(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer select-none focus:outline-none ${
                  isActive ? 'text-white font-semibold' : 'text-[#d7c6b5] hover:text-[#fbeee0]'
                }`}
              >
                {/* Active Sliding Pill Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="navbarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-[#9d613c] to-[#b97746] rounded-full shadow-md shadow-[#9d613c]/30 z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Hover Pill Background Glow */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="navbarHoverPill"
                    className="absolute inset-0 bg-white/10 rounded-full z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}

                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Zone: Language Toggle (ID / EN) & Social Links */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Interactive ID / EN Language Switcher Pill */}
          <div
            role="group"
            aria-label="Language switcher"
            className="flex items-center bg-[#141b25]/90 border border-white/10 p-1 rounded-full shadow-sm backdrop-blur-md"
          >
            {(['id', 'en'] as const).map((code) => {
              const isSelected = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`relative px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors select-none ${
                    isSelected
                      ? 'text-white font-bold'
                      : 'text-[#a39483] hover:text-[#fbeee0]'
                  }`}
                  title={code === 'id' ? 'Bahasa Indonesia' : 'English'}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="langToggleDesktopPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9d613c] to-[#b97746] shadow-xs z-0"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{code.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#141b25]/90 text-[#d7c6b5] shadow-sm backdrop-blur-md hover:border-[#9d613c]/40 transition-colors"
          >
            <motion.a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub @urayfazli"
              whileHover={{ scale: 1.2, rotate: -8, color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full text-[#d7c6b5] hover:text-white transition-colors touch-manipulation"
              title="GitHub: @urayfazli"
            >
              <GitHubIcon className="w-4.5 h-4.5" />
            </motion.a>
            <span className="w-px h-3.5 bg-white/15" aria-hidden="true" />
            <motion.a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X @urayfazli17"
              whileHover={{ scale: 1.2, rotate: 8, color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full text-[#d7c6b5] hover:text-white transition-colors touch-manipulation"
              title="X.com: @urayfazli17"
            >
              <XIcon className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>

        {/* Mobile Language Toggle + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Compact Mobile ID / EN Toggle */}
          <div
            role="group"
            aria-label="Language switcher"
            className="flex sm:hidden items-center bg-[#141b25]/90 border border-white/10 p-0.5 rounded-full"
          >
            {(['id', 'en'] as const).map((code) => {
              const isSelected = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`relative px-2 py-1 rounded-full text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#9d613c] text-white font-bold'
                      : 'text-[#a39483] hover:text-[#fbeee0]'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#141b25] border border-white/10 text-[#fbeee0] hover:text-white hover:border-[#9d613c]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d613c] shadow-sm cursor-pointer transition-transform active:scale-90 touch-manipulation"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#0c121c]/98 backdrop-blur-3xl border-b border-[#9d613c]/30 shadow-2xl shadow-black/80"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 max-w-7xl mx-auto">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleMobileClick(item)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9d613c] to-[#b97746] text-white font-semibold shadow-md shadow-[#9d613c]/30'
                        : 'text-[#d7c6b5] hover:text-white hover:bg-white/5 active:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </div>
                  </button>
                );
              })}

              <div className="flex items-center justify-around pt-4 mt-2 border-t border-white/10 px-2">
                <a
                  href={SOCIAL_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#fbeee0] hover:text-[#9d613c] font-medium bg-[#141b25] px-4 py-2.5 rounded-full border border-white/5 active:scale-95 transition-all touch-manipulation"
                >
                  <GitHubIcon className="w-4.5 h-4.5 text-[#9d613c]" />
                  <span>@urayfazli</span>
                </a>
                <a
                  href={SOCIAL_DATA.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#fbeee0] hover:text-[#9d613c] font-medium bg-[#141b25] px-4 py-2.5 rounded-full border border-white/5 active:scale-95 transition-all touch-manipulation"
                >
                  <XIcon className="w-4 h-4 text-[#9d613c]" />
                  <span>@urayfazli17</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
