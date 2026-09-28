import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cozyAsmrAudio } from '../utils/cozyAsmrAudio';
import { CharacterRig } from './CharacterRig';
import heroChibiImg from '../assets/images/anime_chibi_hero.png';
import heroChibiCozyImg from '../assets/images/anime_chibi_hero_cozy.png';
import aboutChibiImg from '../assets/images/anime_chibi_about.png';
import nodeOperatorImg from '../assets/images/anime_chibi_node.png';
import backpackWalkerImg from '../assets/images/anime_chibi_walker.png';
import peekingBottomImg from '../assets/images/anime_chibi_peeking.png';

export const GENERATED_ASSETS = {
  heroChibiImg,
  heroChibiCozyImg,
  aboutChibiImg,
  nodeOperatorImg,
  backpackWalkerImg,
  peekingBottomImg,
};

/** Global SVG Filters (Disabled CPU-heavy feTurbulence/feDisplacementMap to prevent thermal throttling) */
export const GlobalSvgFilters: React.FC = () => null;

/** Hand-drawn 3-pointed crown doodle */
export const CrownDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-7 h-6',
  color = '#F5E6C8',
}) => (
  <svg viewBox="0 0 46 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 27L4.5 9.5L15.5 18.5L23 5.5L30.5 18.5L41.5 9L38 27C30 29 15 29 7 27Z"
      stroke={color}
      strokeWidth="2.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 31.2C17 32.5 29 32.5 37 31"
      stroke={color}
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

/** Hand-drawn ringed Saturn planet doodle with stars (Hero right) */
export const PlanetDoodle: React.FC<{ className?: string }> = ({ className = 'w-20 h-14' }) => (
  <svg viewBox="0 0 92 68" fill="none" className={className} aria-hidden="true">
    <path
      d="M19 10L20.8 15.8L26.5 17.5L20.8 19.2L19 25L17.2 19.2L11.5 17.5L17.2 15.8L19 10Z"
      stroke="#F3EBDD"
      strokeWidth="1.6"
      fill="#091525"
    />
    <circle
      cx="48"
      cy="34"
      r="14.5"
      fill="#0B192E"
      stroke="#FAF6EE"
      strokeWidth="2.3"
    />
    <path
      d="M38 25.5C42 23 48 23 53 25.5"
      stroke="#9BB8DF"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <ellipse
      cx="48"
      cy="35"
      rx="35"
      ry="9"
      transform="rotate(-22 48 35)"
      stroke="#FAF6EE"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path d="M24 54V60M21 57H27" stroke="#6E8EB8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M74 48V54M71 51H77" stroke="#6E8EB8" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="48" cy="60" r="1.4" fill="#9BB8DF" />
  </svg>
);

/** 4-point sparkle star */
export const SparkleStar: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-4 h-4',
  color = '#F3EBDD',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="#091525"
    />
  </svg>
);

/** Hand-drawn right arrow */
export const HandArrowRight: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-4',
  color = '#F3EBDD',
}) => (
  <svg viewBox="0 0 28 18" fill="none" className={className} aria-hidden="true">
    <path
      d="M2 9.2C9.5 8.8 17 9.4 24.5 9"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M18.5 3.5C21 5.8 23.5 7.5 25.5 9C23.2 10.8 20.8 12.6 18.5 14.8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Small Cute Chibi Avatar Badge (Navbar, About Me corner, Experience banner)
 * Uses the newly generated consistent chibi portrait framed in a hand-drawn sticker circle (Static)
 */
export const ChibiMiniAvatar: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div
    className={`relative inline-flex overflow-hidden rounded-full border-2 border-[#FAF6EE]/90 bg-[#0B192E] shadow-[0_3px_10px_rgba(3,9,18,0.65)] select-none ${className}`}
  >
    <img
      src={heroChibiImg}
      alt="Uray Fazli Alman Anime Chibi Avatar"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      className="h-full w-full scale-110 object-cover object-[50%_38%]"
    />
  </div>
);

const CHIBI_CRYPTO_TALK_PARTS = [
  {
    partNumber: 1,
    icon: '🍕',
    categoryId: 'Fakta Crypto #1',
    categoryEn: 'Crypto Fact #1',
    textId:
      'Tahukah kamu? Transaksi fisik Bitcoin pertama (22 Mei 2010) dipakai membeli 2 loyang pizza seharga 10.000 BTC!',
    textEn:
      'Did you know? The first real-world Bitcoin tx (May 22, 2010) bought 2 large pizzas for 10,000 BTC!',
  },
  {
    partNumber: 2,
    icon: '🌐',
    categoryId: 'Fakta Web3 #2',
    categoryEn: 'Web3 Fact #2',
    textId:
      'Fakta Web3: Vitalik Buterin menciptakan Ethereum setelah karakter Warlock miliknya di World of Warcraft di-nerf sepihak!',
    textEn:
      'Web3 Fact: Vitalik Buterin created Ethereum after centralized devs nerfed his beloved Warlock in World of Warcraft!',
  },
  {
    partNumber: 3,
    icon: '💎',
    categoryId: 'Meme Crypto #3',
    categoryEn: 'Crypto Meme #3',
    textId:
      'Meme Legendaris: Istilah "HODL" bukan singkatan, tapi salah ketik kata "HOLD" di forum BitcoinTalk tahun 2013!',
    textEn:
      'Crypto Meme: "HODL" wasn’t an acronym—it started as a famous typo for "HOLD" on BitcoinTalk in 2013!',
  },
  {
    partNumber: 4,
    icon: '🐕',
    categoryId: 'Meme & Kultur #4',
    categoryEn: 'Meme & Lore #4',
    textId:
      'Fakta Meme: Dogecoin dibuat cuma 2 jam dari meme anjing Shiba Inu "Kabosu", melahirkan kultur "GM & WAGMI" di Web3!',
    textEn:
      'Meme Fact: Dogecoin was coded in just 2 hours from the "Kabosu" Shiba Inu meme, sparking Web3’s "GM & WAGMI" culture!',
  },
  {
    partNumber: 5,
    icon: '⏳',
    categoryId: 'Psikologi Uang #5',
    categoryEn: 'Money Psych #5',
    textId:
      'Psikologi Uang: Kekayaan sejati di masa depan bukanlah barang mewah yang terlihat, melainkan kebebasan atas waktumu sendiri!',
    textEn:
      'Psychology of Money: True future wealth isn’t the luxury you show off—it’s having complete freedom over your own time!',
  },
  {
    partNumber: 6,
    icon: '🌱',
    categoryId: 'Psikologi Uang #6',
    categoryEn: 'Money Psych #6',
    textId:
      'Efek Compounding: Mengelola uang untuk masa depan 80% soal kesabaran & emosi tenang, bukan sekadar rumus instan semalam!',
    textEn:
      'Compounding Effect: Building future wealth is 80% patience and calm behavior—not overnight genius formulas!',
  },
  {
    partNumber: 7,
    icon: '🧭',
    categoryId: 'Psikologi Uang #7',
    categoryEn: 'Money Psych #7',
    textId:
      'Masa Depan Finansial: Menabung tanpa alasan spesifik memberimu fleksibilitas menghadapi kejutan masa depan yang tak terduga!',
    textEn:
      'Future Finance: Saving without a specific purchase goal gives you the flexibility to navigate life’s unexpected surprises!',
  },
  {
    partNumber: 8,
    icon: '🛡️',
    categoryId: 'Psikologi Uang #8',
    categoryEn: 'Money Psych #8',
    textId:
      'Kunci Bertahan: Di masa depan, kemampuan bertahan melewati badai pasar jauh lebih berharga daripada mengejar untung sesaat!',
    textEn:
      'Survival Mindset: In the long run, staying resilient through market storms matters far more than chasing quick gains!',
  },
] as const;

const CHIBI_GREETING_BUBBLE = {
  icon: '👋',
  categoryId: 'Halo, Selamat Datang!',
  categoryEn: 'Hey, Welcome!',
  textId:
    'Halo! Selamat datang di jurnal Web3-ku ✨ Klik aku buat fakta acak Crypto & Meme, atau ketuk 2x buat musik Cozy ASMR!',
  textEn:
    'Hi! Welcome to my Web3 journal ✨ Click me for random Crypto & Meme facts, or double-tap for Cozy ASMR music!',
} as const;

function pickRandomBubbleIndex(excludeIndex?: number): number {
  const total = CHIBI_CRYPTO_TALK_PARTS.length;
  if (excludeIndex === undefined || total <= 1) {
    return Math.floor(Math.random() * total);
  }
  const candidates: number[] = [];
  for (let i = 0; i < total; i++) {
    if (i !== excludeIndex) candidates.push(i);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * 1. HERO CHIBI CHARACTER
 * Uses the transparent PNG anime chibi close-up portrait (anime_chibi_hero.png) with bottom-flush framing & gentle float.
 * Automatically shows a Greeting Speech Bubble after the loading screen finishes.
 * Clicking around the Chibi area triggers a random 4-part Crypto, Web3 & Meme Speech Bubble with 2D Rig talking mouth animation.
 * Turning on the Cozy & ASMR backsound also triggers the speech bubble + 2D Rig mouth animation whenever the bubble text appears.
 */
export const HeroChibiCharacter: React.FC<{
  isId?: boolean;
  isDay?: boolean;
  isLoading?: boolean;
}> = ({
  isId = true,
  isDay = false,
  isLoading = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [singleTapHint, setSingleTapHint] = useState(false);
  const [tapBounce, setTapBounce] = useState(false);
  const [rigReady, setRigReady] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubbleMode, setBubbleMode] = useState<'greeting' | 'fact'>('greeting');
  const [bubblePartIdx, setBubblePartIdx] = useState<number>(() =>
    pickRandomBubbleIndex()
  );
  const [typedLength, setTypedLength] = useState(0);
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  const lastTapRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const singleClickTimerRef = useRef<number | null>(null);
  const bubblePartIdxRef = useRef<number>(bubblePartIdx);
  const hasGreetedRef = useRef<boolean>(false);
  const hintTimerRef = useRef<number | null>(null);
  const bounceTimerRef = useRef<number | null>(null);
  const speakingTimerRef = useRef<number | null>(null);
  const autoHideTimerRef = useRef<number | null>(null);
  const greetingDelayTimerRef = useRef<number | null>(null);
  const rigContainerRef = useRef<HTMLDivElement | null>(null);
  const rigInstanceRef = useRef<CharacterRig | null>(null);

  useEffect(() => {
    bubblePartIdxRef.current = bubblePartIdx;
  }, [bubblePartIdx]);

  const currentFactPart =
    CHIBI_CRYPTO_TALK_PARTS[bubblePartIdx] || CHIBI_CRYPTO_TALK_PARTS[0];
  const activeBubbleIcon =
    bubbleMode === 'greeting' ? CHIBI_GREETING_BUBBLE.icon : currentFactPart.icon;
  const fullBubbleCategory =
    bubbleMode === 'greeting'
      ? isId
        ? CHIBI_GREETING_BUBBLE.categoryId
        : CHIBI_GREETING_BUBBLE.categoryEn
      : isId
        ? currentFactPart.categoryId
        : currentFactPart.categoryEn;
  const fullBubbleText =
    bubbleMode === 'greeting'
      ? isId
        ? CHIBI_GREETING_BUBBLE.textId
        : CHIBI_GREETING_BUBBLE.textEn
      : isId
        ? currentFactPart.textId
        : currentFactPart.textEn;

  const startBubbleTimersAndRig = () => {
    setBubbleOpen(true);
    setTypedLength(0);
    setIsSpeakingNow(true);

    if (rigInstanceRef.current) {
      rigInstanceRef.current.setSpeechBubbleActive(true);
      rigInstanceRef.current.playAnimation('talk');
    }

    if (speakingTimerRef.current !== null) {
      window.clearTimeout(speakingTimerRef.current);
    }
    speakingTimerRef.current = window.setTimeout(() => {
      setIsSpeakingNow(false);
      speakingTimerRef.current = null;
    }, 3600);

    if (autoHideTimerRef.current !== null) {
      window.clearTimeout(autoHideTimerRef.current);
    }
    autoHideTimerRef.current = window.setTimeout(() => {
      setBubbleOpen(false);
      setIsSpeakingNow(false);
      if (rigInstanceRef.current) {
        rigInstanceRef.current.setSpeechBubbleActive(false);
        rigInstanceRef.current.playAnimation('idle');
      }
      autoHideTimerRef.current = null;
    }, 11500);
  };

  const triggerGreetingBubble = () => {
    setBubbleMode('greeting');
    startBubbleTimersAndRig();
  };

  const triggerRigTalking = (partIndex: number) => {
    setBubbleMode('fact');
    setBubblePartIdx(partIndex);
    startBubbleTimersAndRig();
  };

  const closeSpeechBubble = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBubbleOpen(false);
    setIsSpeakingNow(false);
    if (speakingTimerRef.current !== null) {
      window.clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
    if (autoHideTimerRef.current !== null) {
      window.clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    if (rigInstanceRef.current) {
      rigInstanceRef.current.setSpeechBubbleActive(false);
      rigInstanceRef.current.playAnimation('idle');
    }
  };

  // Trigger Greeting Speech Bubble & animation 4 seconds (4000ms) after the Loading Screen finishes
  useEffect(() => {
    if (isLoading || hasGreetedRef.current) return;
    greetingDelayTimerRef.current = window.setTimeout(() => {
      hasGreetedRef.current = true;
      greetingDelayTimerRef.current = null;
      triggerGreetingBubble();
    }, 4000);

    return () => {
      if (greetingDelayTimerRef.current !== null) {
        window.clearTimeout(greetingDelayTimerRef.current);
        greetingDelayTimerRef.current = null;
      }
    };
  }, [isLoading]);

  // Keep 2D Rig speech-bubble mouth animation synced whenever rigReady or bubbleOpen changes
  useEffect(() => {
    if (!rigInstanceRef.current) return;
    rigInstanceRef.current.setSpeechBubbleActive(bubbleOpen);
    if (bubbleOpen) {
      rigInstanceRef.current.playAnimation('talk');
    }
  }, [rigReady, bubbleOpen]);

  // Smooth typewriter text reveal synced with 2D Rig mouth lip-sync
  useEffect(() => {
    if (!bubbleOpen) return;
    setTypedLength(0);
    const totalLen = fullBubbleText.length;
    const stepMs = Math.max(16, Math.min(28, Math.floor(2500 / Math.max(1, totalLen))));
    const interval = window.setInterval(() => {
      setTypedLength((prev) => {
        if (prev >= totalLen) {
          window.clearInterval(interval);
          return totalLen;
        }
        return prev + 2;
      });
    }, stepMs);
    return () => window.clearInterval(interval);
  }, [bubbleOpen, bubbleMode, bubblePartIdx, fullBubbleText]);

  // Initialize Three.js 2D Rig System on mount and dispose cleanly on unmount
  useEffect(() => {
    const containerEl = rigContainerRef.current;
    if (!containerEl) return;

    let cancelled = false;
    const character = new CharacterRig({
      container: containerEl,
      heroImageSrc: heroChibiImg,
      cozyImageSrc: heroChibiCozyImg,
    });
    rigInstanceRef.current = character;

    character
      .init()
      .then(() => {
        if (!cancelled) {
          setRigReady(true);
        }
      })
      .catch(() => {
        // Fallback to static image if WebGL context is unavailable
        if (!cancelled) {
          setRigReady(false);
        }
      });

    return () => {
      cancelled = true;
      character.dispose();
      rigInstanceRef.current = null;
    };
  }, []);

  // Sync Cozy Backsound mode with 2D Rig
  useEffect(() => {
    if (rigInstanceRef.current) {
      rigInstanceRef.current.setCozyMode(isPlaying);
    }
  }, [isPlaying, rigReady]);

  useEffect(() => {
    const unsubscribe = cozyAsmrAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
      if (singleClickTimerRef.current !== null) {
        window.clearTimeout(singleClickTimerRef.current);
      }
      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current);
      }
      if (bounceTimerRef.current !== null) {
        window.clearTimeout(bounceTimerRef.current);
      }
      if (speakingTimerRef.current !== null) {
        window.clearTimeout(speakingTimerRef.current);
      }
      if (autoHideTimerRef.current !== null) {
        window.clearTimeout(autoHideTimerRef.current);
      }
      if (greetingDelayTimerRef.current !== null) {
        window.clearTimeout(greetingDelayTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    cozyAsmrAudio.setMode(isDay ? 'day' : 'night');
  }, [isDay]);

  const handleChibiPress = async () => {
    const now = performance.now();
    const diff = now - lastTapRef.current;
    lastTapRef.current = now;

    // Visual micro-bounce on tap
    setTapBounce(true);
    if (bounceTimerRef.current !== null) {
      window.clearTimeout(bounceTimerRef.current);
    }
    bounceTimerRef.current = window.setTimeout(() => {
      setTapBounce(false);
      bounceTimerRef.current = null;
    }, 180);

    clickCountRef.current += 1;

    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }

    if (clickCountRef.current === 1) {
      // Wait 280ms to verify the user only clicked 1 time (not >1x or spam)
      singleClickTimerRef.current = window.setTimeout(() => {
        if (clickCountRef.current === 1) {
          const nextRandomIdx = pickRandomBubbleIndex(bubblePartIdxRef.current);
          triggerRigTalking(nextRandomIdx);
        }
        clickCountRef.current = 0;
        singleClickTimerRef.current = null;
      }, 280);
    } else {
      // Clicked > 1 time (2x or spam): DO NOT show text bubble (and hide if open)
      closeSpeechBubble();
      setSingleTapHint(false);

      if (clickCountRef.current === 2 && diff > 0 && diff < 340) {
        // Exact 2x rapid press toggles Cozy & ASMR backsound without showing bubble
        const nextState = await cozyAsmrAudio.toggle(isDay ? 'day' : 'night');
        setIsPlaying(nextState);
      }

      // Reset click counter only after the multi-click / spam burst stops
      singleClickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
        singleClickTimerRef.current = null;
      }, 380);
    }
  };

  const handleCozyBadgeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = await cozyAsmrAudio.toggle(isDay ? 'day' : 'night');
    setIsPlaying(nextState);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleChibiPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleChibiPress();
        }
      }}
      aria-label={
        isId
          ? 'Klik 1x karakter Chibi untuk menampilkan fakta unik Crypto, Web3 & Meme secara acak atau ketuk 2x untuk Cozy ASMR'
          : 'Single-click Chibi character to reveal random Crypto, Web3 & Meme facts or double-tap for Cozy ASMR'
      }
      title={
        isId
          ? 'Klik 1x untuk Fakta Unik Crypto, Web3 & Meme (Acak) • Ketuk 2x untuk Cozy ASMR'
          : 'Single-click for Random Crypto, Web3 & Meme Facts • Double-tap for Cozy ASMR'
      }
      className="group relative mx-auto h-[265px] w-[265px] cursor-pointer overflow-visible touch-manipulation select-none focus:outline-none sm:h-[335px] sm:w-[335px] lg:h-[378px] lg:w-[378px]"
    >
      {/* Compact Random Crypto, Web3, Meme & Greeting Speech Bubble */}
      <AnimatePresence mode="wait">
        {bubbleOpen && (
          <motion.div
            key={`crypto-speech-${bubbleMode}-${bubblePartIdx}`}
            initial={{ opacity: 0, y: 8, scale: 0.9, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.4 }}
            exit={{ opacity: 0, y: 5, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 390, damping: 24 }}
            onClick={(e) => {
              e.stopPropagation();
              handleChibiPress();
            }}
            className=" -top-14 left-1/2 z-40 w-[198px] -translate-x-1/2 sm:-top-16 sm:w-[224px] lg:-top-16 lg:w-[238px] absolute cursor-pointer"
          >
            <div
              className={`relative rounded-xl border-[1.5px] border-[#091526] px-2.5 py-1.5 text-left shadow-[2px_3px_0px_#091526] transition-colors sm:px-3 sm:py-2 ${
                isDay
                  ? 'bg-gradient-to-b from-[#FFFDF7] to-[#FCE9B5] text-[#091526]'
                  : 'bg-[#FAF6EE] text-[#091526]'
              }`}
            >
              {/* Top Header: Category Badge + Close Button */}
              <div className="mb-1 flex items-center justify-between gap-1 border-b border-[#091526]/15 pb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] leading-none sm:text-[11px]">
                    {activeBubbleIcon}
                  </span>
                  <span className="font-journal text-[8px] font-extrabold tracking-wide text-[#B45309] uppercase sm:text-[8.5px]">
                    {fullBubbleCategory}
                  </span>
                  {isSpeakingNow && (
                    <span
                      className="inline-flex items-center gap-0.5 pl-0.5"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-[#E05A47]" />
                      <span className="h-2 w-0.5 animate-bounce rounded-full bg-[#091526]" />
                      <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-[#E05A47]" />
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeSpeechBubble}
                  aria-label={isId ? 'Tutup bubble teks' : 'Close speech bubble'}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#091526]/40 bg-white/70 font-sans text-[8.5px] leading-none font-bold text-[#091526] hover:bg-[#E05A47] hover:text-white sm:h-4 sm:w-4"
                >
                  ×
                </button>
              </div>

              {/* Main Spoken Crypto / Web3 / Meme Fact Text */}
              <p className="min-h-[30px] font-journal text-[9px] leading-[1.32] font-bold !text-[#091526] sm:min-h-[34px] sm:text-[9.5px]">
                {fullBubbleText.slice(0, typedLength)}
                {typedLength < fullBubbleText.length && (
                  <span className="ml-0.5 inline-block h-2.5 w-0.5 animate-pulse bg-[#E05A47] align-middle" />
                )}
              </p>

              {/* Footer Hint to Click for Random Next Part */}
              <div className="mt-1 flex items-center justify-between text-[7.5px] font-bold text-[#091526]/70 sm:text-[8px]">
                <span>
                  {isSpeakingNow
                    ? isId
                      ? '🗣️ Sedang bicara...'
                      : '🗣️ Speaking...'
                    : isId
                      ? '🎲 Mode Acak'
                      : '🎲 Random Mode'}
                </span>
                <span className="text-[#B45309] underline decoration-dotted underline-offset-2">
                  {isId ? 'Klik acak 🎲 →' : 'Click random 🎲 →'}
                </span>
              </div>

              {/* Hand-Drawn Comic Speech Bubble Tail pointing to Chibi head */}
              <svg
                viewBox="0 0 32 20"
                fill="none"
                className="pointer-events-none -bottom-[12px] left-1/2 h-3.5 w-5 -translate-x-1/2 absolute"
                aria-hidden="true"
              >
                <path
                  d="M6 0 L15 16 L25 0 Z"
                  fill={isDay ? '#FCE9B5' : '#FAF6EE'}
                />
                <path
                  d="M6 1 L15 16 L25 1"
                  stroke="#091526"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warm Cozy Glow behind Chibi when Cozy & ASMR soundscape is playing (0% idle CPU) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-6 z-0 rounded-full bg-[radial-gradient(circle,rgba(245,215,142,0.32)_0%,rgba(92,149,236,0.12)_54%,transparent_72%)]"
          />
        )}
      </AnimatePresence>

      {/* Hand-Drawn Musical Notes & ASMR Waves from Earphones when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.28 }}
            className="pointer-events-none absolute inset-0 z-30 overflow-visible"
            aria-hidden="true"
          >
            {/* Left earphone note */}
            <svg
              viewBox="0 0 36 36"
              fill="none"
              className="top-[32%] left-[8%] sm:left-[10%] absolute h-7 w-7 -rotate-6 sm:h-8 sm:w-8"
            >
              <path
                d="M14 25V9L27 6V21"
                stroke={isDay ? '#091526' : '#F5D78E'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="10.5" cy="25.5" rx="4.2" ry="3.2" fill="#F5D78E" stroke="#091321" strokeWidth="1.8" />
              <ellipse
                cx="23.5"
                cy="21.5"
                rx="4.2"
                ry="3.2"
                fill={isDay ? '#E05A47' : '#FAF6EE'}
                stroke="#091321"
                strokeWidth="1.8"
              />
            </svg>

            {/* Right earphone single note */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="top-[30%] right-[10%] sm:right-[12%] absolute h-6 w-6 rotate-6 sm:h-7 sm:w-7"
            >
              <path
                d="M15 24V7C19 8 23 11 23 15"
                stroke={isDay ? '#091526' : '#FAF6EE'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="11.5" cy="24.5" rx="4.2" ry="3.2" fill="#F5D78E" stroke="#091321" strokeWidth="1.8" />
            </svg>

            {/* Cozy ASMR acoustic wave arcs near ears */}
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="top-[52%] left-[3%] sm:left-[5%] absolute h-6 w-6"
            >
              <path d="M26 12C20 16 20 24 26 28" stroke={isDay ? '#B4690E' : '#F5D78E'} strokeWidth="2.3" strokeLinecap="round" />
              <path d="M19 7C10 14 10 26 19 33" stroke={isDay ? '#091526' : '#FAF6EE'} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>

            {/* Cute Hand-Drawn Anime Cozy Expression Bubble near top-right of head */}
            <div
              className={`cozy-asmr-bubble top-[15%] right-[5%] sm:top-[16%] sm:right-[7%] absolute flex -rotate-4 items-center gap-1 whitespace-nowrap rounded-full border-[1.5px] border-[#091526] px-2 py-0.5 font-journal text-[8.5px] leading-tight font-bold text-[#091526] shadow-[2px_2px_0px_#091526] sm:text-[9.5px] ${
                isDay
                  ? 'bg-gradient-to-b from-[#FFFDF8] to-[#FCE8B0]'
                  : 'bg-[#FAF6EE]'
              }`}
            >
              <span className="text-[9px] text-[#1E6B34]">{isDay ? '☀️' : '🌙'}</span>
              <span className="text-[#E05A47]">^◡^</span>
              <span className="!text-[#091526]">
                {isDay
                  ? isId
                    ? 'Cozy Siang ♪'
                    : 'Cozy Day ♪'
                  : isId
                    ? 'Cozy Malam ♪'
                    : 'Cozy Night ♪'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-full w-full overflow-hidden">
        <div
          className={`relative h-full w-full transition-transform duration-150 ${
            !rigReady && tapBounce ? 'scale-[0.97]' : 'scale-100'
          }`}
        >
          {/* Hand-drawn comic burst ticks framing the chibi head */}
          <svg
            viewBox="0 0 540 480"
            fill="none"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            aria-hidden="true"
          >
            <g
              stroke={
                isDay
                  ? isPlaying
                    ? '#B4690E'
                    : '#091526'
                  : isPlaying
                    ? '#F5D78E'
                    : '#FAF6EE'
              }
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <path d="M72 48C78 56 80 58 88 56M82 44C80 52 78 54 70 58" />
              <path d="M22 158L36 163M19 170L34 171M23 182L36 178" />
              <path d="M486 194L501 188M488 206L505 205M486 217L501 222" />
            </g>
          </svg>

          {/* Interactive Three.js 2.5D Rig Canvas Container */}
          <div
            ref={rigContainerRef}
            className={`relative z-10 h-full w-full transition-opacity duration-200 ${
              rigReady ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Zero-Latency Static Fallback while WebGL initializes or if WebGL is unavailable */}
          {!rigReady && (
            <>
              <img
                src={heroChibiImg}
                alt="Uray Fazli Alman Anime Chibi Web3 Explorer"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                className={`pointer-events-none absolute inset-0 mx-auto block h-full w-full object-contain object-bottom transition-opacity duration-300 ${
                  isPlaying ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img
                src={heroChibiCozyImg}
                alt="Uray Fazli Alman Anime Chibi Enjoying Cozy ASMR Music"
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                aria-hidden={!isPlaying}
                className={`pointer-events-none absolute inset-0 mx-auto block h-full w-full object-contain object-bottom transition-opacity duration-300 ${
                  isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          )}
        </div>
      </div>

      {/* Compact Hand-Drawn Status Badge at Bottom Center of Chibi */}
      <div className="absolute right-0 bottom-1.5 left-0 z-30 flex justify-center">
        <button
          type="button"
          onClick={handleCozyBadgeClick}
          className={`cozy-asmr-card ${
            isPlaying ? 'cozy-asmr-card-active' : ''
          } inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border-[1.5px] px-2.5 py-0.5 font-journal text-[9px] leading-tight font-bold transition-all sm:px-3 sm:py-0.5 sm:text-[10px] ${
            isDay
              ? isPlaying
                ? 'border-[#091526] bg-gradient-to-b from-[#FFFDF4] to-[#FCE5A2] !text-[#091526] shadow-[2px_2.5px_0px_#091526]'
                : 'border-[#091526] bg-gradient-to-b from-[#FFFFFF] to-[#F6ECDA] !text-[#091526] shadow-[2px_2.5px_0px_#091526] group-hover:border-[#B4690E] group-hover:from-[#FFFDF6] group-hover:to-[#FCEBC0] group-hover:!text-[#8C4F04]'
              : isPlaying
                ? 'border-[#F5D78E] bg-[#091526]/95 text-[#F5D78E] shadow-[2px_2.5px_0px_#030913]'
                : 'border-[#FAF6EE]/85 bg-[#091526]/90 text-[#FAF6EE] shadow-[2px_2.5px_0px_#030913] group-hover:border-[#F5D78E] group-hover:text-[#F5D78E]'
          }`}
        >
          <span className="text-[9.5px] leading-none">
            {bubbleOpen ? '🎲' : isDay ? '☀️' : '🌙'}
          </span>
          <span className={isDay ? '!text-[#B4690E]' : 'text-[#F5D78E]'}>
            {bubbleOpen ? `#${bubblePartIdx + 1}` : '♪'}
          </span>
          <span
            className={
              isDay
                ? '!text-[#091526] group-hover:!text-[#8C4F04]'
                : isPlaying
                  ? 'text-[#F5D78E]'
                  : 'text-[#FAF6EE] group-hover:text-[#F5D78E]'
            }
          >
            {singleTapHint
              ? isId
                ? 'Ketuk 1x lagi...'
                : 'Tap 1x more...'
              : isPlaying
                ? isDay
                  ? isId
                    ? 'Cozy ASMR Siang: ON'
                    : 'Cozy ASMR Day: ON'
                  : isId
                    ? 'Cozy ASMR Malam: ON'
                    : 'Cozy ASMR Night: ON'
                : bubbleOpen
                  ? isId
                    ? `Fakta #${bubblePartIdx + 1} • Klik Chibi Acak`
                    : `Fact #${bubblePartIdx + 1} • Click Chibi Random`
                  : isId
                    ? 'Klik Chibi: Fakta Crypto • Cozy ♪'
                    : 'Click Chibi: Crypto Facts • Cozy ♪'}
          </span>
        </button>
      </div>
    </div>
  );
};

/**
 * 2. ABOUT ME OVERLAPPING CHIBI
 * Uses the transparent PNG About Me anime chibi illustration (anime_chibi_about.png) with bottom-flush framing
 */
export const AboutMeOverlapChibi: React.FC = () => (
  <div className="relative mx-auto h-[172px] w-[172px] overflow-hidden select-none sm:h-[206px] sm:w-[206px] lg:h-[228px] lg:w-[228px]">
    <div className="relative h-full w-full">
      {/* Hand-drawn comic burst lines on left & right */}
      <svg
        viewBox="0 0 320 300"
        fill="none"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      >
        <g stroke="#091526" strokeWidth="2.6" strokeLinecap="round">
          <path d="M18 58L30 64M28 46L34 58M12 72L26 72" />
          <path d="M10 148L22 152M8 160L21 160" />
        </g>
        <g stroke="#091526" strokeWidth="2.6" strokeLinecap="round">
          <path d="M294 46L284 56M280 36L283 49" />
        </g>
      </svg>

      <img
        src={aboutChibiImg}
        alt="Uray Fazli Alman About Me Anime Chibi"
        loading="lazy"
        decoding="async"
        draggable={false}
        referrerPolicy="no-referrer"
        className="mx-auto block h-full w-full object-contain object-bottom"
      />
    </div>
  </div>
);

/**
 * 3. EXPERIENCE SECTION NODE OPERATOR CHIBI SCENE
 * Uses the transparent PNG Node Operator anime chibi illustration (anime_chibi_node.png)
 */
export const NodeOperatorChibiScene: React.FC = () => (
  <div className="relative mx-auto w-full max-w-[285px] select-none sm:max-w-[335px] lg:max-w-[375px]">
    <img
      src={nodeOperatorImg}
      alt="Anime Chibi Node Operator with Server Racks and Laptop"
      loading="lazy"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      className="mx-auto block h-auto w-full object-contain"
    />
  </div>
);

/**
 * 4. CONTACT SECTION LEFT CHIBI PORTRAIT
 * Uses the transparent PNG anime chibi illustration (anime_chibi_walker.png) with bottom-flush framing
 */
export const BackpackWalkerChibi: React.FC = () => (
  <div className="relative flex h-[126px] w-[120px] shrink-0 items-end justify-center overflow-hidden select-none sm:h-[146px] sm:w-[138px] lg:h-[164px] lg:w-[154px]">
    <img
      src={backpackWalkerImg}
      alt="Anime Chibi Explorer looking toward contact section"
      loading="lazy"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      className="-mb-0.5 block h-full w-full object-contain object-bottom"
    />
  </div>
);

/**
 * 5. CONTACT SECTION FAR-RIGHT PEEKING CHIBI
 * Uses the transparent PNG Peeking Bottom anime chibi illustration (anime_chibi_peeking.png) anchored flush to bottom
 */
export const PeekingBottomChibi: React.FC = () => (
  <div className="relative flex h-[126px] w-[124px] shrink-0 items-end justify-center overflow-hidden select-none sm:h-[146px] sm:w-[144px] lg:h-[164px] lg:w-[162px]">
    <img
      src={peekingBottomImg}
      alt="Anime Chibi explorer peeking over the bottom edge"
      loading="lazy"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      className="-mb-0.5 block h-full w-full object-contain object-bottom"
    />
  </div>
);

/** Statistic Card Icons (About Me Right 2x2 Grid) */
export const StatShieldBadge: React.FC = () => (
  <svg viewBox="0 0 56 56" fill="none" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" aria-hidden="true">
    <circle cx="28" cy="28" r="24" fill="#D8CBF8" stroke="#091321" strokeWidth="2.4" />
    <path d="M28 9V12M15 16L17 18M41 16L39 18" stroke="#141F36" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M28 14L17 19V27.5C17 35.5 21.8 41.2 28 43.5C34.2 41.2 39 35.5 39 27.5V19L28 14Z"
      fill="#EDE6FC"
      stroke="#141F36"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M28 21L29.8 25.2L34.2 25.6L30.8 28.5L31.8 32.8L28 30.5L24.2 32.8L25.2 28.5L21.8 25.6L26.2 25.2L28 21Z"
      stroke="#141F36"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const StatNodeBadge: React.FC = () => (
  <svg viewBox="0 0 56 56" fill="none" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" aria-hidden="true">
    <circle cx="28" cy="28" r="24" fill="#FAD4C0" stroke="#091321" strokeWidth="2.4" />
    <circle cx="28" cy="28" r="10.5" fill="#FFF0E6" stroke="#141F36" strokeWidth="2.4" />
    <path d="M14 37L42 19M36 18L42 19L40 25" stroke="#141F36" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 19L20 21M37 36L39 38" stroke="#141F36" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const StatCubeBadge: React.FC = () => (
  <svg viewBox="0 0 56 56" fill="none" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" aria-hidden="true">
    <circle cx="28" cy="28" r="24" fill="#F2CEF0" stroke="#091321" strokeWidth="2.4" />
    <path
      d="M28 14L40 21V35L28 42L16 35V21L28 14Z"
      fill="#FCEBFB"
      stroke="#141F36"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M16 21L28 28L40 21M28 28V42" stroke="#141F36" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 17.5L34 24.5M34 17.5L22 24.5" stroke="#141F36" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const StatRocketBadge: React.FC = () => (
  <svg viewBox="0 0 56 56" fill="none" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" aria-hidden="true">
    <circle cx="28" cy="28" r="24" fill="#FBE8C2" stroke="#091321" strokeWidth="2.4" />
    <path
      d="M35 16C28 16 22 21 20 28L16 32L21 35L24 39L28 36C35 34 40 28 40 21C40 18 38 16 35 16Z"
      fill="#FFF7E6"
      stroke="#141F36"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <circle cx="31" cy="25" r="2.8" fill="#141F36" />
    <path d="M16 38C18 36 20 36 21 39C18 40 16 40 16 38Z" stroke="#141F36" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="20" cy="19" r="1.5" fill="#141F36" />
  </svg>
);

/** Experience Section Network Icons */
export const AptosNetworkIcon: React.FC = () => (
  <svg viewBox="0 0 54 54" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
    <circle cx="27" cy="27" r="23" fill="#F5F7FA" stroke="#081322" strokeWidth="2.2" />
    <path
      d="M8 18H22L26 14H44M6 27H18L23 23H36L40 27H48M8 36H26L31 32H45"
      stroke="#0A1628"
      strokeWidth="4.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SeiNetworkIcon: React.FC = () => (
  <svg viewBox="0 0 54 54" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
    <circle cx="27" cy="27" r="23" fill="#E0534C" stroke="#081322" strokeWidth="2.2" />
    <path
      d="M12 22C17 17 22 17 27 22C32 27 37 27 42 22M12 32C17 27 22 27 27 32C32 37 37 37 42 32"
      stroke="#091526"
      strokeWidth="4.2"
      strokeLinecap="round"
    />
  </svg>
);

export const SubQueryNetworkIcon: React.FC = () => (
  <svg viewBox="0 0 54 54" fill="none" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true">
    <defs>
      <linearGradient id="sq-grad" x1="6" y1="6" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F86F7" />
        <stop offset="100%" stopColor="#E65C9C" />
      </linearGradient>
    </defs>
    <circle cx="27" cy="27" r="23" fill="url(#sq-grad)" stroke="#081322" strokeWidth="2.2" />
    <path
      d="M35 20C32.5 16.5 28.5 15 24 16C18.5 17.2 15 22.5 16 28.5C17 34.5 22.5 38.5 28.5 37.5C33.5 36.8 37 33 37.5 28H27"
      stroke="#081322"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 20C32.5 16.5 28.5 15 24 16C18.5 17.2 15 22.5 16 28.5C17 34.5 22.5 38.5 28.5 37.5C33.5 36.8 37 33 37.5 28H27"
      stroke="#F5F7FA"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Activity Card 1 Illustration: Parachute Airdrop + Gold Coin */
export const AirdropParachuteIllustration: React.FC = () => (
  <svg viewBox="0 0 92 114" fill="none" className="h-15 w-12 shrink-0 select-none sm:h-17 sm:w-14 xl:h-20 xl:w-16" aria-hidden="true">
    <path
      d="M10 46C10 20 26 6 46 6C66 6 82 20 82 46C72 42 62 44 58 48C52 43 40 43 34 48C30 44 20 42 10 46Z"
      fill="#F2F6FC"
      stroke="#091321"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path
      d="M46 6C36 16 32 30 34 48C40 43 52 43 58 48C60 30 56 16 46 6Z"
      fill="#4D88E5"
      stroke="#091321"
      strokeWidth="2.8"
    />
    <path d="M46 6V45" stroke="#091321" strokeWidth="2.4" />
    <path d="M16 46L36 78M34 48L42 78M58 48L50 78M76 46L56 78" stroke="#DCE7F7" strokeWidth="2" strokeLinecap="round" />
    <rect x="31" y="76" width="30" height="26" rx="4" fill="#B57C4A" stroke="#091321" strokeWidth="3" />
    <path d="M31 87H61M46 76V102" stroke="#6E4423" strokeWidth="2.6" />
    <rect x="42" y="83" width="8" height="8" rx="1.5" fill="#F5D78E" stroke="#091321" strokeWidth="2" />
  </svg>
);

export const GoldBitcoinDoodle: React.FC<{ className?: string }> = ({ className = 'h-10 w-11' }) => (
  <svg viewBox="0 0 52 46" fill="none" className={`select-none ${className}`} aria-hidden="true">
    <path d="M4 16L10 19M2 25L9 25M6 34L12 31" stroke="#FAF6EE" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="30" cy="24" r="15" fill="#E8A838" stroke="#091321" strokeWidth="2.8" />
    <circle cx="30" cy="24" r="11.5" fill="#F4C152" stroke="#9E6514" strokeWidth="1.6" />
    <text x="25.5" y="29.5" fill="#FFF9E6" className="font-brush text-[16px] font-bold">
      B
    </text>
  </svg>
);

/** Hand-drawn Ethereum Diamond Crypto Coin Doodle */
export const EthereumCoinDoodle: React.FC<{ className?: string }> = ({ className = 'h-10 w-11' }) => (
  <svg viewBox="0 0 52 48" fill="none" className={`select-none ${className}`} aria-hidden="true">
    <path d="M46 12L40 16M49 21L42 22M45 31L39 28" stroke="#FAF6EE" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="24" cy="24" r="15.5" fill="#6892D5" stroke="#091321" strokeWidth="2.8" />
    <circle cx="24" cy="24" r="12" fill="#8FB4EE" stroke="#1E3D6B" strokeWidth="1.6" />
    <path
      d="M24 14L30 23.5L24 27L18 23.5L24 14Z"
      fill="#FAF6EE"
      stroke="#091321"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M24 29.5L30 25.5L24 34.5L18 25.5L24 29.5Z"
      fill="#DCE8FA"
      stroke="#091321"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

/** Hand-drawn Solana Crypto Coin Doodle */
export const SolanaCoinDoodle: React.FC<{ className?: string }> = ({ className = 'h-10 w-11' }) => (
  <svg viewBox="0 0 52 48" fill="none" className={`select-none ${className}`} aria-hidden="true">
    <path d="M5 14L11 17M3 24L9 24M6 33L12 30" stroke="#F5D78E" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="28" cy="24" r="15.5" fill="#1D3557" stroke="#091321" strokeWidth="2.8" />
    <circle cx="28" cy="24" r="12" fill="#294B7A" stroke="#63B3ED" strokeWidth="1.6" />
    <path
      d="M21 19H33L35 16.5H23L21 19ZM23 25.2H35L33 22.7H21L23 25.2ZM21 31.5H33L35 29H23L21 31.5Z"
      fill="#5EEAD4"
      stroke="#091321"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

/** Hand-drawn Meme Coin (Doge / Pepe Gold Token) Doodle */
export const MemeDogeCoinMiniDoodle: React.FC<{ className?: string }> = ({ className = 'h-10 w-11' }) => (
  <svg viewBox="0 0 54 48" fill="none" className={`select-none ${className}`} aria-hidden="true">
    <path d="M47 13L41 16M50 23L43 23M46 33L40 29" stroke="#F5D78E" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="24" cy="24" r="15.5" fill="#DF9A32" stroke="#091321" strokeWidth="2.8" />
    <circle cx="24" cy="24" r="12" fill="#F6CA65" stroke="#9C6312" strokeWidth="1.6" />
    <text x="18.5" y="29.5" fill="#091526" className="font-brush text-[16px] font-bold">
      Ð
    </text>
  </svg>
);

/** Compact Floating Airdrop Parachute Crate Doodle */
export const MiniAirdropParachuteDoodle: React.FC<{ className?: string }> = ({
  className = 'h-12 w-10',
}) => (
  <svg viewBox="0 0 48 58" fill="none" className={`select-none ${className}`} aria-hidden="true">
    <path
      d="M6 24C6 11 14 4 24 4C34 4 42 11 42 24C36 22 31 23 29 25C26 22 22 22 19 25C17 23 12 22 6 24Z"
      fill="#FAF6EE"
      stroke="#091321"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M24 4C19 10 17 16 19 25C22 22 26 22 29 25C31 16 29 10 24 4Z"
      fill="#5C95EC"
      stroke="#091321"
      strokeWidth="2"
    />
    <path d="M10 24L19 39M38 24L29 39M24 23V39" stroke="#CBD8EA" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="16" y="38" width="16" height="14" rx="2.5" fill="#E8A838" stroke="#091321" strokeWidth="2.4" />
    <path d="M16 45H32M24 38V52" stroke="#091321" strokeWidth="1.8" />
  </svg>
);

/** Activity Card 2 Illustration: Cute Shiba Inu Doge Meme Coin */
export const MemeCoinDogeIllustration: React.FC = () => (
  <svg viewBox="0 0 92 92" fill="none" className="h-13 w-13 shrink-0 select-none sm:h-15 sm:w-15 xl:h-17 xl:w-17" aria-hidden="true">
    <circle cx="46" cy="46" r="37" fill="#E5A93B" stroke="#091321" strokeWidth="3.5" />
    <circle cx="46" cy="46" r="32" stroke="#F8D87C" strokeWidth="2" />
    <path
      d="M23 66C23 52 27 38 25 22L39 32C45 30 51 30 57 32L69 20C69 36 71 50 69 66C57 76 37 76 23 66Z"
      fill="#DF9246"
      stroke="#091321"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path d="M27 58C31 50 39 48 46 48C53 48 61 50 65 58C59 70 33 70 27 58Z" fill="#FFF3DF" />
    <ellipse cx="38" cy="40" rx="3" ry="2" fill="#FFF3DF" />
    <ellipse cx="54" cy="40" rx="3" ry="2" fill="#FFF3DF" />
    <ellipse cx="37" cy="45" rx="3.5" ry="4" fill="#101826" />
    <circle cx="38.5" cy="44" r="1.2" fill="#FFFFFF" />
    <ellipse cx="55" cy="45" rx="3.5" ry="4" fill="#101826" />
    <circle cx="56.5" cy="44" r="1.2" fill="#FFFFFF" />
    <ellipse cx="46" cy="52" rx="4" ry="2.8" fill="#101826" />
    <path d="M41 58C44 60.5 49 60.5 52 57.5" stroke="#101826" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

/** Activity Card 3 Illustration: 3 Isometric Blockchain Cubes */
export const TestnetCubesIllustration: React.FC = () => (
  <svg viewBox="0 0 92 92" fill="none" className="h-13 w-13 shrink-0 select-none sm:h-15 sm:w-15 xl:h-17 xl:w-17" aria-hidden="true">
    <circle cx="46" cy="46" r="35" fill="#3B82F6" fillOpacity="0.15" />
    <g transform="translate(28, 10)">
      <path d="M18 2L34 11V29L18 38L2 29V11L18 2Z" fill="#E8F1FF" stroke="#091321" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M2 11L18 20L34 11M18 20V38" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M18 20L34 11V29L18 38V20Z" fill="#63A1F8" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
    </g>
    <g transform="translate(10, 40)">
      <path d="M18 2L34 11V29L18 38L2 29V11L18 2Z" fill="#E8F1FF" stroke="#091321" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M2 11L18 20L34 11M18 20V38" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M18 20L34 11V29L18 38V20Z" fill="#4B89E8" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
    </g>
    <g transform="translate(44, 40)">
      <path d="M18 2L34 11V29L18 38L2 29V11L18 2Z" fill="#E8F1FF" stroke="#091321" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M2 11L18 20L34 11M18 20V38" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M18 20L34 11V29L18 38V20Z" fill="#3B76D6" stroke="#091321" strokeWidth="2.6" strokeLinejoin="round" />
    </g>
  </svg>
);

/** Rocket doodle on far right of Activities */
export const RocketSketchDoodle: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M36 10C28 10 21 15 18 23L12 27L18 31L22 37L26 31C34 28 39 21 39 13C39 11 38 10 36 10Z"
      fill="#1A365D"
      stroke="#F3EBDD"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="29" cy="20" r="3" fill="#F3EBDD" />
    <path d="M12 37C14 34 16 34 17 37C14 38 12 38 12 37Z" stroke="#F5D78E" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/** Hand-drawn Social & Wallet Icons */
export const HandXIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    <path d="M6.5 4L19.5 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const HandGithubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 2.5C6.7 2.5 2.5 6.7 2.5 12C2.5 16.2 5.2 19.7 9 21C9.5 21.1 9.7 20.8 9.7 20.5V18.6C7 19.2 6.5 17.4 6.5 17.4C6 16.3 5.4 16 5.4 16C4.5 15.4 5.5 15.4 5.5 15.4C6.5 15.5 7 16.4 7 16.4C7.9 17.9 9.3 17.5 9.8 17.2C9.9 16.6 10.2 16.1 10.5 15.9C8.3 15.6 6 14.8 6 11.1C6 10 6.4 9.1 7 8.4C6.9 8.1 6.5 7.1 7.1 5.7C7.1 5.7 7.9 5.4 9.7 6.7C10.5 6.5 11.3 6.4 12.1 6.4C12.9 6.4 13.7 6.5 14.5 6.7C16.3 5.4 17.1 5.7 17.1 5.7C17.7 7.1 17.3 8.1 17.2 8.4C17.8 9.1 18.2 10 18.2 11.1C18.2 14.8 15.9 15.6 13.7 15.9C14.1 16.2 14.4 16.9 14.4 17.9V20.5C14.4 20.8 14.6 21.1 15.1 21C18.8 19.7 21.5 16.2 21.5 12C21.5 6.7 17.3 2.5 12 2.5Z"
      fill="currentColor"
    />
  </svg>
);

export const HandEmailIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.15" />
    <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Hand-drawn wavy horizontal divider line */
export const SketchDividerLine: React.FC<{ className?: string }> = ({ className = 'w-full' }) => (
  <svg viewBox="0 0 1440 8" fill="none" preserveAspectRatio="none" className={`h-2 ${className}`} aria-hidden="true">
    <path
      d="M0 4C240 2.2 480 5.8 720 3.8C960 2 1200 5.5 1440 3.5"
      stroke="#41618C"
      strokeOpacity="0.55"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Hand-Drawn Sketchbook Card Corner Marks & Pencil Cross-Hatch Accents
 * Gives cards an authentic hand-inked illustration look with zero CPU overhead.
 */
export const HandDrawnCardCornerDoodles: React.FC<{
  variant?: 'default' | 'exp' | 'tape';
}> = ({ variant = 'default' }) => {
  const strokeColor = variant === 'exp' ? '#F5D78E' : '#FAF6EE';
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-visible select-none" aria-hidden="true">
      {variant === 'tape' && (
        <svg
          viewBox="0 0 64 22"
          fill="none"
          className="-top-2.5 left-1/2 absolute h-4 w-13 -translate-x-1/2 -rotate-2 opacity-85"
        >
          <path
            d="M4 4L59 2L62 8L58 14L61 19L5 20L2 14L6 9Z"
            fill="#F5E6C8"
            fillOpacity="0.88"
            stroke="#091526"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 7L10 16M52 6L50 15" stroke="#8C765A" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      )}
      {/* Top-Left Hand-Inked Bracket & Hatch Marks */}
      <svg
        viewBox="0 0 34 34"
        fill="none"
        className="top-1.5 left-1.5 absolute h-5 w-5 opacity-60 transition-opacity group-hover:opacity-95"
      >
        <path
          d="M3 21C2.5 11 4 5 11 3.5C15 2.6 19 3.2 23 3"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M5 10L10 5M7 14L14 7" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      </svg>

      {/* Bottom-Right Hand-Inked Sketch Hatch Marks */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="right-1.5 bottom-1.5 absolute h-5 w-5 opacity-55 transition-opacity group-hover:opacity-95"
      >
        <path
          d="M33 14C33.5 24 31.5 30 24 32C19 33 14 32.5 11 33"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M23 31L31 23M18 31L30 19M27 32L32 27"
          stroke="#F5D78E"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

