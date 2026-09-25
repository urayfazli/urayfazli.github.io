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
        className="w-8 h-[17px] sm:w-9 sm:h-[19px] overflow-visible drop-shadow-[0_2px_6px_rgba(11,15,23,0.95)]"
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
    let targetProgress = 0;
    let currentProgress = 0;
    let velocity = 0;
    let targetDirection = 1; // +1 = scrolling down (right), -1 = scrolling up (left)
    let smoothDirection = 1;
    let smoothSpeed = 0;
    let lastScrollY = 0;
    let lastFrameTime = performance.now();
    let rafId = 0;

    const readRawScrollMetrics = (isScrollEvent = false) => {
      const currentScroll = Math.max(
        0,
        window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
      );

      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const maxScroll = Math.max(0, docHeight - winHeight);

      targetProgress = maxScroll > 2 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;

      const isNowScrolled = currentScroll > 20;
      if (isNowScrolled !== scrolledRef.current) {
        scrolledRef.current = isNowScrolled;
        setScrolled(isNowScrolled);
      }

      if (isScrollEvent) {
        const delta = currentScroll - lastScrollY;
        if (Math.abs(delta) > 0.8) {
          targetDirection = delta > 0 ? 1 : -1;
          lastScrollY = currentScroll;
        }
      } else {
        lastScrollY = currentScroll;
      }
    };

    const stepPhysics = (now: number) => {
      // Frame-rate independent delta time (clamped to avoid huge jumps on tab switch)
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;

      // Critically damped spring physics for silky-smooth position tracking
      const stiffness = 190;
      const damping = 26;
      const force = (targetProgress - currentProgress) * stiffness;
      velocity = (velocity + force * dt) * Math.exp(-damping * dt);
      currentProgress += velocity * dt;

      // Snap micro-epsilon when settled at boundaries
      if (Math.abs(targetProgress - currentProgress) < 0.00015 && Math.abs(velocity) < 0.0005) {
        currentProgress = targetProgress;
        velocity = 0;
      }

      const clampedProgress = Math.min(1, Math.max(0, currentProgress));

      // Normalized instantaneous speed (0..1) with smooth exponential decay
      const rawSpeed = Math.min(1, Math.abs(velocity) * 2.4 + Math.abs(targetProgress - currentProgress) * 6);
      const speedLerp = 1 - Math.exp(-14 * dt);
      smoothSpeed += (rawSpeed - smoothSpeed) * speedLerp;

      // Smoothly interpolate rocket facing direction (-1..+1) so turnaround banks fluidly
      const dirLerp = 1 - Math.exp(-16 * dt);
      smoothDirection += (targetDirection - smoothDirection) * dirLerp;
      const effectiveScaleX =
        Math.abs(smoothDirection) < 0.18
          ? smoothDirection < 0
            ? -0.18
            : 0.18
          : smoothDirection;

      // 1. Update Progress Fill Bar on GPU via scaleX
      if (fillBarRef.current) {
        fillBarRef.current.style.transform = `scaleX(${clampedProgress.toFixed(5)})`;
      }

      // 2. Update Rocket Carriage X Position on GPU via translate3d
      if (rocketCarriageRef.current) {
        const w = railWidth || window.innerWidth;
        const minX = 18;
        const maxX = Math.max(minX, w - 24);
        const rawX = clampedProgress * w;
        const clampedX = Math.min(Math.max(rawX, minX), maxX);
        rocketCarriageRef.current.style.transform = `translate3d(${clampedX.toFixed(2)}px, -50%, 0)`;
      }

      // 3. Update Rocket Body Hover Bob, Banking Pitch & Smooth Turnaround
      if (rocketBodyRef.current) {
        const idleBobY = Math.sin(now * 0.0042) * (0.9 + smoothSpeed * 0.7);
        const pitchDeg = -smoothSpeed * 4.5 * Math.sign(smoothDirection);
        const boostScale = 1 + smoothSpeed * 0.07;
        rocketBodyRef.current.style.transform = `translate3d(0px, ${idleBobY.toFixed(2)}px, 0) scale(${(
          effectiveScaleX * boostScale
        ).toFixed(3)}, ${boostScale.toFixed(3)}) rotate(${pitchDeg.toFixed(2)}deg)`;
      }

      // 4. Update Multi-Stage Thruster Plume & Afterburner Glow
      const flameOsc = Math.sin(now * 0.032) * 0.14 + Math.cos(now * 0.051) * 0.08;
      const outerScaleX = Math.max(0.45, 0.62 + smoothSpeed * 1.05 + flameOsc * (0.35 + smoothSpeed));
      const innerScaleX = Math.max(0.4, 0.54 + smoothSpeed * 0.92 + flameOsc * 0.4);
      const outerOpacity = Math.min(1, 0.72 + smoothSpeed * 0.28);

      if (outerFlameRef.current) {
        outerFlameRef.current.style.transform = `scaleX(${outerScaleX.toFixed(3)})`;
        outerFlameRef.current.style.opacity = outerOpacity.toFixed(2);
      }
      if (innerFlameRef.current) {
        innerFlameRef.current.style.transform = `scaleX(${innerScaleX.toFixed(3)})`;
      }
      if (afterburnerGlowRef.current) {
        const glowOpacity = 0.18 + smoothSpeed * 0.48 + Math.max(0, flameOsc * 0.2);
        afterburnerGlowRef.current.setAttribute('opacity', glowOpacity.toFixed(2));
        afterburnerGlowRef.current.setAttribute('r', (4.8 + smoothSpeed * 2.8).toFixed(2));
      }

      // 5. Smooth Continuous Exhaust Sparks
      const isAtEnd = clampedProgress >= 0.985;
      const sparkIntensity = isAtEnd ? 0.95 : Math.min(1, smoothSpeed * 1.5);
      if (spark1Ref.current) {
        const phase1 = ((now * 0.0038) % 1);
        const sx1 = 10 - phase1 * (12 + smoothSpeed * 8);
        const sy1 = 10.2 + Math.sin(phase1 * Math.PI * 2) * 1.4;
        const op1 = (1 - phase1) * sparkIntensity;
        spark1Ref.current.setAttribute('cx', sx1.toFixed(2));
        spark1Ref.current.setAttribute('cy', sy1.toFixed(2));
        spark1Ref.current.setAttribute('opacity', op1.toFixed(2));
      }
      if (spark2Ref.current) {
        const phase2 = (((now * 0.0038) + 0.5) % 1);
        const sx2 = 10 - phase2 * (11 + smoothSpeed * 7);
        const sy2 = 13.8 - Math.sin(phase2 * Math.PI * 2) * 1.4;
        const op2 = (1 - phase2) * sparkIntensity;
        spark2Ref.current.setAttribute('cx', sx2.toFixed(2));
        spark2Ref.current.setAttribute('cy', sy2.toFixed(2));
        spark2Ref.current.setAttribute('opacity', op2.toFixed(2));
      }

      if (portholeLedRef.current) {
        portholeLedRef.current.setAttribute('fill', isAtEnd ? '#34D399' : '#22C55E');
      }

      // 6. Update Telemetry Percentage Readout & ARIA without React re-renders
      const pct = Math.round(clampedProgress * 100);
      if (percentTextRef.current) {
        percentTextRef.current.textContent = `${pct}%`;
        const showPct = smoothSpeed > 0.03 || (clampedProgress > 0.015 && clampedProgress < 0.995);
        percentTextRef.current.style.opacity = showPct ? '0.92' : '0';
      }
      if (railRef.current) {
        railRef.current.setAttribute('aria-valuenow', String(pct));
      }

      rafId = window.requestAnimationFrame(stepPhysics);
    };

    const onScroll = () => readRawScrollMetrics(true);
    const onResize = () => {
      if (railRef.current) {
        railWidth = railRef.current.clientWidth;
      }
      readRawScrollMetrics(false);
    };

    readRawScrollMetrics(false);
    currentProgress = targetProgress;
    if (railRef.current) {
      railWidth = railRef.current.clientWidth;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (railRef.current) {
          railWidth = railRef.current.clientWidth;
        }
        readRawScrollMetrics(false);
      });
      resizeObserver.observe(document.documentElement);
      if (document.body) {
        resizeObserver.observe(document.body);
      }
      if (railRef.current) {
        resizeObserver.observe(railRef.current);
      }
    }

    rafId = window.requestAnimationFrame(stepPhysics);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

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
        scrolled
          ? 'py-2.5 backdrop-blur-xl bg-[#0f141d]/92 border-b border-[#9d613c]/30 shadow-xl shadow-black/50'
          : 'py-4 backdrop-blur-md bg-[#0f141d]/82 border-b border-white/5'
      }`}
    >
      {/* 120fps Spring-Physics Scroll Progress Rail + Interactive Anti-AI-Slop Validator Rocket */}
      <div
        ref={railRef}
        onClick={handleRailClick}
        title={
          lang === 'id'
            ? 'Klik jalur untuk meluncur ke posisi halaman'
            : 'Click track to launch to page position'
        }
        className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#090d14]/90 cursor-pointer z-50 overflow-visible"
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
