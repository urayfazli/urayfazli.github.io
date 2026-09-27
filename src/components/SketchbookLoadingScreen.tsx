import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CrownDoodle,
  PlanetDoodle,
  RocketSketchDoodle,
  SparkleStar,
  ChibiMiniAvatar,
  GENERATED_ASSETS,
} from './SketchIllustrations';
import { Language } from './JournalModals';

interface SketchbookLoadingScreenProps {
  lang: Language;
  onFinish: () => void;
}

export const SketchbookLoadingScreen: React.FC<SketchbookLoadingScreenProps> = ({
  lang,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const isId = lang === 'id';

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Preload all chibi illustration assets in parallel
    Object.values(GENERATED_ASSETS).forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });

    const startTime = performance.now();
    const duration = 3600; // 3.6s balanced multi-stage loading sequence
    let frameId: number;
    let finishTimeoutId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Balanced S-curve with natural stage pacing (no rushing at the start)
      const eased =
        t < 0.35
          ? (t / 0.35) * 0.32
          : t < 0.7
            ? 0.32 + ((t - 0.35) / 0.35) * 0.38
            : 0.7 + (1 - Math.pow(1 - (t - 0.7) / 0.3, 2)) * 0.3;

      const nextVal = Math.min(100, Math.round(eased * 100));
      setProgress((prev) => (prev === nextVal ? prev : nextVal));

      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        finishTimeoutId = window.setTimeout(() => {
          onFinishRef.current();
        }, 550);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimeoutId);
    };
  }, []);

  const stageLabel = isId
    ? progress < 30
      ? 'Menyiapkan Jurnal Eksplorasi Web3...'
      : progress < 65
        ? 'Sinkronisasi Node & Aktivitas On-Chain...'
        : progress < 95
          ? 'Memuat Ilustrasi & Catatan Portofolio...'
          : 'Siap Menjelajahi Ekosistem Web3!'
    : progress < 30
      ? 'Preparing Web3 Adventure Journal...'
      : progress < 65
        ? 'Syncing Nodes & On-Chain Activities...'
        : progress < 95
          ? 'Loading Illustrations & Portfolio Notes...'
          : 'Ready to Explore the Web3 Space!';

  const isNearRip = progress >= 96;

  return (
    <motion.div
      key="sketchbook-loader"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: {
          opacity: 1,
          transition: { duration: 0.95 },
        },
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-auto px-4 text-[#FAF6EE]"
      role="status"
      aria-live="polite"
      aria-label={isId ? 'Memuat Portofolio Web3' : 'Loading Web3 Portfolio'}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP TORN-PAPER HALF (Rips Upward on Exit with Jagged Parchment Fiber Edge)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        variants={{
          initial: { y: '0%', rotate: 0 },
          animate: { y: '0%', rotate: 0 },
          exit: {
            y: ['0%', '-1.5%', '-114%'],
            rotate: [0, -0.4, -1.8],
            transition: {
              duration: 0.92,
              times: [0, 0.14, 1],
              ease: [0.62, 0.02, 0.22, 1],
            },
          },
        }}
        className="pointer-events-none top-0 inset-x-0 absolute z-0 h-[55vh] will-change-transform"
        aria-hidden="true"
      >
        {/* Solid Night Sky Upper Surface */}
        <div className="h-[calc(100%-54px)] w-full bg-[radial-gradient(ellipse_at_50%_75%,#16325B_0%,#091525_65%,#050C17_100%)]">
          <svg viewBox="0 0 1440 480" fill="none" className="h-full w-full opacity-65">
            <circle cx="180" cy="140" r="1.6" fill="#FAF6EE" />
            <circle cx="420" cy="95" r="1.3" fill="#9BB8DF" />
            <circle cx="1060" cy="125" r="1.7" fill="#FAF6EE" />
            <circle cx="1260" cy="230" r="1.4" fill="#9BB8DF" />
          </svg>
        </div>

        {/* Jagged Torn-Paper Bottom Edge of Top Half */}
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="-mt-1 h-[62px] w-full drop-shadow-[0_16px_24px_rgba(2,7,15,0.92)]"
        >
          {/* Exposed Cream Parchment Paper Fiber Strip Along Tear */}
          <path
            d="M0 0H1440V36L1392 58L1348 34L1296 64L1242 38L1188 68L1134 35L1076 62L1022 32L964 66L908 38L852 70L794 34L736 68L678 36L618 72L562 35L504 66L446 34L388 68L332 38L274 65L218 34L162 64L106 36L52 62L0 38Z"
            fill="#EFE5D4"
            stroke="#091526"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Secondary Inner Torn Fiber Highlight */}
          <path
            d="M0 0H1440V24L1392 44L1348 22L1296 49L1242 25L1188 53L1134 22L1076 48L1022 20L964 51L908 25L852 55L794 22L736 53L678 24L618 57L562 22L504 51L446 21L388 53L332 25L274 50L218 22L162 49L106 24L52 48L0 25Z"
            fill="#FAF6EE"
          />
          {/* Dark Navy Main Fill Meeting the Torn Paper Fiber */}
          <path
            d="M0 0H1440V14L1392 32L1348 12L1296 36L1242 15L1188 40L1134 12L1076 35L1022 10L964 38L908 15L852 42L794 12L736 40L678 14L618 44L562 12L504 38L446 11L388 40L332 15L274 37L218 12L162 36L106 14L52 35L0 15Z"
            fill="#091525"
            stroke="#091526"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM TORN-PAPER HALF (Rips Downward on Exit with Matching Jagged Edge)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        variants={{
          initial: { y: '0%', rotate: 0 },
          animate: { y: '0%', rotate: 0 },
          exit: {
            y: ['0%', '1.5%', '114%'],
            rotate: [0, 0.4, 1.8],
            transition: {
              duration: 0.92,
              times: [0, 0.14, 1],
              ease: [0.62, 0.02, 0.22, 1],
            },
          },
        }}
        className="pointer-events-none bottom-0 inset-x-0 absolute z-0 flex h-[55vh] flex-col justify-end will-change-transform"
        aria-hidden="true"
      >
        {/* Jagged Torn-Paper Top Edge of Bottom Half */}
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="-mb-1 h-[62px] w-full drop-shadow-[0_-14px_22px_rgba(2,7,15,0.88)]"
        >
          {/* Exposed Cream Parchment Paper Fiber Strip Along Tear */}
          <path
            d="M0 90H1440V52L1392 28L1348 54L1296 24L1242 50L1188 20L1134 53L1076 26L1022 56L964 22L908 50L852 18L794 54L736 20L678 52L618 16L562 53L504 22L446 54L388 20L332 50L274 23L218 54L162 24L106 52L52 26L0 50Z"
            fill="#E5D8C3"
            stroke="#091526"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Secondary Inner Torn Fiber Highlight */}
          <path
            d="M0 90H1440V64L1392 42L1348 66L1296 38L1242 62L1188 34L1134 65L1076 40L1022 68L964 36L908 62L852 32L794 66L736 34L678 64L618 30L562 65L504 36L446 66L388 34L332 62L274 37L218 66L162 38L106 64L52 40L0 62Z"
            fill="#EFE5D4"
          />
          {/* Dark Navy Main Fill Meeting the Torn Paper Fiber */}
          <path
            d="M0 90H1440V75L1392 55L1348 77L1296 50L1242 74L1188 46L1134 76L1076 52L1022 79L964 48L908 74L852 44L794 77L736 46L678 75L618 42L562 76L504 48L446 77L388 46L332 74L274 49L218 77L162 50L106 75L52 52L0 74Z"
            fill="#091525"
            stroke="#091526"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Solid Night Sky Lower Surface */}
        <div className="h-[calc(100%-54px)] w-full bg-[radial-gradient(ellipse_at_50%_15%,#132A4E_0%,#081322_60%,#050C17_100%)]">
          <svg viewBox="0 0 1440 480" fill="none" className="h-full w-full opacity-65">
            <circle cx="240" cy="240" r="1.5" fill="#9BB8DF" />
            <circle cx="1190" cy="260" r="1.6" fill="#FAF6EE" />
            <circle cx="760" cy="340" r="1.4" fill="#9BB8DF" />
          </svg>
        </div>
      </motion.div>

      {/* Seamless Dark Cover Mask Over Center Seam Until Rip Starts (96%+ or Exit) */}
      <motion.div
        variants={{
          initial: { opacity: 1 },
          animate: { opacity: isNearRip ? 0 : 1 },
          exit: { opacity: 0, transition: { duration: 0.08 } },
        }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none inset-x-0 top-1/2 absolute z-[1] h-24 -translate-y-1/2 bg-[#091525]"
        aria-hidden="true"
      />

      {/* Floating Cosmic Sketch Doodles & Center Pinned Torn-Paper Card (Rips Upward with Top Sheet on Exit) */}
      <motion.div
        variants={{
          initial: { y: 0, rotate: 0, scale: 1, opacity: 1 },
          animate: { y: 0, rotate: 0, scale: 1, opacity: 1 },
          exit: {
            y: [0, -14, -460],
            rotate: [0, -2, -7],
            scale: [1, 1.02, 0.9],
            opacity: [1, 1, 0],
            transition: {
              duration: 0.86,
              times: [0, 0.16, 1],
              ease: [0.6, 0.04, 0.2, 1],
            },
          },
        }}
        className="relative z-10 w-full max-w-md will-change-transform"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-6, 4, -6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="-top-12 left-4 sm:-left-6 pointer-events-none absolute z-10"
        >
          <PlanetDoodle className="h-12 w-18 sm:h-14 sm:w-20" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="-top-10 right-4 sm:-right-4 pointer-events-none absolute z-10"
        >
          <RocketSketchDoodle className="h-9 w-9 sm:h-11 sm:w-11" />
        </motion.div>

        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="-bottom-6 left-8 pointer-events-none absolute z-10"
        >
          <SparkleStar className="h-4 w-4" />
        </motion.div>

        {/* Central Pinned Torn-Parchment Paper Card */}
        <motion.div
          style={{ transformOrigin: '50% 8px' }}
          initial={{ opacity: 0, y: 20, scale: 0.94, rotate: -3.5 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: [-3.5, 1.6, -1.1, 0.5, -0.8],
          }}
          transition={{
            opacity: { duration: 0.4 },
            y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            rotate: { duration: 1.4, ease: 'easeOut' },
          }}
          className="relative px-7 pt-10 pb-8 text-center text-[#091526] sm:px-10 sm:pt-11 sm:pb-9"
        >
          {/* Hand-Drawn Pushpin (Pin Paku Payung) Anchored at Top Center */}
          <div
            className="pointer-events-none -top-5 left-1/2 absolute z-30 -translate-x-1/2 select-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 68 68"
              fill="none"
              className="h-14 w-14 drop-shadow-[0_6px_8px_rgba(5,12,22,0.55)] sm:h-16 sm:w-16"
            >
              {/* Cast Shadow of Pin on Torn Paper */}
              <ellipse cx="38" cy="54" rx="11" ry="4.5" fill="#091526" fillOpacity="0.24" />
              <path
                d="M34 52L48 44"
                stroke="#091526"
                strokeOpacity="0.22"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Puncture Hole Ring in Paper */}
              <ellipse
                cx="33"
                cy="53"
                rx="4.5"
                ry="2.2"
                fill="#091526"
                stroke="#C4B299"
                strokeWidth="1.2"
              />
              {/* Metallic Pin Needle Piercing Paper */}
              <path
                d="M33 36L33 53"
                stroke="#CBD8EA"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M31.5 36L31.5 52.5M34.5 36L34.5 52.5"
                stroke="#091526"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Pushpin Lower Collar / Base */}
              <ellipse
                cx="33"
                cy="34"
                rx="13"
                ry="6"
                fill="#C94A38"
                stroke="#091526"
                strokeWidth="2.6"
              />
              {/* Pushpin Cylinder Body */}
              <path
                d="M24 19L22 33C22 36 44 36 44 33L42 19Z"
                fill="#E05A47"
                stroke="#091526"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              {/* Pushpin Top Cap */}
              <ellipse
                cx="33"
                cy="17"
                rx="15"
                ry="7.5"
                fill="#F26D5B"
                stroke="#091526"
                strokeWidth="2.8"
              />
              {/* Gold/Cream Specular Highlight on Pin Cap */}
              <path
                d="M23 15.5C26 13 33 12.5 39 14"
                stroke="#FAF6EE"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="42" cy="17" r="1.5" fill="#F5D78E" />
            </svg>
          </div>

          {/* True Irregular Torn-Paper SVG Background with Deckled Edges & Side Tear Notches */}
          <svg
            viewBox="0 0 520 430"
            fill="none"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full drop-shadow-[0_22px_42px_rgba(2,7,15,0.88)]"
            aria-hidden="true"
          >
            {/* Dark Offset Paper Shadow Layer */}
            <path
              d="M22 24L58 17L98 25L142 16L194 23L246 15L298 22L352 15L402 24L454 17L496 26L506 62L497 104L508 148L490 176L507 204L498 252L506 302L496 352L504 396L474 414L428 404L384 417L338 405L290 418L244 402L198 417L152 405L104 416L58 404L20 412L12 368L22 320L11 272L26 242L10 212L19 162L11 114L20 66Z"
              fill="#050D1A"
              opacity="0.55"
              transform="translate(6, 10)"
            />

            {/* Main Torn Parchment Sheet with Jagged Deckled Edges */}
            <path
              d="M22 24L58 17L98 25L142 16L194 23L246 15L298 22L352 15L402 24L454 17L496 26L506 62L497 104L508 148L490 176L507 204L498 252L506 302L496 352L504 396L474 414L428 404L384 417L338 405L290 418L244 402L198 417L152 405L104 416L58 404L20 412L12 368L22 320L11 272L26 242L10 212L19 162L11 114L20 66Z"
              fill="#EFE5D4"
              stroke="#091526"
              strokeWidth="4"
              strokeLinejoin="round"
              filter="url(#torn-paper-edge)"
            />

            {/* Exposed White/Cream Inner Paper Fiber Along Torn Edges */}
            <path
              d="M30 32L488 32L492 392L28 396Z"
              fill="#E5D8C3"
              opacity="0.42"
              filter="url(#torn-paper-edge)"
            />

            {/* Subtle Sketchbook Ruled Journal Lines & Crease Marks */}
            <path
              d="M38 110H482M36 175H484M38 240H480M36 305H482"
              stroke="#8C765A"
              strokeOpacity="0.14"
              strokeWidth="1.2"
              strokeDasharray="6 6"
            />
            {/* Torn V-Notch Crease Details on Left & Right Edges */}
            <path
              d="M26 242L42 248M490 176L474 182M244 402L248 386"
              stroke="#091526"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating Crown + Chibi Explorer Badge */}
          <div className="relative mx-auto flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CrownDoodle className="mb-1 h-6 w-8" color="#091526" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-full border-2 border-[#091526] bg-[#091526] p-1.5 shadow-md"
            >
              <ChibiMiniAvatar className="h-16 w-16 sm:h-20 sm:w-20" />
            </motion.div>
          </div>

          {/* Journal Title & Subtitle */}
          <div className="mt-3.5">
            <span className="font-journal text-[11px] font-bold tracking-wider text-[#233F6B] uppercase">
              Web3 Portfolio • Explorer Journal
            </span>
            <h2 className="mt-0.5 font-brush text-3xl leading-none tracking-wide text-[#091526] sm:text-4xl">
              URAY FAZLI ALMAN
            </h2>

            {/* Hand-drawn underline */}
            <svg
              viewBox="0 0 180 10"
              fill="none"
              className="mx-auto mt-1 h-2.5 w-36 sm:w-44"
              aria-hidden="true"
            >
              <path
                d="M4 6C60 2 120 2 176 5.5"
                stroke="#091526"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Role summary tags */}
          <p className="mt-2 font-journal text-xs font-semibold text-[#182F50] sm:text-[13px]">
            Node Operator • Airdrop Hunter • Meme Coin Trader • Testnet Explorer
          </p>

          {/* Hand-Drawn Sketchbook Progress Bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between font-journal text-xs font-bold text-[#091526]">
              <span className="truncate pr-2">{stageLabel}</span>
              <span className="font-mono-num shrink-0 text-xs font-bold text-[#091526] tabular-nums">
                {progress}%
              </span>
            </div>

            <div className="relative h-3.5 w-full overflow-hidden rounded-full border-2 border-[#091526] bg-[#091526]/15 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#091526] via-[#1B3964] to-[#091526]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Motto + Instant Skip Action */}
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#091526]/25 pt-3 text-[11px]">
            <span className="font-journal font-bold text-[#233F6B]">
              — Small Steps • Big Bags —
            </span>
            <button
              type="button"
              onClick={onFinish}
              className="cursor-pointer font-journal font-bold text-[#091526] underline decoration-dashed underline-offset-4 transition-colors hover:text-[#2A4B78]"
            >
              {isId ? 'Lewati →' : 'Skip →'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
