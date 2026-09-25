import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { retroAudio } from '../utils/retroAudioEngine';
import { RetroCassetteDoodle, RetroSpeakerDoodle } from './Doodles';

export const RetroAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(retroAudio.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState(retroAudio.getCurrentTrack());
  const [volume, setVolume] = useState(retroAudio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(retroAudio.getIsWidgetVisible());
  const [step, setStep] = useState(0);

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
    retroAudio.setWidgetVisible(true);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
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
            {/* 1. Expanded Retro Cassette Player Box */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="mb-2 p-3 sm:p-3.5 rounded-2xl bg-[#101723]/98 border border-[#9d613c]/50 shadow-2xl shadow-black/80 backdrop-blur-xl w-[285px] sm:w-[315px] text-[#fbeee0]"
                >
                  {/* Header: Title bar, Minimize & Hide actions */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9d613c] animate-pulse" />
                      <span className="font-mono text-[11px] font-bold tracking-wider text-[#9d613c] uppercase">
                        RETRO BGM PLAYER
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Minimize button (collapses into pill) */}
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="text-[#a39483] hover:text-[#fbeee0] p-1 rounded-md hover:bg-white/5 cursor-pointer text-xs"
                        title="Minimize to pill"
                        aria-label="Minimize"
                      >
                        ▲
                      </button>

                      {/* Hide Widget Completely button */}
                      <button
                        type="button"
                        onClick={handleHideWidget}
                        className="text-[#a39483] hover:text-[#ef4444] p-1 rounded-md hover:bg-white/5 cursor-pointer text-xs flex items-center gap-1"
                        title="Hide widget completely"
                        aria-label="Hide widget"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Track Info Display */}
                  <div className="px-2.5 py-2 rounded-xl bg-[#090d14] border border-white/5 mb-3 flex items-center justify-between">
                    <div className="overflow-hidden">
                      <div className="font-fredoka text-sm text-[#fbeee0] font-medium truncate flex items-center gap-1.5">
                        <span>{currentTrack.title}</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#9d613c] truncate">
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
                            className="w-1 bg-gradient-to-t from-[#9d613c] to-[#fbeee0] rounded-t-sm"
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
                      className="p-2 rounded-xl bg-[#141c28] hover:bg-[#1f2b3e] text-[#fbeee0] border border-white/5 active:scale-95 transition-transform cursor-pointer"
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
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#9d613c] to-[#b97746] hover:brightness-110 active:scale-95 text-white font-mono text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-[#9d613c]/30 cursor-pointer transition-all"
                      title={isPlaying ? 'Pause retro music' : 'Play retro music'}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                          <span>PAUSE</span>
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
                      className="p-2 rounded-xl bg-[#141c28] hover:bg-[#1f2b3e] text-[#fbeee0] border border-white/5 active:scale-95 transition-transform cursor-pointer"
                      title="Next Track"
                      aria-label="Next track"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Volume Slider Bar */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleMuteToggle}
                      className="text-[#a39483] hover:text-white cursor-pointer shrink-0"
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
                      className="w-full h-1 bg-[#182333] rounded-lg appearance-none cursor-pointer accent-[#9d613c]"
                    />
                    <span className="font-mono text-[10px] text-[#a39483] w-7 text-right">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  {/* Bottom discreet hide link */}
                  <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#786a5d] font-mono">
                    <span>Web Audio 8-bit Synth</span>
                    <button
                      type="button"
                      onClick={handleHideWidget}
                      className="text-[#a39483] hover:text-[#fbeee0] hover:underline cursor-pointer"
                    >
                      Hide widget (✕)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Docked Compact Pill with Quick-Hide button */}
            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                onClick={() => {
                  if (!isPlaying && !isExpanded) {
                    retroAudio.start();
                  }
                  setIsExpanded(!isExpanded);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer ${
                  isPlaying
                    ? 'bg-[#141c28] border-[#9d613c] text-[#fbeee0] shadow-[#9d613c]/20'
                    : 'bg-[#101723]/90 border-white/15 text-[#a39483] hover:text-[#fbeee0] hover:border-[#9d613c]/50'
                }`}
                title="Retro Backsound Music Player (Click to expand)"
                aria-label="Toggle Retro Backsound Player"
              >
                <RetroCassetteDoodle
                  className={`w-4 h-4 ${
                    isPlaying ? 'text-[#9d613c]' : 'text-[#a39483]'
                  }`}
                />

                {/* Animated miniature equalizer inside button */}
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-3 w-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          height: `${((step + i * 2) % 4) * 25 + 25}%`,
                          transition: 'height 0.12s ease-out',
                        }}
                        className="w-0.5 bg-[#9d613c] rounded-t-xs"
                      />
                    ))}
                  </div>
                ) : null}

                <span className="font-mono text-xs font-medium max-w-[130px] sm:max-w-[170px] truncate">
                  {isPlaying ? currentTrack.title : '♫ Retro BGM'}
                </span>

                {/* Expand / Collapse Indicator */}
                <span className="text-[10px] opacity-60">
                  {isExpanded ? '▼' : '▲'}
                </span>
              </motion.button>

              {/* Dedicated Hide '✕' Button on the minimized pill */}
              <motion.button
                type="button"
                onClick={handleHideWidget}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-full bg-[#101723]/80 border border-white/10 text-[#a39483] hover:text-[#ef4444] hover:border-[#ef4444]/50 flex items-center justify-center text-xs backdrop-blur-sm cursor-pointer transition-colors shadow-md"
                title="Hide widget completely"
                aria-label="Hide BGM widget"
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* 3. Discreet Mini Restore Pill when widget is hidden */
          <motion.div
            key="hidden-restore-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center"
          >
            <motion.button
              type="button"
              onClick={handleShowWidget}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#101723]/70 hover:bg-[#141c28] border border-white/10 hover:border-[#9d613c]/60 text-[#a39483] hover:text-[#fbeee0] text-xs font-mono backdrop-blur-sm shadow-md cursor-pointer transition-all"
              title="Show Retro BGM Player widget"
              aria-label="Restore BGM Player Widget"
            >
              <RetroCassetteDoodle className="w-3.5 h-3.5 text-[#9d613c] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] opacity-75 group-hover:opacity-100">
                {isPlaying ? '♫ Playing' : 'Show BGM'}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    // If widget was hidden, restore it to view so the user has full controls!
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
