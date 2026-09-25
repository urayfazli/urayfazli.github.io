import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { retroAudio } from '../utils/retroAudioEngine';
import { RetroCassetteDoodle, RetroSpeakerDoodle, DoodleTape } from './Doodles';
import { useLanguage } from '../context/LanguageContext';

/**
 * Rigged Multi-Part Animated DJ Character for the BGM Widget Button
 * Grooves, bobs head, spins turntable, and emits floating musical notes when playing;
 * reacts playfully when dragged across the screen.
 */
const BGMCharacterAvatar: React.FC<{
  isPlaying: boolean;
  isExpanded: boolean;
  isDragging: boolean;
  step: number;
}> = ({ isPlaying, isExpanded, isDragging, step }) => {
  return (
    <div className="relative w-20 h-22 sm:w-24 sm:h-25 flex items-center justify-center pointer-events-none select-none">
      {/* Floating Musical Notes when Playing */}
      <AnimatePresence>
        {isPlaying && (
          <>
            <motion.span
              key="note-1"
              initial={{ opacity: 0, y: 6, x: -12, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-2, -26],
                x: [-14, -24],
                rotate: [-12, -25],
                scale: [0.7, 1.1, 0.8],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              className="absolute top-1 left-2 font-hand text-base sm:text-lg text-[#e59b63] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20"
            >
              ♪
            </motion.span>
            <motion.span
              key="note-2"
              initial={{ opacity: 0, y: 6, x: 12, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-4, -30],
                x: [14, 26],
                rotate: [10, 24],
                scale: [0.7, 1.15, 0.85],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.8,
                delay: 0.6,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute top-0 right-1 font-hand text-base sm:text-lg text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-20"
            >
              ♫
            </motion.span>
          </>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 110 115"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
        fill="none"
      >
        {/* Ground Shadow (shrinks slightly when lifted/dragged) */}
        <motion.ellipse
          cx="55"
          cy="108"
          rx="34"
          ry="5"
          fill="#05080D"
          animate={
            isDragging
              ? { scaleX: 0.7, opacity: 0.4 }
              : { scaleX: 1, opacity: 0.75 }
          }
        />

        {/* Ambient Pulse Ring on Ground when Playing */}
        {isPlaying && (
          <motion.ellipse
            cx="55"
            cy="108"
            rx="34"
            ry="5"
            stroke="#22C55E"
            strokeWidth="1.5"
            animate={{ scaleX: [0.9, 1.25, 0.9], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}

        {/* Torso & Mini DJ Boombox Deck */}
        <motion.g
          animate={
            isDragging
              ? { y: -6, rotate: -4 }
              : isPlaying
              ? { y: [0, -2.5, 0], rotate: 0 }
              : { y: [0, -1, 0], rotate: 0 }
          }
          transition={{
            duration: isPlaying ? 0.45 : 2,
            repeat: isDragging ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Cute Chibi Feet (dangle when dragged!) */}
          <motion.rect
            x="36"
            y="96"
            width="12"
            height="9"
            rx="4.5"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="1.8"
            animate={isDragging ? { y: [-2, 3, -2], rotate: [-8, 8, -8] } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.35, repeat: isDragging ? Infinity : 0 }}
          />
          <motion.rect
            x="62"
            y="96"
            width="12"
            height="9"
            rx="4.5"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="1.8"
            animate={isDragging ? { y: [3, -2, 3], rotate: [8, -8, 8] } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.35, repeat: isDragging ? Infinity : 0 }}
          />

          {/* Hoodie Body */}
          <path
            d="M30 66C30 60 35 56 41 56H69C75 56 80 60 80 66L83 96H27L30 66Z"
            fill="#162233"
            stroke="#FBEEE0"
            strokeWidth="2"
          />

          {/* Front Chest Boombox / Turntable Deck */}
          <rect
            x="31"
            y="72"
            width="48"
            height="22"
            rx="5"
            fill="#0B1018"
            stroke="#E59B63"
            strokeWidth="1.8"
          />

          {/* Left Speaker Woofer */}
          <motion.circle
            cx="41"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            animate={isPlaying ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: Infinity }}
          />
          <circle cx="41" cy="83" r="2" fill="#E59B63" />

          {/* Center Mini Equalizer / Cassette Window */}
          <rect
            x="50"
            y="78"
            width="10"
            height="10"
            rx="2"
            fill="#101824"
            stroke="#9D613C"
            strokeWidth="1.2"
          />
          <line
            x1="52.5"
            y1="86"
            x2="52.5"
            y2={isPlaying ? (step % 2 === 0 ? '80' : '84') : '84'}
            stroke="#22C55E"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="55"
            y1="86"
            x2="55"
            y2={isPlaying ? (step % 3 === 0 ? '79' : '83') : '84'}
            stroke="#E59B63"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="57.5"
            y1="86"
            x2="57.5"
            y2={isPlaying ? (step % 2 === 1 ? '80' : '84') : '84'}
            stroke="#22C55E"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Right Speaker Woofer */}
          <motion.circle
            cx="69"
            cy="83"
            r="6"
            fill="#141C28"
            stroke="#FBEEE0"
            strokeWidth="1.5"
            animate={isPlaying ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: Infinity }}
          />
          <circle cx="69" cy="83" r="2" fill="#E59B63" />
        </motion.g>

        {/* Animated Head + Giant DJ Headphones */}
        <motion.g
          animate={
            isDragging
              ? { y: -7, rotate: [-5, 5, -5] }
              : isPlaying
              ? {
                  y: [0, -5, 0],
                  rotate: [-4, 4, -4],
                }
              : {
                  y: [0, -2.5, 0],
                  rotate: [-1, 1, -1],
                }
          }
          transition={{
            duration: isDragging ? 0.35 : isPlaying ? 0.55 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '55px 42px' }}
        >
          {/* Thick Caramel Headphone Band */}
          <path
            d="M19 39C19 17 34 7 55 7C76 7 91 17 91 39"
            stroke="#E59B63"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Top Antenna */}
          <line
            x1="55"
            y1="7"
            x2="55"
            y2="-1"
            stroke="#FBEEE0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <motion.circle
            cx="55"
            cy="-2"
            r="3.8"
            fill={isPlaying ? '#22C55E' : '#E59B63'}
            animate={
              isPlaying
                ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }
                : { scale: [1, 1.1, 1] }
            }
            transition={{ duration: 0.7, repeat: Infinity }}
          />

          {/* Left & Right Cushioned DJ Earcups */}
          <rect
            x="12"
            y="28"
            width="11"
            height="24"
            rx="5.5"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="2"
          />
          <rect
            x="87"
            y="28"
            width="11"
            height="24"
            rx="5.5"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="2"
          />

          {/* Main CRT Head Shell */}
          <rect
            x="22"
            y="14"
            width="66"
            height="46"
            rx="14"
            fill="#FBEEE0"
            stroke="#141C28"
            strokeWidth="2.2"
          />
          <rect
            x="24"
            y="16"
            width="62"
            height="42"
            rx="12"
            fill="none"
            stroke="#9D613C"
            strokeWidth="1.5"
          />

          {/* Dark CRT Face Visor */}
          <rect
            x="29"
            y="21"
            width="52"
            height="32"
            rx="8"
            fill="#090E16"
            stroke="#26364D"
            strokeWidth="1.6"
          />

          {/* Glass Glint */}
          <path
            d="M33 25H43L38 32H32V26C32 25.4 32.4 25 33 25Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />

          {/* Dynamic Visor Face: Surprised/Excited when Dragged vs Jamming vs Idle */}
          {isDragging ? (
            <g>
              {/* Excited Starry/Wide Eyes > < when being dragged */}
              <path
                d="M37 31L45 35L37 39"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M73 31L65 35L73 39"
                stroke="#22C55E"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="55" cy="43" r="3.2" fill="#E59B63" />
            </g>
          ) : isPlaying ? (
            <g>
              {/* Happy Jamming Arcs ^ ^ */}
              <path
                d="M37 35C39.5 30 45 30 47.5 35"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M62.5 35C65 30 70.5 30 73 35"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Warm Blush Cheeks */}
              <rect x="33" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              <rect x="71.5" y="39" width="5.5" height="2.5" rx="1.2" fill="#E59B63" />
              {/* Singing / Jamming Smile */}
              <path
                d="M49 41C51.5 46 58.5 46 61 41"
                stroke="#FBEEE0"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              {/* Blinking Idle LED Eyes */}
              <motion.rect
                x="39"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  times: [0, 0.46, 0.5, 1],
                }}
              />
              <motion.rect
                x="64.5"
                y="30"
                width="6.5"
                height="9.5"
                rx="3.2"
                fill="#E59B63"
                animate={{ scaleY: [1, 1, 0.12, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  times: [0, 0.46, 0.5, 1],
                }}
              />
              {/* Cute Little Smile */}
              <path
                d="M50 43C52 45.5 58 45.5 60 43"
                stroke="#FBEEE0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}
        </motion.g>

        {/* Animated Chibi Hands */}
        <motion.circle
          cx={isPlaying ? 18 : 26}
          cy={isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke="#9D613C"
          strokeWidth="1.8"
          animate={
            isDragging
              ? { y: [-8, -2, -8] }
              : isPlaying
              ? { y: [0, -5, 0], x: [0, 2, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{ duration: isPlaying ? 0.45 : 1.8, repeat: Infinity }}
        />
        <motion.circle
          cx={isPlaying ? 92 : 84}
          cy={isPlaying ? 44 : 78}
          r="5.5"
          fill="#FBEEE0"
          stroke="#9D613C"
          strokeWidth="1.8"
          animate={
            isDragging
              ? { y: [-2, -8, -2] }
              : isPlaying
              ? { y: [-4, 1, -4], x: [0, -2, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{ duration: isPlaying ? 0.45 : 1.8, repeat: Infinity }}
        />

        {/* Small Indicator Badge on Corner */}
        {isExpanded && (
          <circle
            cx="88"
            cy="16"
            r="6"
            fill="#9D613C"
            stroke="#FBEEE0"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
};

const NPC_IDLE_DIALOGUES_ID = [
  'gm ser! Sudah klaim faucet & garap testnet hari ini belum? 💧⛓️',
  'Dompet siap, node validator nyala... tinggal tunggu snapshot airdrop! 🪂✨',
  'Psst... klik aku buat nyalain BGM sambil hunting meme coin 100x! 🐸🚀',
  'Lagi pantau floor price NFT atau sibuk nge-bridge ke testnet baru? 🖼️🌉',
  'Jangan lupa interaksi on-chain biar gak kena filter sybil pas airdrop! 🛡️🪂',
  'Market crypto lagi sideways? Santai, nyalain musik 8-bit dulu ser! 🎧📈',
  'HODL keras atau minting NFT gratis nih? Klik aku buat drop the beat! 💎🙌',
];

const NPC_IDLE_DIALOGUES_EN = [
  'gm ser! Have you claimed your faucet & farmed testnets today? 💧⛓️',
  'Wallet ready, validator node synced... just waiting for the airdrop snapshot! 🪂✨',
  'Psst... click me to play 8-bit BGM while hunting 100x meme coins! 🐸🚀',
  'Watching NFT floor prices or bridging to a new incentivized testnet? 🖼️🌉',
  'Keep those on-chain txns active so you never miss the next big airdrop! 🛡️🪂',
  'Crypto market crabbing? Chill out and turn on some chiptune beats! 🎧📈',
  'Diamond-handing or free-minting NFTs today? Click me to drop the beat! 💎🙌',
];

const getNpcPlayDialogues = (trackTitle: string, bpm: number, lang: 'id' | 'en') =>
  lang === 'id'
    ? [
        `🎵 Spin: ${trackTitle} (${bpm} BPM) — musik wajib para pemburu airdrop! 🪂`,
        'Vibes 8-bit bikin garap task testnet & klaim faucet makin anti-ngantuk! 💧⚡',
        'Meme coin boleh pump & dump, tapi uptime node validator tetap 99.9%! 🐸🔥',
        'Sambil dengerin beat ini, semoga wallet kamu JP airdrop tier S+! 🪂💰',
        'Gas fee lagi murah nih ser, waktunya mint NFT & push transaksi testnet! 🖼️⛽',
        'WAGMI! Mau market bullish atau bearish, chiptune harus tetap jalan! 🚀🎶',
        'Klik aku kalau mau ganti lagu buat nemenin analisa chart crypto kamu! 📊🎹',
      ]
    : [
        `🎵 Spinning: ${trackTitle} (${bpm} BPM) — official soundtrack for airdrop hunters! 🪂`,
        '8-bit synth vibes make grinding testnet tasks & faucets 10x faster! 💧⚡',
        'Meme coins may pump & dump, but validator uptime stays locked at 99.9%! 🐸🔥',
        'Manifesting an S-tier airdrop allocation for your wallet while this beat plays! 🪂💰',
        'Gas fees are low ser—perfect time to mint NFTs & push testnet txns! 🖼️⛽',
        'WAGMI! Bull market or bear market, the 8-bit chiptune never stops! 🚀🎶',
        'Click me anytime to switch tracks while watching your crypto charts! 📊🎹',
      ];

export const RetroAudioPlayer: React.FC = () => {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(retroAudio.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState(retroAudio.getCurrentTrack());
  const [volume, setVolume] = useState(retroAudio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(retroAudio.getIsWidgetVisible());
  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Interactive NPC Dialogue State (Idle vs Play modes + Typewriter effect)
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [npcTalkBounce, setNpcTalkBounce] = useState(false);

  // Full-viewport constraint ref so the user can drag the widget anywhere on screen
  const viewportConstraintsRef = useRef<HTMLDivElement>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    const unsubscribe = retroAudio.subscribe(() => {
      setIsPlaying(retroAudio.getIsPlaying());
      setCurrentTrack(retroAudio.getCurrentTrack());
      setVolume(retroAudio.getVolume());
      setIsWidgetVisible(retroAudio.getIsWidgetVisible());
      setStep(retroAudio.getCurrentStep());
    });
    return unsubscribe;
  }, []);

  // Reset dialogue index to 0 when switching between Play and Idle or changing track
  useEffect(() => {
    setDialogueIndex(0);
  }, [isPlaying, currentTrack.title]);

  // Auto-cycle NPC dialogue every 6.5 seconds
  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setDialogueIndex((prev) => prev + 1);
    }, 6500);
    return () => clearInterval(timer);
  }, [isDragging, isPlaying]);

  const activeDialogues = isPlaying
    ? getNpcPlayDialogues(currentTrack.title, currentTrack.bpm, lang)
    : lang === 'id'
    ? NPC_IDLE_DIALOGUES_ID
    : NPC_IDLE_DIALOGUES_EN;

  const fullDialogueText = isDragging
    ? lang === 'id'
      ? 'Wheee~ terbang keliling jaringan! Lepas di mana aja 🛸✨'
      : 'Wheee~ flying across the network! Drop me anywhere 🛸✨'
    : activeDialogues[dialogueIndex % activeDialogues.length];

  // Classic RPG NPC Typewriter animation
  useEffect(() => {
    let charIndex = 0;
    setTypedText('');
    const typeInterval = setInterval(() => {
      charIndex += 1;
      setTypedText(fullDialogueText.slice(0, charIndex));
      if (charIndex >= fullDialogueText.length) {
        clearInterval(typeInterval);
      }
    }, 24);

    return () => clearInterval(typeInterval);
  }, [fullDialogueText]);

  const handleNextNpcDialogue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragRef.current) return;
    setNpcTalkBounce(true);
    setTimeout(() => setNpcTalkBounce(false), 260);
    setDialogueIndex((prev) => prev + 1);
  };

  const handleToggle = () => {
    retroAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    retroAudio.setVolume(val);
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      retroAudio.setVolume(0);
    } else {
      retroAudio.setVolume(0.28);
    }
  };

  const handleHideWidget = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(false);
    retroAudio.setWidgetVisible(false);
  };

  const handleShowWidget = () => {
    if (didDragRef.current) return;
    retroAudio.setWidgetVisible(true);
  };

  const handleCharacterClick = () => {
    // Ignore click if user was just dragging the character around
    if (didDragRef.current) return;

    if (!isPlaying && !isExpanded) {
      retroAudio.start();
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Full-Viewport Invisible Bounding Box for Omnidirectional Dragging */}
      <div
        ref={viewportConstraintsRef}
        className="fixed inset-2 sm:inset-3 pointer-events-none z-40"
        aria-hidden="true"
      />

      {/* Freely Draggable Widget Container (All Directions X & Y) */}
      <motion.div
        drag
        dragConstraints={viewportConstraintsRef}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => {
          didDragRef.current = true;
          setIsDragging(true);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          setTimeout(() => {
            didDragRef.current = false;
          }, 120);
        }}
        whileDrag={{ scale: 1.05 }}
        className={`fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <AnimatePresence mode="wait">
          {isWidgetVisible ? (
            <motion.div
              key="visible-widget"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="flex flex-col items-start"
            >
              {/* 1. Expanded Retro Cassette Player Doodle Card */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.94, rotate: -1 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: 14, scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="doodle-card mb-3 p-3.5 sm:p-4 w-[285px] sm:w-[315px] text-[#fbeee0] relative"
                  >
                    {/* Top Masking Tape (also works as a visual drag handle) */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg] pointer-events-none z-20">
                      <DoodleTape className="w-20 h-5" />
                    </div>

                    {/* Header: Title bar, Drag Hint, Minimize & Hide actions */}
                    <div className="flex items-center justify-between border-b border-dashed border-[#fbeee0]/20 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-[#e59b63]'
                          }`}
                        />
                        <span className="font-fredoka text-xs font-semibold tracking-wider text-[#fbeee0] uppercase">
                          DJ BEAT-BOT 8-BIT
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setIsExpanded(false)}
                          className="text-[#d6c4b2] hover:text-[#fbeee0] px-1.5 py-0.5 rounded-md hover:bg-white/10 cursor-pointer text-xs font-mono"
                          title="Minimize player"
                          aria-label="Minimize"
                        >
                          ▼
                        </button>

                        <button
                          type="button"
                          onClick={handleHideWidget}
                          className="text-[#d6c4b2] hover:text-[#ef4444] px-1.5 py-0.5 rounded-md hover:bg-white/10 cursor-pointer text-xs font-mono"
                          title="Minimize DJ character"
                          aria-label="Hide widget"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Track Info Display */}
                    <div className="px-3 py-2 rounded-xl bg-[#090d14] border-[1.5px] border-dashed border-[#fbeee0]/30 mb-3 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <div className="font-fredoka text-sm text-[#fbeee0] font-medium truncate flex items-center gap-1.5">
                          <span>{currentTrack.title}</span>
                        </div>
                        <div className="font-mono text-[10px] text-[#e59b63] truncate">
                          {currentTrack.genre} · {currentTrack.bpm} BPM
                        </div>
                      </div>

                      {/* Dynamic Equalizer Bars */}
                      <div className="flex items-end gap-1 h-5 w-8 shrink-0 justify-end pl-2">
                        {[0, 1, 2, 3].map((barIdx) => {
                          const barHeights = isPlaying
                            ? [
                                ((step + barIdx * 2) % 4) * 25 + 25,
                                ((step + barIdx * 3) % 4) * 25 + 25,
                                ((step + barIdx) % 4) * 25 + 25,
                                ((step + barIdx * 4) % 4) * 25 + 25,
                              ]
                            : [20, 20, 20, 20];
                          return (
                            <span
                              key={barIdx}
                              style={{
                                height: `${barHeights[barIdx]}%`,
                                transition: 'height 0.12s ease-out',
                              }}
                              className="w-1 bg-gradient-to-t from-[#9d613c] to-[#22c55e] rounded-t-sm"
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => retroAudio.prevTrack()}
                        className="doodle-subcard p-2 text-[#fbeee0] active:scale-95 transition-transform cursor-pointer"
                        title="Previous Track"
                        aria-label="Previous track"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggle}
                        className="flex-1 py-2 px-3 rounded-[14px_10px_15px_11px] bg-[#9d613c] hover:bg-[#b06f44] border-2 border-[#fbeee0] shadow-[3px_3px_0px_#0b1018] active:scale-95 text-[#fbeee0] font-fredoka text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        title={isPlaying ? 'Pause retro music' : 'Play retro music'}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            <span>PAUSE BGM</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>PLAY RETRO BGM</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => retroAudio.nextTrack()}
                        className="doodle-subcard p-2 text-[#fbeee0] active:scale-95 transition-transform cursor-pointer"
                        title="Next Track"
                        aria-label="Next track"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Volume Slider Bar (isolated pointer so dragging slider doesn't move widget) */}
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 pt-1 border-t border-dashed border-[#fbeee0]/15"
                    >
                      <button
                        type="button"
                        onClick={handleMuteToggle}
                        className="text-[#d6c4b2] hover:text-white cursor-pointer shrink-0"
                        title={volume === 0 ? 'Unmute' : 'Mute'}
                        aria-label="Toggle mute"
                      >
                        <RetroSpeakerDoodle className="w-3.5 h-3.5" isMuted={volume === 0} />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume slider"
                        className="w-full h-1.5 bg-[#090d14] rounded-lg appearance-none cursor-pointer accent-[#e59b63]"
                      />
                      <span className="font-mono text-[10px] text-[#d6c4b2] w-7 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2. Draggable Animated DJ Character + Interactive NPC Dialogue Box */}
              <div className="relative flex items-end gap-1.5 group">
                <motion.button
                  type="button"
                  onClick={handleCharacterClick}
                  animate={npcTalkBounce ? { y: -6, scale: 1.06 } : { y: 0, scale: 1 }}
                  whileHover={isDragging ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={isDragging ? undefined : { scale: 0.96 }}
                  className={`relative flex items-center focus:outline-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  title="Click DJ Bot to open BGM deck or drag anywhere!"
                  aria-label="Toggle or drag Retro Backsound Player"
                >
                  <BGMCharacterAvatar
                    isPlaying={isPlaying}
                    isExpanded={isExpanded}
                    isDragging={isDragging}
                    step={step}
                  />
                </motion.button>

                {/* Interactive RPG NPC Speech Bubble (Click to cycle NPC dialogue) */}
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={handleNextNpcDialogue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNextNpcDialogue(e as unknown as React.MouseEvent);
                    }
                  }}
                  initial={{ opacity: 0, x: -6, scale: 0.9 }}
                  animate={
                    npcTalkBounce
                      ? { opacity: 1, x: 0, scale: 1.04, y: -2 }
                      : { opacity: 1, x: 0, scale: 1, y: 0 }
                  }
                  whileHover={isDragging ? undefined : { scale: 1.02 }}
                  title="Klik balon chat untuk dialog NPC berikutnya! 💬"
                  className={`mb-4 px-3 py-2 rounded-[16px_12px_18px_4px] border-2 text-left shadow-[4px_4px_0px_#0b1018] transition-colors duration-300 max-w-[185px] sm:max-w-[225px] cursor-pointer select-none ${
                    isDragging
                      ? 'bg-[#101824]/95 border-[#e59b63] text-[#fbeee0]'
                      : isPlaying
                      ? 'bg-[#101824]/95 border-emerald-400 text-[#fbeee0]'
                      : 'bg-[#101824]/95 border-[#fbeee0] text-[#fbeee0] hover:border-[#e59b63]'
                  }`}
                >
                  {/* Top NPC Header Tag */}
                  <div className="flex items-center justify-between gap-2 mb-0.5 border-b border-dashed border-[#fbeee0]/15 pb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isDragging
                            ? 'bg-[#e59b63] animate-ping'
                            : isPlaying
                            ? 'bg-emerald-400 animate-ping'
                            : 'bg-[#e59b63]'
                        }`}
                      />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#e59b63]">
                        NPC • DJ BOT
                      </span>
                      <span
                        className={`font-mono text-[8px] px-1 py-0.2 rounded ${
                          isPlaying
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-[#d6c4b2]'
                        }`}
                      >
                        {isPlaying ? 'PLAY' : 'IDLE'}
                      </span>
                    </div>

                    <span className="font-mono text-[9px] text-[#a39483] hover:text-[#fbeee0] flex items-center gap-0.5">
                      <span>💬</span>
                      <span>▸</span>
                    </span>
                  </div>

                  {/* Typewriter NPC Dialogue Line */}
                  <p className="font-hand text-xs sm:text-sm leading-snug text-[#fbeee0] min-h-[2.2rem] flex items-center">
                    <span>
                      {typedText}
                      {typedText.length < fullDialogueText.length && (
                        <span className="inline-block w-1 h-3 ml-0.5 bg-[#e59b63] animate-pulse align-middle" />
                      )}
                    </span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* 3. Round & Transparent Restore Button when widget is hidden (also draggable) */
            <motion.button
              key="hidden-restore-badge"
              type="button"
              onClick={handleShowWidget}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-grab active:cursor-grabbing ${
                isPlaying
                  ? 'bg-[#101723]/35 border border-emerald-400/50 text-[#fbeee0] hover:bg-[#101723]/65 hover:border-emerald-400 shadow-[0_4px_16px_rgba(34,197,94,0.2)]'
                  : 'bg-[#101723]/25 border border-[#fbeee0]/25 text-[#fbeee0]/75 hover:text-[#fbeee0] hover:bg-[#101723]/55 hover:border-[#e59b63]/70 shadow-lg'
              }`}
              title={isPlaying ? 'BGM Playing — Click to show DJ Bot' : 'Click to show DJ Bot BGM Player'}
              aria-label="Restore BGM Player Widget"
            >
              <RetroCassetteDoodle
                className={`w-5 h-5 transition-colors ${
                  isPlaying ? 'text-emerald-400' : 'text-[#e59b63]/85'
                }`}
              />
              {isPlaying && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

// Compact Toggle Button for the Navbar (also unhides widget if clicked)
export const RetroNavbarButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(retroAudio.getIsPlaying());

  useEffect(() => {
    const unsubscribe = retroAudio.subscribe(() => {
      setIsPlaying(retroAudio.getIsPlaying());
    });
    return unsubscribe;
  }, []);

  const handleClick = () => {
    if (!retroAudio.getIsWidgetVisible()) {
      retroAudio.setWidgetVisible(true);
    }
    retroAudio.toggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer ${
        isPlaying
          ? 'bg-[#9d613c]/20 border-[#9d613c] text-[#fbeee0] shadow-xs'
          : 'bg-[#141b25]/80 border-white/10 text-[#d7c6b5] hover:border-[#9d613c]/40 hover:text-white'
      }`}
      title={isPlaying ? 'Pause Retro Music' : 'Play Retro Music'}
      aria-label={isPlaying ? 'Pause Retro Music' : 'Play Retro Music'}
    >
      <RetroCassetteDoodle className="w-3.5 h-3.5 text-[#9d613c]" />
      <span className="hidden sm:inline">
        {isPlaying ? 'BGM ON' : 'BGM'}
      </span>
      {isPlaying && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
      )}
    </button>
  );
};
