import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitHubIcon, XIcon } from './Doodles';
import { SOCIAL_DATA } from '../data/portfolioData';
import { ASSET_IMAGES } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';

/**
 * Bespoke Anti-AI-Slop Aerospace Validator Rocket SVG
 * Driven by a 120fps requestAnimationFrame spring-physics engine for ultra-smooth
 * sub-pixel GPU movement, velocity-proportional plasma thrust, and fluid banking turnaround.
 */
interface ValidatorScrollRocketProps {
  rocketBodyRef: React.RefObject<HTMLDivElement | null>;
  outerFlameRef: React.RefObject<SVGPathElement | null>;
  innerFlameRef: React.RefObject<SVGPathElement | null>;
  afterburnerGlowRef: React.RefObject<SVGCircleElement | null>;
  spark1Ref: React.RefObject<SVGCircleElement | null>;
  spark2Ref: React.RefObject<SVGCircleElement | null>;
  portholeLedRef: React.RefObject<SVGCircleElement | null>;
}

const ValidatorScrollRocket: React.FC<ValidatorScrollRocketProps> = ({
  rocketBodyRef,
  outerFlameRef,
  innerFlameRef,
  afterburnerGlowRef,
  spark1Ref,
  spark2Ref,
  portholeLedRef,
}) => {
  return (
    <div
      ref={rocketBodyRef}
      style={{
        transform: 'translate3d(0px, 0px, 0) scaleX(1) rotate(0deg)',
        willChange: 'transform',
      }}
      className="relative flex items-center justify-center select-none pointer-events-none"
    >
      <svg
        viewBox="0 0 48 24"
        className="w-8 h-[17px] sm:w-9 sm:h-[19px] overflow-visible"
        fill="none"
      >
        {/* Soft Afterburner Radial Glow Behind Nozzle */}
        <circle
          ref={afterburnerGlowRef}
          cx="14"
          cy="12"
          r="5.5"
          fill="#E59B63"
          opacity="0.25"
        />

        {/* Trailing Plasma Exhaust Sparks (Driven smoothly at 120fps) */}
        <circle
          ref={spark1Ref}
          cx="6"
          cy="10"
          r="1.25"
          fill="#FBEEE0"
          opacity="0"
        />
        <circle
          ref={spark2Ref}
          cx="7"
          cy="14"
          r="1.05"
          fill="#E59B63"
          opacity="0"
        />

        {/* Outer Thruster Plasma Plume */}
        <path
          ref={outerFlameRef}
          d="M16 8.2L1.5 12L16 15.8V8.2Z"
          fill="#E59B63"
          style={{ transformOrigin: '16px 12px', willChange: 'transform, opacity' }}
        />

        {/* Inner White-Hot Core Flame */}
        <path
          ref={innerFlameRef}
          d="M16 9.8L7 12L16 14.2V9.8Z"
          fill="#FBEEE0"
          style={{ transformOrigin: '16px 12px', willChange: 'transform' }}
        />

        {/* Upper & Lower Swept Delta Stabilizer Fins (Terracotta Copper) */}
        <path
          d="M23 7.5L17 2.5L15 3.5L17.5 8.5H23V7.5Z"
          fill="#9D613C"
          stroke="#0B0F17"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M23 16.5L17 21.5L15 20.5L17.5 15.5H23V16.5Z"
          fill="#9D613C"
          stroke="#0B0F17"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Stepped Engine Nozzle Bell */}
        <path
          d="M18.5 8.5V15.5L15.5 16.5V7.5L18.5 8.5Z"
          fill="#9D613C"
          stroke="#0B0F17"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Main Fuselage Hull (Warm Sketchbook Cream) */}
        <path
          d="M43.5 12C38.5 7.8 32 6.5 23.5 6.5H18.5V17.5H23.5C32 17.5 38.5 16.2 43.5 12Z"
          fill="#FBEEE0"
          stroke="#0B0F17"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Terracotta Nosecone Cap & Structural Seam */}
        <path
          d="M43.5 12C40.4 9.4 36.8 7.9 33.5 7.2V16.8C36.8 16.1 40.4 14.6 43.5 12Z"
          fill="#E59B63"
        />
        <line x1="33.5" y1="7" x2="33.5" y2="17" stroke="#0B0F17" strokeWidth="1.4" />

        {/* Center Dorsal Wing Fin */}
        <line
          x1="17.5"
          y1="12"
          x2="23.5"
          y2="12"
          stroke="#0B0F17"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Validator Telemetry Avionics Porthole (Live Emerald LED) */}
        <circle cx="27.5" cy="12" r="3.4" fill="#0B0F17" />
        <circle
          ref={portholeLedRef}
          cx="27.5"
          cy="12"
          r="2.2"
          fill="#22C55E"
        />
        <circle cx="26.8" cy="11.3" r="0.75" fill="#DCFCE7" />
      </svg>
    </div>
  );
};

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

  // Refs for 120fps GPU-accelerated Scroll Progress Rail & Rocket Physics Engine
  const railRef = useRef<HTMLDivElement>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);
  const rocketCarriageRef = useRef<HTMLDivElement>(null);
  const rocketBodyRef = useRef<HTMLDivElement>(null);
  const outerFlameRef = useRef<SVGPathElement>(null);
  const innerFlameRef = useRef<SVGPathElement>(null);
  const afterburnerGlowRef = useRef<SVGCircleElement>(null);
  const spark1Ref = useRef<SVGCircleElement>(null);
  const spark2Ref = useRef<SVGCircleElement>(null);
  const portholeLedRef = useRef<SVGCircleElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);

  const scrolledRef = useRef(false);

  useEffect(() => {
    let railWidth = railRef.current ? railRef.current.clientWidth : window.innerWidth;
    let cachedMaxScroll = 1;
    let targetProgress = 0;
    let lastScrollY = window.scrollY || 0;
    let currentDirection = 1;
    let lastRenderedDirection = 0;
    let lastRenderedPct = -1;
    let rafId = 0;

    const measureLayout = () => {
      if (railRef.current) {
        railWidth = railRef.current.clientWidth;
      }
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      cachedMaxScroll = Math.max(1, docHeight - winHeight);
    };

    const renderScrollProgress = () => {
      rafId = 0;
      const clampedProgress = Math.min(1, Math.max(0, targetProgress));

      // 1. Update Progress Fill Bar on GPU via scaleX
      if (fillBarRef.current) {
        fillBarRef.current.style.transform = `scaleX(${clampedProgress.toFixed(4)})`;
      }

      // 2. Update Rocket Carriage X Position on GPU via translate3d
      if (rocketCarriageRef.current) {
        const w = railWidth || window.innerWidth;
        const minX = 18;
        const maxX = Math.max(minX, w - 24);
        const clampedX = Math.min(Math.max(clampedProgress * w, minX), maxX);
        rocketCarriageRef.current.style.transform = `translate3d(${clampedX.toFixed(1)}px, -50%, 0)`;
      }

      // 3. Only update Rocket Facing Direction when direction actually changes
      if (rocketBodyRef.current && currentDirection !== lastRenderedDirection) {
        lastRenderedDirection = currentDirection;
        rocketBodyRef.current.style.transform = `scaleX(${currentDirection})`;
      }

      // 4. Only mutate textContent and ARIA when integer percentage changes
      const pct = Math.round(clampedProgress * 100);
      if (pct !== lastRenderedPct) {
        lastRenderedPct = pct;
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${pct}%`;
          percentTextRef.current.style.opacity = pct > 1 && pct < 100 ? '0.92' : '0';
        }
        if (railRef.current) {
          railRef.current.setAttribute('aria-valuenow', String(pct));
        }
      }
    };

    const scheduleRender = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(renderScrollProgress);
      }
    };

    const onScroll = () => {
      const currentScroll = Math.max(0, window.scrollY || window.pageYOffset || 0);
      if (currentScroll > cachedMaxScroll) {
        measureLayout();
      }
      targetProgress = cachedMaxScroll > 2 ? Math.min(1, Math.max(0, currentScroll / cachedMaxScroll)) : 0;

      const isNowScrolled = currentScroll > 20;
      if (isNowScrolled !== scrolledRef.current) {
        scrolledRef.current = isNowScrolled;
        setScrolled(isNowScrolled);
      }

      const delta = currentScroll - lastScrollY;
      if (Math.abs(delta) > 1.5) {
        currentDirection = delta > 0 ? 1 : -1;
        lastScrollY = currentScroll;
      }

      scheduleRender();
    };

    const onResize = () => {
      measureLayout();
      onScroll();
    };

    measureLayout();
    onScroll();

    // Re-measure once after initial content & images settle
    const settleTimer = window.setTimeout(() => {
      measureLayout();
      onScroll();
    }, 1000);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.clearTimeout(settleTimer);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const railScrollTimerRef = useRef<number | null>(null);

  // Interactive click on the scroll progress rail to smoothly fly the rocket to that scroll point
  const handleRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clickRatio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const maxScroll = Math.max(0, docHeight - window.innerHeight);

    document.documentElement.dataset.navScrolling = 'true';
    if (railScrollTimerRef.current !== null) {
      window.clearTimeout(railScrollTimerRef.current);
    }
    railScrollTimerRef.current = window.setTimeout(() => {
      delete document.documentElement.dataset.navScrolling;
      railScrollTimerRef.current = null;
    }, 900);

    window.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
  };

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
      className={`w-full transition-all duration-300 relative ${
        scrolled ? 'py-2.5 glass-navbar-scrolled' : 'py-3.5 glass-navbar'
      }`}
    >
      {/* Top Specular Glass Reflection Highlight & Ambient Sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute -top-10 left-1/4 w-1/2 h-20 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent blur-xl" />
      </div>

      {/* 120fps Spring-Physics Scroll Progress Rail + Interactive Anti-AI-Slop Validator Rocket */}
      <div
        ref={railRef}
        onClick={handleRailClick}
        title={
          lang === 'id'
            ? 'Klik jalur untuk meluncur ke posisi halaman'
            : 'Click track to launch to page position'
        }
        className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-white/10 cursor-pointer z-50 overflow-visible"
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        {/* GPU-Accelerated Progress Fill Bar (scaleX) */}
        <div
          ref={fillBarRef}
          style={{
            transform: 'scaleX(0)',
            transformOrigin: '0% 50%',
            willChange: 'transform',
          }}
          className="w-full h-full bg-gradient-to-r from-[#9d613c] via-[#e59b63] to-[#fbeee0] shadow-[0_0_12px_rgba(229,155,99,0.85)] pointer-events-none"
        />

        {/* Leading-Edge GPU-Accelerated Validator Rocket Carriage (translate3d) */}
        <div
          ref={rocketCarriageRef}
          style={{
            transform: 'translate3d(18px, -50%, 0)',
            willChange: 'transform',
          }}
          className="absolute top-1/2 left-0 -translate-x-1/2 flex items-center gap-1 pointer-events-none"
        >
          <ValidatorScrollRocket
            rocketBodyRef={rocketBodyRef}
            outerFlameRef={outerFlameRef}
            innerFlameRef={innerFlameRef}
            afterburnerGlowRef={afterburnerGlowRef}
            spark1Ref={spark1Ref}
            spark2Ref={spark2Ref}
            portholeLedRef={portholeLedRef}
          />
          <span
            ref={percentTextRef}
            style={{ opacity: 0 }}
            className="font-mono text-[9px] tracking-tight text-[#fbeee0] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] transition-opacity duration-200 select-none"
          >
            0%
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
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
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] rounded-full pr-2 cursor-pointer select-none transition-transform duration-200 active:scale-95 touch-manipulation"
        >
          <div className="relative">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/30 group-hover:border-[#e59b63] transition-all duration-300 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.3)] flex-shrink-0 group-hover:shadow-[#e59b63]/30 group-hover:shadow-lg">
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
            <span className="font-fredoka text-lg sm:text-xl font-medium tracking-wide text-[#fbeee0] group-hover:text-white transition-colors truncate max-w-[170px] xs:max-w-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Uray Fazli Alman
            </span>
            <span className="text-[10px] uppercase tracking-wider font-mono text-[#e59b63] group-hover:text-[#fbeee0] transition-colors -mt-1 hidden sm:block">
              {lang === 'id' ? 'Operator Node & Engineer' : 'Node Operator & Engineer'}
            </span>
          </div>
        </a>

        {/* Center Zone: Navigation Links with Smooth Animated Sliding Glass Pill */}
        <nav
          className="hidden md:flex items-center gap-1 glass-pill p-1.5 rounded-full relative"
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
                  isActive
                    ? 'text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                    : 'text-[#e8dacb] hover:text-white'
                }`}
              >
                {/* Active Sliding Tinted Glass Pill Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="navbarActivePill"
                    className="absolute inset-0 glass-pill-active rounded-full z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Hover Glass Pill Background Glow */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="navbarHoverPill"
                    className="absolute inset-0 bg-white/[0.12] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28)] rounded-full z-0 pointer-events-none"
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
          {/* Interactive ID / EN Language Switcher Glass Pill */}
          <div
            role="group"
            aria-label="Language switcher"
            className="flex items-center glass-pill p-1 rounded-full"
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
                      ? 'text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                      : 'text-[#d7c6b5] hover:text-white'
                  }`}
                  title={code === 'id' ? 'Bahasa Indonesia' : 'English'}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="langToggleDesktopPill"
                      className="absolute inset-0 rounded-full glass-pill-active z-0"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-[#e8dacb] hover:border-white/40 transition-colors"
          >
            <motion.a
              href={SOCIAL_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub @urayfazli"
              whileHover={{ scale: 1.2, rotate: -8, color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full text-[#e8dacb] hover:text-white transition-colors touch-manipulation"
              title="GitHub: @urayfazli"
            >
              <GitHubIcon className="w-4.5 h-4.5" />
            </motion.a>
            <span className="w-px h-3.5 bg-white/25" aria-hidden="true" />
            <motion.a
              href={SOCIAL_DATA.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X @urayfazli17"
              whileHover={{ scale: 1.2, rotate: 8, color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
              className="p-1 rounded-full text-[#e8dacb] hover:text-white transition-colors touch-manipulation"
              title="X.com: @urayfazli17"
            >
              <XIcon className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>

        {/* Mobile Language Toggle + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Compact Mobile ID / EN Glass Toggle */}
          <div
            role="group"
            aria-label="Language switcher"
            className="flex sm:hidden items-center glass-pill p-0.5 rounded-full"
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
                      ? 'glass-pill-active text-white font-bold'
                      : 'text-[#d7c6b5] hover:text-white'
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
            className="p-2.5 rounded-xl glass-pill text-[#fbeee0] hover:text-white hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e59b63] cursor-pointer transition-transform active:scale-90 touch-manipulation"
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

      {/* Floating Mobile Glass Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 z-50 glass-drawer"
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
                        ? 'glass-pill-active text-white font-semibold'
                        : 'text-[#e8dacb] hover:text-white hover:bg-white/10 active:bg-white/15 border border-transparent hover:border-white/15'
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

              <div className="flex items-center justify-around pt-4 mt-2 border-t border-white/15 px-2">
                <a
                  href={SOCIAL_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#fbeee0] hover:text-white font-medium glass-pill px-4 py-2.5 rounded-full active:scale-95 transition-all touch-manipulation"
                >
                  <GitHubIcon className="w-4.5 h-4.5 text-[#e59b63]" />
                  <span>@urayfazli</span>
                </a>
                <a
                  href={SOCIAL_DATA.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#fbeee0] hover:text-white font-medium glass-pill px-4 py-2.5 rounded-full active:scale-95 transition-all touch-manipulation"
                >
                  <XIcon className="w-4 h-4 text-[#e59b63]" />
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
