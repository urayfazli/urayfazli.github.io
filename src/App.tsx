/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  GlobalSvgFilters,
  CrownDoodle,
  PlanetDoodle,
  SparkleStar,
  HandArrowRight,
  ChibiMiniAvatar,
  HeroChibiCharacter,
  AboutMeOverlapChibi,
  NodeOperatorChibiScene,
  BackpackWalkerChibi,
  PeekingBottomChibi,
  StatShieldBadge,
  StatNodeBadge,
  StatCubeBadge,
  StatRocketBadge,
  AptosNetworkIcon,
  SeiNetworkIcon,
  SubQueryNetworkIcon,
  AirdropParachuteIllustration,
  GoldBitcoinDoodle,
  EthereumCoinDoodle,
  SolanaCoinDoodle,
  MemeDogeCoinMiniDoodle,
  MiniAirdropParachuteDoodle,
  MemeCoinDogeIllustration,
  TestnetCubesIllustration,
  RocketSketchDoodle,
  HandXIcon,
  HandGithubIcon,
  HandEmailIcon,
  SketchDividerLine,
} from './components/SketchIllustrations';
import {
  JOURNAL_ENTRIES_BY_LANG,
  Language,
  JournalDetailModal,
  ConnectJournalModal,
} from './components/JournalModals';
import { SketchbookLoadingScreen } from './components/SketchbookLoadingScreen';

type NavSection = 'home' | 'about' | 'experience' | 'activities' | 'contact';

const NAV_ITEMS: { id: NavSection; label: Record<Language, string> }[] = [
  { id: 'home', label: { id: 'Beranda', en: 'Home' } },
  { id: 'about', label: { id: 'Tentang', en: 'About' } },
  { id: 'experience', label: { id: 'Pengalaman', en: 'Experience' } },
  { id: 'activities', label: { id: 'Aktivitas', en: 'Activities' } },
  { id: 'contact', label: { id: 'Kontak', en: 'Contact' } },
];

/** Isolated Header Scroll Progress Bar so scrolling never re-renders the main App tree */
const HeaderScrollProgressBar: React.FC<{
  smoothScrollProgress: MotionValue<number>;
  progressWidthPercent: MotionValue<string>;
}> = React.memo(({ smoothScrollProgress, progressWidthPercent }) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useMotionValueEvent(smoothScrollProgress, 'change', (latest) => {
    const nextPct = Math.min(100, Math.max(0, Math.round(latest * 100)));
    setScrollPercent((prev) => (prev === nextPct ? prev : nextPct));
  });

  return (
    <div className="relative h-[5px] w-full bg-[#0C1D36] sm:h-[6px]">
      <motion.div
        style={{ width: progressWidthPercent }}
        className="relative h-full rounded-r-full bg-gradient-to-r from-[#D9A44E] via-[#F5D78E] to-[#FFF5D1] shadow-[0_0_12px_rgba(245,215,142,0.9)] will-change-[width]"
      >
        {scrollPercent > 0 && (
          <span
            className="-right-1.5 top-1/2 absolute h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border border-[#091526] bg-[#FFF8DE] shadow-[0_0_10px_#F5D78E]"
            aria-hidden="true"
          />
        )}
      </motion.div>

      <AnimatePresence>
        {scrollPercent > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none top-2 right-3 sm:right-8 absolute z-50 flex items-center gap-1 rounded-full border border-[#F5D78E]/70 bg-[#081528]/95 px-2 py-0.5 font-journal text-[10px] font-bold text-[#F5D78E] tabular-nums shadow-lg"
            aria-hidden="true"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5D78E]" />
            <span>{scrollPercent}%</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('id');
  const [isSwitchingLang, setIsSwitchingLang] = useState(false);
  const [activeNav, setActiveNav] = useState<NavSection>('home');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimeoutRef = useRef<number | null>(null);
  const langSwitchTimeoutRef = useRef<number | null>(null);
  const scrollAnimFrameRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const isId = lang === 'id';
  const currentEntries = JOURNAL_ENTRIES_BY_LANG[lang];
  const selectedEntry = selectedEntryId ? currentEntries[selectedEntryId] ?? null : null;

  // Centralized, race-condition-free body scroll lock across Loading Screen & Modals
  useEffect(() => {
    const isLocked = isLoading || Boolean(selectedEntryId) || isConnectOpen;
    document.body.style.overflow = isLocked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading, selectedEntryId, isConnectOpen]);

  // Smooth spring-linked scroll progress & subtle background star parallax
  const rawScrollProgress = useMotionValue(0);
  const smoothScrollProgress = useSpring(rawScrollProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const starParallaxY = useTransform(smoothScrollProgress, [0, 1], [0, -75]);
  const progressWidthPercent = useTransform(
    smoothScrollProgress,
    (v) => `${Math.min(100, Math.max(0, v * 100))}%`,
  );

  const cancelProgrammaticScroll = useCallback(() => {
    if (scrollAnimFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimFrameRef.current);
      scrollAnimFrameRef.current = null;
    }
  }, []);

  const animateScrollTo = useCallback(
    (targetY: number, duration = 740) => {
      cancelProgrammaticScroll();
      const startY = window.scrollY || document.documentElement.scrollTop || 0;
      const diff = targetY - startY;
      if (Math.abs(diff) < 4) return;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo({
          top: startY + diff * eased,
          behavior: 'instant' as ScrollBehavior,
        });
        if (progress < 1) {
          scrollAnimFrameRef.current = requestAnimationFrame(step);
        } else {
          scrollAnimFrameRef.current = null;
        }
      };

      scrollAnimFrameRef.current = requestAnimationFrame(step);
    },
    [cancelProgrammaticScroll],
  );

  const triggerToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
      toastTimeoutRef.current = null;
    }, 2800);
  }, []);

  const handleCopyText = useCallback(
    (label: string, value: string) => {
      const fallbackCopy = () => {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = value;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch {
          // Ignore fallback errors
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      triggerToast(isId ? `${label} disalin: ${value}` : `${label} copied: ${value}`);
    },
    [isId, triggerToast],
  );

  const toggleLanguage = useCallback(() => {
    if (langSwitchTimeoutRef.current !== null) {
      window.clearTimeout(langSwitchTimeoutRef.current);
    }
    setIsSwitchingLang(true);
    setLang((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      triggerToast(
        next === 'id' ? 'Bahasa diubah ke Indonesia (ID)' : 'Language switched to English (EN)',
      );
      return next;
    });
    langSwitchTimeoutRef.current = window.setTimeout(() => {
      setIsSwitchingLang(false);
      langSwitchTimeoutRef.current = null;
    }, 240);
  }, [triggerToast]);

  const scrollToSection = useCallback(
    (sectionId: NavSection) => {
      setActiveNav(sectionId);
      if (sectionId === 'home') {
        animateScrollTo(0, 740);
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 74;
        const headerOffset = headerHeight + 8;
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        const maxScroll = Math.max(0, docHeight - window.innerHeight);
        const rawTargetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        const targetY = Math.min(maxScroll, Math.max(0, rawTargetY));
        animateScrollTo(targetY, 740);
      }
    },
    [animateScrollTo],
  );

  const scrollToTop = useCallback(() => {
    setActiveNav('home');
    animateScrollTo(0, 780);
  }, [animateScrollTo]);

  const handleLoadingFinish = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Cleanup any active timers or animation frames on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
      if (langSwitchTimeoutRef.current !== null) window.clearTimeout(langSwitchTimeoutRef.current);
      if (scrollAnimFrameRef.current !== null) cancelAnimationFrame(scrollAnimFrameRef.current);
    };
  }, []);

  // RequestAnimationFrame-throttled scroll-spy & spring scroll progress updater
  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollMetrics = () => {
      rafId = null;
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

      rawScrollProgress.set(progress);

      // Avoid overwriting activeNav while a user-initiated nav click scroll is in flight
      if (scrollAnimFrameRef.current !== null) return;

      let matchedNav: NavSection = 'home';
      if (scrollTop <= 18) {
        matchedNav = 'home';
      } else if (maxScroll > 10 && scrollTop >= maxScroll - 18) {
        matchedNav = 'contact';
      } else {
        const triggerY = 120 + progress * (winHeight * 0.66);
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          const section = document.getElementById(NAV_ITEMS[i].id);
          if (section && section.getBoundingClientRect().top <= triggerY) {
            matchedNav = NAV_ITEMS[i].id;
            break;
          }
        }
      }
      setActiveNav((prev) => (prev === matchedNav ? prev : matchedNav));
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrollMetrics);
      }
    };

    updateScrollMetrics();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    document.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('wheel', cancelProgrammaticScroll, { passive: true });
    window.addEventListener('touchstart', cancelProgrammaticScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      document.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('wheel', cancelProgrammaticScroll);
      window.removeEventListener('touchstart', cancelProgrammaticScroll);
    };
  }, [rawScrollProgress, isLoading, cancelProgrammaticScroll]);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#07111F] text-[#F5EFE6] selection:bg-[#F5D78E] selection:text-[#07111F]">
      <GlobalSvgFilters />

      {/* Continuous Night Sky & Hand-Painted Cloud Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_16%,#122849_0%,#091525_50%,#07111F_100%)]" />
        {/* Subtle Night Sky Stars & Plus-Sparkles with Smooth Scroll Parallax */}
        <motion.svg
          style={{ y: starParallaxY }}
          viewBox="0 0 1440 960"
          fill="none"
          className="h-full w-full opacity-60"
        >
          <circle cx="88" cy="112" r="1.3" fill="#F3EBDD" />
          <circle cx="290" cy="64" r="1.2" fill="#9BB8DF" />
          <circle cx="520" cy="82" r="1.5" fill="#F3EBDD" />
          <circle cx="640" cy="180" r="1.2" fill="#9BB8DF" />
          <circle cx="1160" cy="78" r="1.5" fill="#F3EBDD" />
          <circle cx="1360" cy="195" r="1.3" fill="#9BB8DF" />
          <circle cx="110" cy="520" r="1.2" fill="#F3EBDD" />
          <circle cx="960" cy="440" r="1.4" fill="#9BB8DF" />
          <circle cx="1310" cy="620" r="1.4" fill="#F3EBDD" />
          <path d="M625 96V104M621 100H629" stroke="#6E8EB8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M1045 270V278M1041 274H1049" stroke="#6E8EB8" strokeWidth="1.2" strokeLinecap="round" />
        </motion.svg>
      </div>

      {/* Sketchbook Loading Screen Overlay */}
      <AnimatePresence>
        {isLoading && <SketchbookLoadingScreen lang={lang} onFinish={handleLoadingFinish} />}
      </AnimatePresence>

      {/* Hand-drawn Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            role="status"
            aria-live="polite"
            className="parchment-box fixed right-4 bottom-4 z-50 flex items-center gap-2.5 rounded-2xl border-2 border-[#091526] px-4 py-2.5 text-[#091526] shadow-2xl sm:right-6 sm:bottom-6"
          >
            <CrownDoodle className="h-4 w-5 shrink-0" color="#091526" />
            <span className="font-journal text-xs font-bold sm:text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. STICKY HEADER (3-Zone Top Bar + Mobile Sketchbook Nav Strip)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header ref={headerRef} className="sticky top-0 z-40 w-full bg-[#07111F]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3.5 py-2 sm:px-8 sm:py-2.5">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="group flex min-w-0 items-center focus:outline-none"
          >
            <span className="truncate font-brush text-[19px] tracking-wider text-[#FAF6EE] sm:text-[25px]">
              Web3 Portfolio
            </span>
          </a>

          {/* Zone 2: Desktop Handwritten Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-7 md:flex lg:gap-10"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative whitespace-nowrap py-1 font-journal text-[14px] transition-colors lg:text-[15px] ${
                    isActive
                      ? 'font-bold text-[#FAF6EE]'
                      : 'font-medium text-[#CBD8EA] hover:text-[#FAF6EE]'
                  }`}
                >
                  {item.label[lang]}
                  {isActive && (
                    <motion.svg
                      layoutId="desktop-nav-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      viewBox="0 0 64 8"
                      fill="none"
                      className="-bottom-1 left-0 absolute h-2 w-full"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5.5C18 2.8 44 2.8 62 5.2"
                        stroke="#FAF6EE"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher Toggle (Indonesia - Inggris) */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={
                isId
                  ? 'Ganti bahasa ke Inggris (Switch to English)'
                  : 'Switch language to Indonesian (Ganti ke Bahasa Indonesia)'
              }
              className="sketch-pill flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-2.5 py-1 font-journal text-[11.5px] font-bold text-[#FAF6EE] sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-[13px]"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5 shrink-0 text-[#F5D78E] sm:h-4 sm:w-4"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M2.8 10H17.2M10 2.5C12.2 4.8 13.2 7.3 13.2 10C13.2 12.7 12.2 15.2 10 17.5C7.8 15.2 6.8 12.7 6.8 10C6.8 7.3 7.8 4.8 10 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className={`rounded-full px-2 py-0.5 transition-colors ${
                  lang === 'id'
                    ? 'bg-[#F5D78E] text-[#091526]'
                    : 'text-[#B4C6DF] hover:text-[#FAF6EE]'
                }`}
              >
                ID
              </span>
              <span className="text-[#6E8EB8]" aria-hidden="true">
                /
              </span>
              <span
                className={`rounded-full px-2 py-0.5 transition-colors ${
                  lang === 'en'
                    ? 'bg-[#F5D78E] text-[#091526]'
                    : 'text-[#B4C6DF] hover:text-[#FAF6EE]'
                }`}
              >
                EN
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Quick-Jump Sketchbook Navigation Bar (< 768px) */}
        <nav
          aria-label="Mobile Navigation"
          className="flex items-center justify-around border-t border-[#1D3558]/60 bg-[#06101E]/95 px-2 py-1.5 md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`relative whitespace-nowrap px-2 py-0.5 font-journal text-[12px] transition-colors ${
                  isActive
                    ? 'font-bold text-[#FAF6EE]'
                    : 'font-medium text-[#B4C6DF] hover:text-[#FAF6EE]'
                }`}
              >
                {item.label[lang]}
                {isActive && (
                  <motion.svg
                    layoutId="mobile-nav-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    viewBox="0 0 64 8"
                    fill="none"
                    className="-bottom-0.5 left-1 right-1 absolute h-1.5 w-[calc(100%-8px)]"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 5.5C18 2.8 44 2.8 62 5.2"
                      stroke="#F5D78E"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                )}
              </a>
            );
          })}
        </nav>

        {/* Smooth Spring Scroll Progress Indicator Track & Glowing Bar */}
        <HeaderScrollProgressBar
          smoothScrollProgress={smoothScrollProgress}
          progressWidthPercent={progressWidthPercent}
        />
        <SketchDividerLine />
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. HERO SECTION (Balanced Mobile & Desktop Composition + Flush Chibi)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.main
        animate={{
          opacity: isSwitchingLang ? 0.68 : 1,
          y: isSwitchingLang ? 3 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
      <section
        id="home"
        className="relative z-10 mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-3 pb-1 sm:px-8 lg:pt-4 lg:pb-0"
      >
        {/* Layered Hand-Painted Night Clouds Framing Left, Right & Bottom Ridge */}
        <svg
          viewBox="0 0 1440 410"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          aria-hidden="true"
        >
          {/* Left Layered Cloud Silhouette */}
          <path
            d="M-30 70C20 65 55 95 68 135C102 128 132 152 138 190C172 195 198 225 195 268C225 275 245 305 240 345L-30 370Z"
            fill="#0E2038"
            opacity="0.72"
          />
          <path
            d="M-30 145C12 142 42 168 52 202C84 198 110 222 114 256C145 262 168 290 165 328L-30 365Z"
            fill="#142B4B"
            opacity="0.45"
          />
          {/* Right Layered Cloud Silhouette */}
          <path
            d="M1470 50C1405 48 1362 88 1350 138C1305 135 1270 168 1262 212C1218 218 1185 255 1182 302L1470 340Z"
            fill="#0E2038"
            opacity="0.78"
          />
          <path
            d="M1470 125C1418 122 1382 154 1372 195C1334 194 1304 220 1298 258C1260 264 1232 294 1230 334L1470 355Z"
            fill="#152D4E"
            opacity="0.5"
          />
          {/* Dark Navy Sloping Horizon Ridge Under Hero Chibi */}
          <path
            d="M-20 382C320 368 710 354 1060 330C1230 318 1360 310 1460 308V410H-20Z"
            fill="#060E1B"
            opacity="0.92"
          />
          <path
            d="M-20 382C320 368 710 354 1060 330C1230 318 1360 310 1460 308"
            stroke="#243F66"
            strokeOpacity="0.45"
            strokeWidth="1.8"
          />
        </svg>

        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-2">
          {/* LEFT COLUMN: Brush Display Name, Role, Description, CTA & Socials (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 14 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 pt-2 text-center sm:text-left lg:col-span-5 lg:pl-6 lg:pb-6"
          >
            <div className="relative inline-block">
              <h1 className="font-brush text-[46px] leading-[0.88] tracking-wide text-[#FAF6EE] drop-shadow-[0_4px_0_rgba(5,12,22,0.85)] sm:text-[64px] lg:text-[74px]">
                <span className="block -rotate-1">
                  <span className="relative inline-block">
                    URAY
                    {/* Crown anchored directly to the 'Y' of URAY on all screen sizes */}
                    <CrownDoodle
                      className="-top-5 -right-1 sm:-top-7 sm:-right-1.5 absolute h-6 w-8 -rotate-6 sm:h-8 sm:w-10"
                      color="#F5E1B5"
                    />
                  </span>{' '}
                  FAZLI
                </span>
                <span className="mt-1 block -rotate-1">ALMAN</span>
              </h1>
            </div>

            {/* Role Line — wraps cleanly by item on mobile, stays single-line on desktop */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-journal text-[12px] font-bold text-[#F5EFE6] sm:justify-start sm:text-[13.5px] lg:flex-nowrap">
              <span className="whitespace-nowrap">Node Operator</span>
              <span className="text-[#7898C4]" aria-hidden="true">|</span>
              <span className="whitespace-nowrap">Airdrop Hunter</span>
              <span className="text-[#7898C4]" aria-hidden="true">|</span>
              <span className="whitespace-nowrap">Meme Coin Trader</span>
              <span className="text-[#7898C4]" aria-hidden="true">|</span>
              <span className="whitespace-nowrap">Testnet Explorer</span>
            </div>

            {/* Description */}
            <p className="mx-auto mt-2.5 max-w-md font-journal text-[13px] leading-[1.5] text-[#D2DFEE] sm:mx-0 sm:text-[15px]">
              {isId ? (
                <>
                  Membangun, menjelajahi, dan memburu peluang terbaik
                  <br className="hidden sm:inline" /> di ekosistem Web3.
                </>
              ) : (
                <>
                  Building, exploring, and hunting opportunities
                  <br className="hidden sm:inline" /> in the Web3 space.
                </>
              )}
            </p>

            {/* CTA & Social Icons Row */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3.5 sm:mt-5 sm:justify-start sm:gap-5">
              <button
                type="button"
                onClick={() => setIsConnectOpen(true)}
                className="sketch-pill flex cursor-pointer items-center gap-2.5 whitespace-nowrap px-5 py-2 font-journal text-sm font-bold text-[#FAF6EE] sm:px-6 sm:py-2.5 sm:text-[15px]"
              >
                <span>{isId ? 'Mari Terhubung' : "Let's Connect"}</span>
                <HandArrowRight className="h-4 w-5" />
              </button>

              <div className="flex items-center gap-2.5 text-[#FAF6EE] sm:gap-3">
                <a
                  href="https://x.com/urayfazli17"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (@urayfazli17)"
                  title="X (@urayfazli17)"
                  className="p-1.5 transition-transform hover:-translate-y-1 hover:text-[#F5D78E]"
                >
                  <HandXIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/urayfazli"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub (@urayfazli)"
                  title="GitHub (@urayfazli)"
                  className="p-1.5 transition-transform hover:-translate-y-1 hover:text-[#F5D78E]"
                >
                  <HandGithubIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Handwritten Crypto Coins Strip in Hero Left Empty Space */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 select-none sm:justify-start">
              <GoldBitcoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
              <EthereumCoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
              <SolanaCoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
              <MemeDogeCoinMiniDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Oversized Hero Chibi Explorer + Callouts (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex items-end justify-center lg:col-span-7"
          >
            <div className="relative mx-auto flex w-full max-w-[360px] items-end justify-center pt-5 sm:max-w-[500px] sm:pt-3 lg:max-w-[560px] lg:pt-1">
              {/* Top-Left Empty Space Fill: Floating Airdrop Parachute + "Airdrop Alpha" Callout */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-4, 3, -4] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
                className="top-2 left-0 sm:top-5 sm:left-2 lg:top-6 lg:left-3 absolute z-20 flex flex-col items-center select-none"
              >
                <MiniAirdropParachuteDoodle className="h-9 w-8 sm:h-12 sm:w-10" />
                <div className="-mt-0.5 -rotate-8 text-center font-journal text-[10.5px] leading-[1.1] font-bold text-[#FAF6EE] sm:text-[13px]">
                  <span className="block text-[#F5D78E]">Airdrop</span>
                  <span className="block">Alpha Drop</span>
                </div>
              </motion.div>

              {/* Bottom-Left Empty Space Fill: Floating Meme Coin & Solana + "100x Meme Gems" */}
              <motion.div
                animate={{ y: [0, 5, 0], rotate: [3, -3, 3] }}
                transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut' }}
                className="bottom-4 left-0 sm:bottom-8 sm:left-1 lg:bottom-10 lg:left-2 absolute z-20 flex flex-col items-center select-none"
              >
                <div className="flex items-center -space-x-2">
                  <MemeDogeCoinMiniDoodle className="h-8 w-9 sm:h-10 sm:w-11" />
                  <SolanaCoinDoodle className="h-7 w-8 sm:h-9 sm:w-10" />
                </div>
                <div className="-rotate-6 text-center font-journal text-[10px] leading-[1.1] font-bold text-[#FAF6EE] sm:text-[12.5px]">
                  <span className="block">Meme Coin</span>
                  <span className="block text-[#F5D78E]">Early Narrative</span>
                </div>
              </motion.div>

              {/* Left Sparkle Star for Cosmic Framing */}
              <SparkleStar className="top-28 left-6 sm:top-34 sm:left-12 absolute h-4 w-4 opacity-80" />

              {/* Center-Left Shifted Chibi Bust Sitting Flush on Horizon */}
              <div className="relative z-10 sm:-ml-6 lg:-ml-10">
                <HeroChibiCharacter isId={isId} />
              </div>

              {/* Top-Right Annotation: Crown + "Small Steps / Big Bags" + Burst Ticks */}
              <div className="top-1 right-0 sm:top-4 sm:right-6 lg:top-5 lg:right-10 absolute z-20 -rotate-12 select-none text-center">
                <CrownDoodle className="mx-auto mb-0.5 h-4 w-5 sm:h-5 sm:w-6" color="#FAF6EE" />
                <div className="relative px-3 font-journal text-[12px] leading-[1.12] font-bold text-[#FAF6EE] sm:px-4 sm:text-[16px]">
                  <svg
                    viewBox="0 0 18 32"
                    fill="none"
                    className="-left-2 top-0.5 absolute h-6 w-3.5 sm:h-7 sm:w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 4L4 8M14 15L2 16M15 26L5 24"
                      stroke="#FAF6EE"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="block">Small Steps</span>
                  <span className="block">Big Bags</span>
                  <svg
                    viewBox="0 0 18 32"
                    fill="none"
                    className="-right-2 top-0.5 absolute h-6 w-3.5 sm:h-7 sm:w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4L14 2M4 15L16 14M3 26L14 27"
                      stroke="#FAF6EE"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Middle-Right Ringed Saturn Planet Doodle + Stars */}
              <motion.div
                animate={{ y: [0, -7, 0], rotate: [-3, 4, -3] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="top-20 -right-1 sm:top-24 sm:right-1 lg:top-26 lg:right-3 absolute z-20"
              >
                <PlanetDoodle className="h-11 w-16 sm:h-15 sm:w-22" />
              </motion.div>

              {/* Bottom-Right Annotation: "Web3 / No Limits" + Gold Bitcoin Doodle */}
              <div className="right-1 bottom-3 sm:right-8 sm:bottom-8 lg:right-14 lg:bottom-10 absolute z-20 -rotate-8 select-none">
                <GoldBitcoinDoodle className="mx-auto -mb-1 h-7 w-8 sm:h-9 sm:w-10" />
                <div className="font-journal text-[12px] leading-[1.12] font-bold text-[#FAF6EE] sm:text-[16px]">
                  <span className="block">Web3</span>
                  <span className="block">No</span>
                  <span className="block">Limits</span>
                </div>
                <svg viewBox="0 0 72 14" fill="none" className="mt-0.5 h-3 w-12 sm:h-3.5 sm:w-16" aria-hidden="true">
                  <path d="M2 5C24 2 48 2 68 4.5" stroke="#FAF6EE" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M10 10C28 8 46 8 60 9.5" stroke="#FAF6EE" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. ABOUT ME SECTION (Irregular Torn Parchment + Overlapping Chibi + 2x2 Stats)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="about"
        className="relative z-20 mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-2 pb-4 sm:px-8 lg:pt-3 lg:pb-5"
      >
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-3">
          {/* LEFT: Irregular Torn Parchment Panel (7 cols on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-7"
          >
            <div className="relative px-5 pt-5 pb-4 text-[#0B192C] sm:px-7 sm:pt-6 sm:pb-5">
              {/* True Irregular Torn-Paper SVG Background Layer with Deckled Edges */}
              <svg
                viewBox="0 0 780 270"
                fill="none"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full drop-shadow-[0_14px_28px_rgba(2,7,15,0.72)]"
                aria-hidden="true"
              >
                <path
                  d="M18 14L52 9L96 15L148 8L210 14L275 9L342 16L410 10L478 15L546 9L615 16L682 10L742 15L766 28L772 68L765 112L773 158L766 204L770 242L748 258L690 253L624 260L552 254L480 261L405 254L330 260L255 253L182 260L112 254L48 259L14 246L8 202L15 152L7 104L14 54Z"
                  fill="#EFE5D4"
                  stroke="#091526"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  filter="url(#torn-paper-edge)"
                />
                <path
                  d="M28 24L740 24L752 240L26 242Z"
                  fill="#E5D8C3"
                  opacity="0.35"
                  filter="url(#torn-paper-edge)"
                />
              </svg>

              {/* Heading Row: Mini Chibi Sticker Overlapping Top-Left + "About Me" + Top-Right Crypto & Airdrop/Meme Stamp */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <ChibiMiniAvatar className="-mt-3 -ml-2 h-12 w-12 shrink-0 drop-shadow-sm sm:-mt-4 sm:-ml-3 sm:h-15 sm:w-15" />
                  <div>
                    <h2 className="font-brush text-3xl leading-none text-[#091526] sm:text-[36px]">
                      {isId ? 'Tentang Saya' : 'About Me'}
                    </h2>
                    <svg viewBox="0 0 146 10" fill="none" className="mt-0.5 h-2.5 w-32 sm:w-36" aria-hidden="true">
                      <path
                        d="M2 6C48 2.5 98 2.5 144 5.5"
                        stroke="#091526"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Top-Right Empty Parchment Space Fill: Crypto Coin Trio + Meme Coin & Airdrop Note */}
                <div className="ml-auto flex items-center gap-1.5 select-none">
                  <div className="flex items-center -space-x-2">
                    <GoldBitcoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
                    <EthereumCoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
                    <MemeDogeCoinMiniDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
                  </div>
                  <div className="-rotate-3 text-right font-journal text-[10.5px] leading-[1.12] font-bold text-[#091526] sm:text-[12px]">
                    <span className="block">
                      {isId ? 'Garap Airdrop Awal' : 'Early Airdrop Farming'}
                    </span>
                    <span className="block text-[#22426E]">
                      {isId ? '& Trading Meme Coin' : '& Meme Coin Trading'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Paragraph + Chibi Overlapping Right Side of Torn Parchment */}
              <div className="mt-2.5 grid grid-cols-1 items-end gap-2 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <p className="font-journal text-[12.5px] leading-[1.55] font-semibold text-[#102136] sm:text-[13.5px]">
                    {isId
                      ? 'Halo! Saya Uray Fazli Alman, seorang Web3 enthusiast yang aktif di dunia blockchain sejak beberapa tahun terakhir. Saya fokus sebagai node operator, airdrop hunter, meme coin trader, dan selalu tertarik untuk menjelajahi project testnet terbaru. Tujuan saya sederhana: terus belajar, bertumbuh, dan menemukan peluang terbaik di ekosistem Web3.'
                      : 'Hello! I am Uray Fazli Alman, a Web3 enthusiast actively involved in the blockchain space over the past several years. I focus on operating nodes, hunting airdrops, trading meme coins, and exploring early-stage testnet projects. My goal is simple: keep learning, keep growing, and uncover the best opportunities across the Web3 ecosystem.'}
                  </p>

                  {/* Desktop/Tablet Signature Line + Crypto Token Tickers */}
                  <div className="mt-3 hidden flex-wrap items-center gap-1.5 font-journal text-xs font-bold text-[#091526] sm:flex sm:text-[12.5px]">
                    <span>— Same Guy</span>
                    <span aria-hidden="true">•</span>
                    <span>Web3</span>
                    <span aria-hidden="true">•</span>
                    <span>Better Future —</span>
                    <CrownDoodle className="h-4 w-5" color="#091526" />
                    <span className="ml-1 text-[11px] font-bold text-[#22426E]">
                      $BTC · $ETH · $SOL · $DOGE · Airdrop
                    </span>
                  </div>
                </div>

                {/* Mobile Combined Bottom Row (Signature Left + Chibi Right) / Desktop Overlapping Chibi */}
                <div className="mt-1 -mb-3 flex items-end justify-between gap-2 sm:col-span-5 sm:mt-0 sm:-mt-14 sm:-mr-3 sm:-mb-4 sm:justify-center lg:-mt-16">
                  <div className="pb-3 font-journal text-[11.5px] leading-tight font-bold text-[#091526] sm:hidden">
                    <span className="block">— Same Guy • Web3</span>
                    <span className="mt-0.5 flex items-center gap-1">
                      <span>• Better Future —</span>
                      <CrownDoodle className="h-3.5 w-4" color="#091526" />
                    </span>
                    <span className="mt-1 block text-[10.5px] text-[#22426E]">
                      $BTC · $SOL · Meme Coin · Airdrop
                    </span>
                  </div>
                  <div className="shrink-0">
                    <AboutMeOverlapChibi />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER BRIDGE (Desktop Vertical / Mobile Compact Horizontal Callout + Crypto & Airdrop Icons) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 select-none lg:col-span-1 lg:flex-col"
          >
            <MiniAirdropParachuteDoodle className="h-8 w-7 lg:h-10 lg:w-8" />
            <div className="-rotate-3 text-center font-journal text-[13.5px] leading-[1.15] font-bold text-[#FAF6EE] lg:-rotate-8 lg:text-[15px]">
              <span className="inline lg:block">Never </span>
              <span className="inline lg:block">Stop </span>
              <span className="inline lg:block">Exploring</span>
            </div>
            <svg viewBox="0 0 76 48" fill="none" className="hidden h-9 w-16 lg:mt-0.5 lg:block" aria-hidden="true">
              <path d="M4 5C26 2 50 2 72 5" stroke="#FAF6EE" strokeWidth="2.3" strokeLinecap="round" />
              <path
                d="M42 12C50 14 54 18 44 22C34 26 52 29 43 34C35 38 45 42 54 40"
                stroke="#FAF6EE"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center gap-1 lg:flex-col lg:gap-0.5">
              <SolanaCoinDoodle className="h-7 w-8 lg:h-8 lg:w-9" />
              <span className="-rotate-6 font-journal text-[10px] leading-tight font-bold text-[#F5D78E]">
                Meme &amp; Drop
              </span>
            </div>
          </motion.div>

          {/* RIGHT: 2x2 Statistic Cards Grid (2x2 on both Mobile and Desktop!) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-4">
            {/* Stat 1: 3+ Years in Web3 */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedEntryId('testnet')}
              className="sketch-card flex cursor-pointer items-center gap-2.5 px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <StatShieldBadge />
              <div className="min-w-0">
                <div className="font-brush text-2xl leading-none text-[#FAF6EE] tabular-nums sm:text-[32px]">
                  3+
                </div>
                <div className="mt-1 font-journal text-[11px] leading-tight font-medium text-[#C9D7EA] sm:text-[12.5px]">
                  {isId ? 'Tahun di Web3' : 'Years in Web3'}
                </div>
              </div>
            </motion.button>

            {/* Stat 2: 3 Node Networks */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.13, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedEntryId('aptos')}
              className="sketch-card flex cursor-pointer items-center gap-2.5 px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <StatNodeBadge />
              <div className="min-w-0">
                <div className="font-brush text-2xl leading-none text-[#FAF6EE] tabular-nums sm:text-[32px]">
                  3
                </div>
                <div className="mt-1 font-journal text-[11px] leading-tight font-medium text-[#C9D7EA] sm:text-[12.5px]">
                  {isId ? 'Jaringan Node' : 'Node Networks'}
                </div>
              </div>
            </motion.button>

            {/* Stat 3: 100+ Testnet Joined */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedEntryId('testnet')}
              className="sketch-card flex cursor-pointer items-center gap-2.5 px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <StatCubeBadge />
              <div className="min-w-0">
                <div className="font-brush text-2xl leading-none text-[#FAF6EE] tabular-nums sm:text-[32px]">
                  100+
                </div>
                <div className="mt-1 font-journal text-[11px] leading-tight font-medium text-[#C9D7EA] sm:text-[12.5px]">
                  {isId ? 'Testnet Diikuti' : 'Testnet Joined'}
                </div>
              </div>
            </motion.button>

            {/* Stat 4: 1000+ Airdrop & Meme Opportunities */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedEntryId('airdrop')}
              className="sketch-card flex cursor-pointer items-center gap-2.5 px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <StatRocketBadge />
              <div className="min-w-0">
                <div className="font-brush text-2xl leading-none text-[#FAF6EE] tabular-nums sm:text-[32px]">
                  1000+
                </div>
                <div className="mt-0.5 font-journal text-[10.5px] leading-tight font-medium text-[#C9D7EA] sm:text-xs">
                  {isId ? (
                    <>
                      Peluang Airdrop
                      <br />
                      &amp; Meme
                    </>
                  ) : (
                    <>
                      Airdrop &amp; Meme
                      <br />
                      Opportunities
                    </>
                  )}
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. MY EXPERIENCE SECTION (Torn Horizontal Parchment + 3 Node Cards + Prone Chibi)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="experience"
        className="relative z-20 mx-auto max-w-[1400px] scroll-mt-24 px-4 py-3 sm:px-8 lg:py-4"
      >
        <div className="grid grid-cols-1 items-end gap-5 lg:grid-cols-12 lg:gap-4">
          {/* LEFT: Torn Horizontal Parchment Panel (8 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -22, y: 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.18 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-8"
          >
            <div className="relative px-4 pt-4 pb-5 text-[#091526] sm:px-6 sm:pt-5 sm:pb-6">
              {/* True Irregular Torn-Paper SVG Background Layer */}
              <svg
                viewBox="0 0 920 250"
                fill="none"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full drop-shadow-[0_14px_28px_rgba(2,7,15,0.72)]"
                aria-hidden="true"
              >
                <path
                  d="M16 14L68 8L134 15L210 9L290 14L375 8L460 15L548 9L635 14L722 8L808 15L882 10L906 24L912 72L905 126L913 182L906 228L884 240L805 235L718 242L628 236L535 242L442 235L350 241L258 235L168 241L84 235L20 240L8 214L14 162L7 108L14 54Z"
                  fill="#EFE5D4"
                  stroke="#091526"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  filter="url(#torn-paper-edge)"
                />
              </svg>

              {/* Top Row inside Parchment: Chibi Avatar + Jagged Dark Brush Stroke Banner + Right Annotation */}
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ChibiMiniAvatar className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
                  {/* Jagged Hand-Painted Dark Navy Brush Banner */}
                  <div className="relative px-4 py-1 sm:px-5 sm:py-1.5">
                    <svg
                      viewBox="0 0 220 46"
                      fill="none"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 8C55 3 155 3 208 7L216 14L210 22L218 30L206 39C150 43 58 43 10 38L3 29L9 21L2 13Z"
                        fill="#081425"
                      />
                    </svg>
                    <h2 className="relative z-10 font-brush text-2xl leading-none tracking-wide text-[#FAF6EE] sm:text-[30px]">
                      {isId ? 'Pengalaman Saya' : 'My Experience'}
                    </h2>
                  </div>
                </div>

                {/* Top-Right Annotation on Parchment: Crypto Coins + "Node Run / The Chain" + Crown */}
                <div className="ml-auto flex items-center gap-2 select-none sm:gap-3">
                  <div className="hidden items-center gap-1.5 md:flex">
                    <div className="flex items-center -space-x-1.5">
                      <EthereumCoinDoodle className="h-7 w-8" />
                      <SolanaCoinDoodle className="h-7 w-8" />
                    </div>
                    <div className="-rotate-2 text-left font-journal text-[10.5px] leading-[1.12] font-bold text-[#22426E]">
                      <span className="block">
                        {isId ? 'Insentif Node &' : 'Node Incentives &'}
                      </span>
                      <span className="block text-[#091526]">
                        {isId ? 'Alokasi Airdrop' : 'Airdrop Rewards'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="text-right font-journal text-[11px] leading-[1.15] font-bold text-[#091526] sm:text-[13.5px]">
                      <span className="block">Node Run</span>
                      <span className="block">The Chain</span>
                    </div>
                    <CrownDoodle className="h-4 w-5 sm:h-5 sm:w-6" color="#091526" />
                  </div>
                </div>
              </div>

              {/* 3 Compact Dark Navy Node Cards Inside Parchment */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* CARD 1: Aptos Network */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.52, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedEntryId('aptos')}
                  className="sketch-card-exp group relative flex h-full cursor-pointer flex-col justify-between px-4 py-3.5 text-left text-[#F5EFE6]"
                >
                  <div className="flex items-center gap-3">
                    <AptosNetworkIcon />
                    <div>
                      <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-base">
                        Aptos Network
                      </h3>
                      <p className="font-journal text-[11.5px] text-[#B2C5DF]">Node Operator</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Jalankan full node' : 'Run full node'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Pantau & pelihara' : 'Monitor & maintain'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>
                          {isId ? 'Dukung stabilitas jaringan' : 'Support network stability'}
                        </span>
                      </li>
                    </ul>
                    <HandArrowRight className="h-4 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.button>

                {/* CARD 2: Sei Network */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.52, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedEntryId('sei')}
                  className="sketch-card-exp group relative flex h-full cursor-pointer flex-col justify-between px-4 py-3.5 text-left text-[#F5EFE6]"
                >
                  <div className="flex items-center gap-3">
                    <SeiNetworkIcon />
                    <div>
                      <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-base">
                        Sei Network
                      </h3>
                      <p className="font-journal text-[11.5px] text-[#B2C5DF]">Node Operator</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Jalankan full node' : 'Run full node'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Sinkronisasi & pantau' : 'Sync & monitoring'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>
                          {isId ? 'Kontribusi ke ekosistem' : 'Contribute to ecosystem'}
                        </span>
                      </li>
                    </ul>
                    <HandArrowRight className="h-4 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.button>

                {/* CARD 3: SubQuery Network */}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.52, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedEntryId('subquery')}
                  className="sketch-card-exp group relative flex h-full cursor-pointer flex-col justify-between px-4 py-3.5 text-left text-[#F5EFE6]"
                >
                  <div className="flex items-center gap-3">
                    <SubQueryNetworkIcon />
                    <div>
                      <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-base">
                        SubQuery Network
                      </h3>
                      <p className="font-journal text-[11.5px] text-[#B2C5DF]">Node Operator</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Jalankan node indexer' : 'Run indexer node'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>{isId ? 'Proses data on-chain' : 'Process on-chain data'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                        <span>
                          {isId ? 'Dukung infrastruktur data' : 'Support data infrastructure'}
                        </span>
                      </li>
                    </ul>
                    <HandArrowRight className="h-4 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Chibi Running Node / Server Stack + "Good Nodes Good Future" + Crypto & Airdrop Callouts (4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-end pt-7 sm:pt-8 lg:col-span-4 lg:pt-5"
          >
            {/* Top-Left Empty Space Fill around Node Chibi: Airdrop Parachute + Node Airdrop Note */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-4, 3, -4] }}
              transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
              className="top-0 left-2 sm:left-10 lg:left-1 absolute z-20 flex flex-col items-center select-none"
            >
              <MiniAirdropParachuteDoodle className="h-9 w-8 sm:h-11 sm:w-9" />
              <div className="-mt-0.5 -rotate-8 text-center font-journal text-[10px] leading-[1.1] font-bold text-[#FAF6EE] sm:text-xs">
                <span className="block text-[#F5D78E]">Node Drop</span>
                <span className="block">&amp; Airdrop</span>
              </div>
            </motion.div>

            {/* Bottom-Left Empty Space Fill around Node Chibi: Floating Crypto Coins */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="bottom-3 left-2 sm:left-12 lg:left-1 absolute z-20 flex flex-col items-center select-none"
            >
              <div className="flex items-center -space-x-2">
                <GoldBitcoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
                <EthereumCoinDoodle className="h-7 w-8 sm:h-8 sm:w-9" />
              </div>
              <span className="-rotate-6 font-journal text-[9.5px] font-bold text-[#9BB8DF] sm:text-[11px]">
                $APT · $SEI · $SQT
              </span>
            </motion.div>

            <div className="-top-1 right-4 sm:right-12 lg:right-2 absolute z-20 -rotate-12 select-none text-center">
              <div className="font-journal text-xs leading-[1.12] font-bold text-[#FAF6EE] sm:text-[14px]">
                <span className="block">Good</span>
                <span className="block">Nodes</span>
                <span className="block">Good</span>
                <span className="block">Future</span>
              </div>
              <svg viewBox="0 0 60 18" fill="none" className="mx-auto mt-0.5 h-3.5 w-13 sm:h-4 sm:w-14" aria-hidden="true">
                <path
                  d="M4 5C20 2 40 2 56 5M18 11C28 9 38 10 46 13"
                  stroke="#FAF6EE"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Bottom-Right Empty Space Fill around Node Chibi: Meme Coin Doodle */}
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [4, -3, 4] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="right-2 bottom-3 sm:right-12 lg:right-1 absolute z-20 flex flex-col items-center select-none"
            >
              <MemeDogeCoinMiniDoodle className="h-8 w-9 sm:h-9 sm:w-10" />
              <span className="rotate-6 font-journal text-[9.5px] font-bold text-[#F5D78E] sm:text-[11px]">
                Meme Alpha
              </span>
            </motion.div>

            <NodeOperatorChibiScene />
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. MY ACTIVITIES SECTION (3 Organic Illustrated Cards + Rocket Callout)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="activities"
        className="relative z-20 mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-3 pb-5 sm:px-8 lg:pt-4 lg:pb-6"
      >
        {/* Heading Row: Comic Burst + "My Activities" + Underline + Crown (+ Desktop Crypto/Meme/Airdrop Strip) */}
        <motion.div
          initial={{ opacity: 0, x: -18, y: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 20 26" fill="none" className="h-6 w-5 text-[#FAF6EE]" aria-hidden="true">
              <path
                d="M16 4L6 10M14 14L4 16M16 23L7 22"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-brush text-3xl leading-none text-[#FAF6EE] sm:text-[35px]">
                  {isId ? 'Aktivitas Saya' : 'My Activities'}
                </h2>
                <CrownDoodle className="h-6 w-7 -rotate-6" color="#F5E1B5" />
              </div>
              <svg viewBox="0 0 180 10" fill="none" className="mt-0.5 h-2.5 w-38 sm:w-44" aria-hidden="true">
                <path
                  d="M2 6C60 2 120 2 178 5.5"
                  stroke="#FAF6EE"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Desktop Empty Header Space Fill: Crypto Coin Icons + Meme Coin & Airdrop Strategy Note */}
          <div className="hidden items-center gap-3 select-none lg:flex">
            <div className="flex items-center -space-x-1.5">
              <GoldBitcoinDoodle className="h-8 w-9" />
              <EthereumCoinDoodle className="h-8 w-9" />
              <SolanaCoinDoodle className="h-8 w-9" />
              <MemeDogeCoinMiniDoodle className="h-8 w-9" />
            </div>
            <div className="-rotate-1 text-right font-journal text-xs leading-tight font-bold text-[#D8E5F7]">
              <span className="block text-[#F5D78E]">
                {isId
                  ? 'Berburu Airdrop Potensial & Quest Testnet'
                  : 'Hunting High-Potential Airdrops & Testnet Quests'}
              </span>
              <span className="block text-[#FAF6EE]">
                {isId
                  ? '• Trading Meme Coin Narasi Awal ($DOGE, $PEPE, $SOL)'
                  : '• Early-Narrative Meme Coin Trading ($DOGE, $PEPE, $SOL)'}
              </span>
            </div>
            <MiniAirdropParachuteDoodle className="h-10 w-8" />
          </div>

          {/* Mobile/Tablet Callout: "Web3 Friends = More Opportunities" + Rocket */}
          <div className="flex items-center gap-1.5 select-none lg:hidden">
            <div className="-rotate-6 text-right font-journal text-[10.5px] leading-tight font-bold text-[#FAF6EE] sm:text-xs">
              <span className="block">Web3 Friends =</span>
              <span className="block text-[#F5D78E]">More Opportunities</span>
            </div>
            <RocketSketchDoodle className="h-7 w-7 shrink-0" />
          </div>
        </motion.div>

        {/* 3 Cards + Far-Right "Web3 Friends = More Opportunities" Column */}
        <div className="grid grid-cols-1 items-stretch gap-3.5 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {/* CARD 1: Airdrop Hunter (4 cols on Desktop) */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.18 }}
            transition={{ duration: 0.56, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedEntryId('airdrop')}
            className="sketch-card group relative flex cursor-pointer items-center justify-between gap-2 px-3.5 py-3.5 text-left sm:px-4 lg:col-span-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <AirdropParachuteIllustration />
              <div className="min-w-0 flex-1">
                <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-[16.5px]">
                  Airdrop Hunter
                </h3>
                <div className="mt-2 flex items-end justify-between gap-1">
                  <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Ikuti proyek terbaru' : 'Follow latest project'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>
                        {isId ? 'Selesaikan quest & tugas' : 'Complete quests & tasks'}
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Garap peluang awal' : 'Farm early opportunities'}</span>
                    </li>
                  </ul>
                  <HandArrowRight className="h-3.5 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Right Floating Handwritten Annotation inside Card 1 */}
            <div className="relative flex shrink-0 flex-col items-center justify-between self-stretch pl-1 text-center">
              <div className="relative -rotate-10 font-journal text-[10.5px] leading-[1.12] font-bold text-[#FAF6EE] sm:text-xs">
                <span className="-top-2 -left-1.5 absolute text-[10px]" aria-hidden="true">
                  ⑊
                </span>
                <span className="block">Free</span>
                <span className="block">Tokens</span>
                <span className="block text-[#9BB8DF]">=</span>
                <span className="block">Freedom</span>
                <svg viewBox="0 0 54 6" fill="none" className="mx-auto h-1.5 w-11 sm:w-12" aria-hidden="true">
                  <path d="M2 3.5C18 1.5 36 1.5 52 3.5" stroke="#FAF6EE" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="-mb-2.5 mt-1">
                <GoldBitcoinDoodle className="h-9 w-10 sm:h-10 sm:w-11" />
              </div>
            </div>
          </motion.button>

          {/* CARD 2: Meme Coin Trader (4 cols on Desktop) */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.18 }}
            transition={{ duration: 0.56, delay: 0.13, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedEntryId('memecoin')}
            className="sketch-card group relative flex cursor-pointer items-center justify-between gap-2 px-3.5 py-3.5 text-left sm:px-4 lg:col-span-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <MemeCoinDogeIllustration />
              <div className="min-w-0 flex-1">
                <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-[16.5px]">
                  Meme Coin Trader
                </h3>
                <div className="mt-2 flex items-end justify-between gap-1">
                  <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Deteksi tren awal' : 'Spot early trends'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Kelola risiko' : 'Manage risk'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>
                        {isId ? 'Ikuti hype (dengan bijak)' : 'Ride the hype (responsibly)'}
                      </span>
                    </li>
                  </ul>
                  <HandArrowRight className="h-3.5 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Right Floating Handwritten Annotation inside Card 2 + Meme Coin Icon */}
            <div className="relative flex shrink-0 flex-col items-center justify-between self-stretch pl-1 text-center">
              <div className="relative -rotate-10 font-journal text-[10.5px] leading-[1.12] font-bold text-[#FAF6EE] sm:text-xs">
                <span className="-top-2 -left-1.5 absolute text-[10px]" aria-hidden="true">
                  ⑊
                </span>
                <span className="block">Meme</span>
                <span className="block">Culture</span>
                <span className="block text-[#9BB8DF]">=</span>
                <span className="block">Profit</span>
              </div>
              <div className="-mb-2 mt-1">
                <MemeDogeCoinMiniDoodle className="h-9 w-10 sm:h-10 sm:w-11" />
              </div>
            </div>
          </motion.button>

          {/* CARD 3: Testnet Explorer (3 cols on Desktop, full width on 2-col tablet) */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.18 }}
            transition={{ duration: 0.56, delay: 0.21, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedEntryId('testnet')}
            className="sketch-card group relative flex cursor-pointer items-center justify-between gap-2 px-3.5 py-3.5 text-left sm:px-4 md:col-span-2 lg:col-span-3"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <TestnetCubesIllustration />
              <div className="min-w-0 flex-1">
                <h3 className="font-journal text-[15px] font-bold text-[#FAF6EE] sm:text-[16.5px]">
                  Testnet Explorer
                </h3>
                <div className="mt-2 flex items-end justify-between gap-1">
                  <ul className="space-y-1 font-journal text-[11.5px] text-[#DCE7F5] sm:text-xs">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Gabung proyek baru' : 'Join new projects'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>{isId ? 'Uji berbagai fitur' : 'Test features'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FAF6EE]" />
                      <span>
                        {isId ? 'Akses awal & dapatkan reward' : 'Get early access & rewards'}
                      </span>
                    </li>
                  </ul>
                  <HandArrowRight className="h-3.5 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Right Floating Handwritten Annotation inside Card 3 + Ethereum Coin Doodle */}
            <div className="relative flex shrink-0 flex-col items-center justify-between self-stretch pl-1 text-center">
              <div className="relative -rotate-10 font-journal text-[10px] leading-[1.12] font-bold text-[#FAF6EE] sm:text-[11px]">
                <span className="block">Early</span>
                <span className="block">Testnet</span>
                <span className="block text-[#9BB8DF]">=</span>
                <span className="block text-[#F5D78E]">Airdrop</span>
              </div>
              <div className="-mb-2 mt-1">
                <EthereumCoinDoodle className="h-8 w-9 sm:h-9 sm:w-10" />
              </div>
            </div>
          </motion.button>

          {/* FAR RIGHT DOODLE CLUSTER: "Web3 Friends = More Opportunities" + Rocket + Crypto Coin (Desktop 1 col) */}
          <motion.div
            initial={{ opacity: 0, x: 16, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="hidden flex-col items-center justify-center gap-1.5 select-none lg:col-span-1 lg:flex"
          >
            <SolanaCoinDoodle className="h-8 w-9" />
            <div className="relative flex items-center">
              <div className="-rotate-12 text-center font-journal text-[11px] leading-[1.12] font-bold text-[#FAF6EE]">
                <span className="block">Web3</span>
                <span className="block">Friends</span>
                <span className="block text-[#9BB8DF]">=</span>
                <span className="block">More</span>
                <span className="block">Opportunities</span>
                <svg viewBox="0 0 64 8" fill="none" className="mx-auto mt-0.5 h-2 w-14" aria-hidden="true">
                  <path d="M2 5C22 2 42 2 62 5" stroke="#FAF6EE" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RocketSketchDoodle className="-mt-3 -ml-1 h-8 w-8 shrink-0" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. GET IN TOUCH (CONTACT) SECTION (Mobile & Desktop Flush Chibi Strip)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="contact"
        className="relative z-20 mt-1 w-full scroll-mt-24"
      >
        <SketchDividerLine />

        {/* Night Cloud Horizon Backdrop for Contact Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#081527] via-[#0C1E38] to-[#081322]">
          {/* Layered Hand-Painted Cloud Silhouettes Along Contact Horizon */}
          <svg
            viewBox="0 0 1440 210"
            fill="none"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Left Cloud Cluster */}
            <path
              d="M-30 210V95C18 88 58 112 72 145C112 132 156 148 174 180C214 168 258 180 282 210Z"
              fill="#142C4E"
              opacity="0.78"
            />
            <path
              d="M-20 210V140C25 135 62 154 78 182C115 172 152 184 172 210Z"
              fill="#1D3B66"
              opacity="0.55"
            />
            {/* Right Cloud Cluster Behind Socials & Peeking Chibi */}
            <path
              d="M840 210C875 176 928 172 968 194C1005 156 1065 152 1106 182C1152 136 1222 134 1266 172C1310 142 1375 148 1412 182L1460 175V210Z"
              fill="#142C4E"
              opacity="0.82"
            />
            <path
              d="M960 210C995 184 1045 182 1080 200C1120 168 1178 168 1215 194C1260 162 1325 164 1365 196L1450 190V210Z"
              fill="#1F3F6B"
              opacity="0.55"
            />
          </svg>

          <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-5 pb-0 sm:px-8 lg:pt-4">
            {/* DESKTOP 4-ZONE HORIZONTAL STRIP (lg+) */}
            <div className="hidden items-end gap-4 lg:grid lg:grid-cols-12">
              {/* Col 1-3: Left Anime Chibi + "Let's Build Together" + Crypto & Airdrop Icons */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 14 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-end justify-center lg:col-span-3"
              >
                <div className="relative flex items-end gap-1">
                  <BackpackWalkerChibi />
                  <div className="mb-5 -ml-2 flex flex-col items-start select-none">
                    <div className="mb-1 flex items-center -space-x-1.5">
                      <GoldBitcoinDoodle className="h-7 w-8" />
                      <MemeDogeCoinMiniDoodle className="h-7 w-8" />
                    </div>
                    <div className="-rotate-10">
                      <div className="relative font-journal text-[12px] leading-[1.12] font-bold text-[#FAF6EE]">
                        <span className="-left-3 top-0.5 absolute text-xs" aria-hidden="true">
                          ⑊
                        </span>
                        <span className="block">Let&apos;s</span>
                        <span className="block">Build</span>
                        <span className="block text-[#F5D78E]">Together</span>
                      </div>
                      <span className="mt-0.5 block font-journal text-[9.5px] font-bold text-[#9BB8DF]">
                        Airdrop &amp; Meme Alpha
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Col 4-6: "Get In Touch" Heading, Description & CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="pb-5 text-left lg:col-span-3"
              >
                <h2 className="font-brush text-[36px] leading-none text-[#FAF6EE]">
                  {isId ? 'Hubungi Saya' : 'Get In Touch'}
                </h2>
                <p className="mt-2 font-journal text-[13px] leading-relaxed text-[#D0DDF0]">
                  {isId ? (
                    <>
                      Selalu terbuka untuk peluang baru,
                      <br />
                      kolaborasi, dan proyek Web3 menarik.
                    </>
                  ) : (
                    <>
                      Always open for new opportunities,
                      <br />
                      collaborations, and interesting projects.
                    </>
                  )}
                </p>
                <div className="mt-3.5 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setIsConnectOpen(true)}
                    className="sketch-pill flex cursor-pointer items-center gap-2 whitespace-nowrap px-5 py-1.5 font-journal text-[13.5px] font-bold text-[#FAF6EE]"
                  >
                    <span>{isId ? 'Mari Terhubung' : "Let's Connect"}</span>
                    <HandArrowRight className="h-3.5 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Col 7-10: Vertical Hand-Drawn Divider + Crypto Callout + Social Cards */}
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center gap-4 pb-4 lg:col-span-4"
              >
                <svg
                  viewBox="0 0 6 96"
                  fill="none"
                  className="h-24 w-1.5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M3 2C1.8 32 4.2 64 3 94"
                    stroke="#FAF6EE"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="flex w-full max-w-[250px] flex-col gap-2">
                  <div className="flex items-center justify-center gap-1.5 select-none">
                    <SolanaCoinDoodle className="h-6 w-7 shrink-0" />
                    <span className="font-journal text-[10.5px] font-bold text-[#F5D78E]">
                      {isId ? 'Diskusi Airdrop & Meme Coin' : 'Talk Airdrop & Meme Coin Alpha'}
                    </span>
                    <EthereumCoinDoodle className="h-6 w-7 shrink-0" />
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3">
                    <a
                      href="https://x.com/urayfazli17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sketch-card flex flex-col items-center justify-center px-3 py-2.5 text-center"
                    >
                      <HandXIcon className="h-5 w-5 text-[#FAF6EE]" />
                      <span className="mt-1.5 font-journal text-[11px] font-bold text-[#FAF6EE]">
                        X
                      </span>
                      <span className="font-journal text-[8.5px] whitespace-nowrap text-[#9BB8DF]">
                        @urayfazli17
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyText('Email', 'fazliuray@gmail.com')}
                      className="sketch-card flex cursor-pointer flex-col items-center justify-center px-3 py-2.5 text-center"
                    >
                      <HandEmailIcon className="h-5 w-5 text-[#FAF6EE]" />
                      <span className="mt-1.5 font-journal text-[11px] font-bold text-[#FAF6EE]">
                        Email
                      </span>
                      <span className="font-journal text-[8.5px] whitespace-nowrap text-[#9BB8DF]">
                        fazliuray@gmail.com
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Col 11-12: Chibi Character Peeking Over the Bottom Border Line + Floating Airdrop Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center justify-end lg:col-span-2"
              >
                <div className="-mb-2 flex items-center gap-1 -rotate-6 select-none">
                  <MiniAirdropParachuteDoodle className="h-8 w-7 shrink-0" />
                  <div className="text-left font-journal text-[10px] leading-[1.1] font-bold text-[#FAF6EE]">
                    <span className="block text-[#F5D78E]">Next 100x</span>
                    <span className="block">Meme &amp; Drop</span>
                  </div>
                </div>
                <PeekingBottomChibi />
              </motion.div>
            </div>

            {/* MOBILE & TABLET LAYOUT (< lg): Clean Stacked CTA + Social Cards + Balanced Dual Bottom Chibi Strip */}
            <div className="flex flex-col items-center lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <h2 className="font-brush text-3xl leading-none text-[#FAF6EE] sm:text-[36px]">
                  {isId ? 'Hubungi Saya' : 'Get In Touch'}
                </h2>
                <p className="mt-1.5 max-w-sm font-journal text-xs leading-relaxed text-[#D0DDF0] sm:text-[13.5px]">
                  {isId
                    ? 'Selalu terbuka untuk peluang baru, kolaborasi, dan proyek Web3 menarik.'
                    : 'Always open for new opportunities, collaborations, and interesting projects.'}
                </p>
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsConnectOpen(true)}
                    className="sketch-pill flex cursor-pointer items-center gap-2 whitespace-nowrap px-5 py-1.5 font-journal text-xs font-bold text-[#FAF6EE] sm:text-[13.5px]"
                  >
                    <span>{isId ? 'Mari Terhubung' : "Let's Connect"}</span>
                    <HandArrowRight className="h-3.5 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Social Cards on Mobile & Tablet */}
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.56, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 grid w-full max-w-[240px] grid-cols-2 gap-3"
              >
                <a
                  href="https://x.com/urayfazli17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sketch-card flex flex-col items-center justify-center px-3 py-2.5 text-center"
                >
                  <HandXIcon className="h-5 w-5 text-[#FAF6EE]" />
                  <span className="mt-1.5 font-journal text-[11px] font-bold text-[#FAF6EE]">
                    X
                  </span>
                  <span className="font-journal text-[8px] whitespace-nowrap text-[#9BB8DF]">
                    @urayfazli17
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyText('Email', 'fazliuray@gmail.com')}
                  className="sketch-card flex cursor-pointer flex-col items-center justify-center px-3 py-2.5 text-center"
                >
                  <HandEmailIcon className="h-5 w-5 text-[#FAF6EE]" />
                  <span className="mt-1.5 font-journal text-[11px] font-bold text-[#FAF6EE]">
                    Email
                  </span>
                  <span className="font-journal text-[8px] whitespace-nowrap text-[#9BB8DF]">
                    fazliuray@gmail.com
                  </span>
                </button>
              </motion.div>

              {/* Symmetrical Bottom Chibi Horizon Strip on Mobile & Tablet + Crypto & Meme/Airdrop Icons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.56, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 flex w-full max-w-md items-end justify-between gap-2 px-2 sm:max-w-lg"
              >
                <BackpackWalkerChibi />

                <div className="mb-4 flex flex-col items-center select-none text-center sm:mb-6">
                  <div className="mb-1 flex items-center -space-x-1.5">
                    <GoldBitcoinDoodle className="h-6 w-7 sm:h-7 sm:w-8" />
                    <MemeDogeCoinMiniDoodle className="h-6 w-7 sm:h-7 sm:w-8" />
                    <SolanaCoinDoodle className="h-6 w-7 sm:h-7 sm:w-8" />
                  </div>
                  <div className="-rotate-6 font-journal text-[11px] leading-[1.12] font-bold text-[#FAF6EE] sm:text-xs">
                    <span className="block">Let&apos;s Build</span>
                    <span className="block text-[#F5D78E]">Meme &amp; Airdrop</span>
                    <span className="block text-[9.5px] text-[#9BB8DF]">Together</span>
                  </div>
                </div>

                <PeekingBottomChibi />
              </motion.div>
            </div>
          </div>
        </div>

        <SketchDividerLine />
      </section>
      </motion.main>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. FOOTER (Running Text + Copyright + Crown Doodles)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.footer
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 bg-[#050C17] py-3.5 text-[#D8E3F2]"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 sm:px-8 lg:flex-row">
          {/* Left & Center Running Text */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-journal text-[11.5px] text-[#D0DDF0] sm:gap-x-2.5 sm:text-[12.5px]">
            <CrownDoodle className="mr-0.5 h-4 w-5" color="#E5B869" />
            <span>— Crypto</span>
            <span className="text-[#6E8EB8]" aria-hidden="true">/</span>
            <span>Meme Coin</span>
            <span className="text-[#6E8EB8]" aria-hidden="true">/</span>
            <span>NFT</span>
            <span className="text-[#6E8EB8]" aria-hidden="true">/</span>
            <span>Airdrop</span>
            <span className="text-[#6E8EB8]" aria-hidden="true">/</span>
            <span>Testnet</span>
            <span className="text-[#6E8EB8]" aria-hidden="true">/</span>
            <span>Build</span>
            <span className="text-[#E5B869]" aria-hidden="true">•</span>
            <span>Explore</span>
            <span className="text-[#E5B869]" aria-hidden="true">•</span>
            <span>Earn</span>
            <span className="text-[#E5B869]" aria-hidden="true">•</span>
            <span>Repeat —</span>
          </div>

          {/* Right Copyright + Gold Crown + Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-journal text-[11.5px] text-[#D0DDF0] sm:text-[12.5px]">
            <span>© 2025 Uray Fazli Alman</span>
            <span className="text-[#E5B869]" aria-hidden="true">•</span>
            <span>Web3 Portfolio</span>
            <CrownDoodle className="h-4 w-5" color="#E5B869" />
            <button
              type="button"
              onClick={scrollToTop}
              className="sketch-pill ml-1 flex cursor-pointer items-center gap-1.5 bg-[#0D1E36] px-3 py-1 font-journal text-[11px] font-bold text-[#FAF6EE] hover:text-[#F5D78E] sm:text-xs"
              aria-label={isId ? 'Kembali ke Atas' : 'Back to Top'}
            >
              <span className="text-[#F5D78E]" aria-hidden="true">↑</span>
              <span>{isId ? 'Kembali ke Atas' : 'Back to Top'}</span>
            </button>
          </div>
        </div>
      </motion.footer>

      {/* Interactive Modals */}
      <JournalDetailModal
        entry={selectedEntry}
        lang={lang}
        onClose={() => setSelectedEntryId(null)}
        onConnectClick={() => setIsConnectOpen(true)}
      />

      <ConnectJournalModal
        isOpen={isConnectOpen}
        lang={lang}
        onClose={() => setIsConnectOpen(false)}
        onCopyText={handleCopyText}
      />
    </div>
  );
}
