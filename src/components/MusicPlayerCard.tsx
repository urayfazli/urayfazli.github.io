import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Music, Radio, ChevronDown, ListMusic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface Track {
  id: string;
  title: string;
  artist: string;
  network: string;
  badgeColor: string;
  durationSec: number;
  bpm: number;
  key: string;
  audioUrl?: string;
}

export const TRACKS: Track[] = [
  {
    id: 'aptos-ambient',
    title: 'Aptos Block-STM Parallel',
    artist: 'Move Parallel Synthwave',
    network: 'Aptos Network',
    badgeColor: '#38A169',
    durationSec: 210, // 3:30
    bpm: 85,
    key: 'Eb major',
    audioUrl: '/audio/aptos-ambient.mp3'
  },
  {
    id: 'subquery-chill',
    title: 'SubQuery Indexer Frequency',
    artist: 'GraphQL Chillout Node',
    network: 'SubQuery Network',
    badgeColor: '#DD6B20',
    durationSec: 180, // 3:00
    bpm: 92,
    key: 'F# minor',
    audioUrl: '/audio/subquery-chill.mp3'
  }
];

interface MusicPlayerCardProps {
  compact?: boolean;
  className?: string;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ compact = false, className = '' }) => {
  const { t } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);

  // HTML Audio Element & Web Audio Synth Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [usingSynthFallback, setUsingSynthFallback] = useState(false);
  const [trackDuration, setTrackDuration] = useState<number>(currentTrack.durationSec);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Keep ref updated
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Audio Synth Engine Initialization (Fallback if local MP3 is missing)
  const startSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (synthIntervalRef.current) {
        window.clearInterval(synthIntervalRef.current);
      }

      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const bassNotes = [130.81, 146.83, 164.81, 196.00];

      let beatStep = 0;
      const intervalMs = (60 / currentTrack.bpm) * 500;

      synthIntervalRef.current = window.setInterval(() => {
        if (!isPlayingRef.current || !audioCtxRef.current) return;

        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const currentVol = isMuted ? 0 : volume;

        if (currentVol <= 0) return;

        if (beatStep % 4 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const bassFreq = bassNotes[(beatStep / 4) % bassNotes.length];
          osc.frequency.setValueAtTime(bassFreq, now);

          gain.gain.setValueAtTime(0.12 * currentVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.65);
        }

        if (Math.random() > 0.3) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = beatStep % 2 === 0 ? 'triangle' : 'sine';
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.05 * currentVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.45);
        }

        if (beatStep % 2 === 1) {
          const bufferSize = ctx.sampleRate * 0.04;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 5000;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.015 * currentVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
        }

        beatStep++;
      }, intervalMs);
    } catch {
      // AudioContext fallback handling
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      window.clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Sync Audio Element instance on track change
  useEffect(() => {
    setTrackDuration(currentTrack.durationSec);
    if (currentTrack.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentTrack.audioUrl);
      } else {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.volume = isMuted ? 0 : volume;

      const handleLoadedMetadata = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
          setTrackDuration(Math.floor(audioRef.current.duration));
        }
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          if (!isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
            setTrackDuration(Math.floor(audioRef.current.duration));
          }
        }
      };

      const handleEnded = () => {
        handleNextTrack();
      };

      const handleError = () => {
        // Switch to procedural synth if audio file is not present in /public/audio/ or invalid (e.g. 0 bytes)
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setUsingSynthFallback(true);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('durationchange', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setUsingSynthFallback(true);
        });
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('durationchange', handleLoadedMetadata);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
        }
      };
    } else {
      setUsingSynthFallback(true);
    }
  }, [currentTrackIndex]);

  // Volume & Mute Syncing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Playback control effect
  useEffect(() => {
    if (isPlaying) {
      if (currentTrack.audioUrl && audioRef.current && !usingSynthFallback) {
        stopSynth();
        audioRef.current.play().catch(() => {
          if (audioRef.current) audioRef.current.pause();
          setUsingSynthFallback(true);
          startSynth();
        });
      } else {
        if (audioRef.current) audioRef.current.pause();
        startSynth();
      }

      // Timer fallback for synth mode or tracking
      if (usingSynthFallback) {
        timerRef.current = window.setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= trackDuration) {
              handleNextTrack();
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      stopSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    }

    return () => {
      stopSynth();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, usingSynthFallback, currentTrackIndex, volume, isMuted]);

  const togglePlay = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTime(0);
    setUsingSynthFallback(false);
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = () => {
    setCurrentTime(0);
    setUsingSynthFallback(false);
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setUsingSynthFallback(false);
    setIsPlaying(true);
    setShowTrackList(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && !usingSynthFallback) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className={`custom-card border border-[#E2E8F0] bg-white rounded-lg shadow-2xs overflow-hidden ${className}`}>
      {/* Top Header Bar */}
      <div className="bg-[#1A202C] text-white px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#2B6CB0] flex items-center justify-center text-white shrink-0">
            <Radio className="w-3 h-3 animate-pulse" />
          </div>
          <span className="font-semibold text-xs tracking-wide font-heading">
            {t.musicPlayer?.title || 'Node Ambient Radio'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${isPlaying ? 'bg-[#38A169]/20 text-[#68D391] border border-[#38A169]/40' : 'bg-gray-700 text-gray-300'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#38A169] animate-ping' : 'bg-gray-400'}`}></span>
            <span>{isPlaying ? (t.musicPlayer?.nowPlaying || 'NOW PLAYING') : (t.musicPlayer?.paused || 'PAUSED')}</span>
          </span>

          <button
            onClick={() => setShowTrackList(!showTrackList)}
            className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
            title={t.musicPlayer?.selectTrack || 'Daftar Track'}
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Tracklist Menu */}
      <AnimatePresence>
        {showTrackList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#2D3748] border-b border-[#4A5568] overflow-hidden"
          >
            <div className="p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-2 pb-1">
                {t.musicPlayer?.selectTrack || 'PILIH AMBIENT TRACK'}
              </div>
              {TRACKS.map((track, idx) => {
                const isSelected = currentTrackIndex === idx;
                const displayDuration = isSelected ? trackDuration : track.durationSec;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2B6CB0] text-white font-semibold shadow-2xs'
                        : 'text-gray-200 hover:bg-[#3A4A5E]/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Music className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'opacity-70'}`} />
                      <div className="truncate">
                        <span className="truncate block font-medium">{track.title}</span>
                        <span className="text-[10px] text-gray-300/80 font-normal block truncate">{track.artist}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      {isSelected && isPlaying && (
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-full bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-0.5 h-2/3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-0.5 h-full bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-black/20 text-gray-300'
                      }`}>
                        {formatTime(displayDuration)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Track Info & Player Controls */}
      <div className="p-4 space-y-3.5">
        
        {/* Track Artwork & Info Row */}
        <div className="flex items-center gap-3.5">
          {/* Animated Spinning Record Disc with Pulse Ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full bg-[#2B6CB0]/20"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            <motion.div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#2B6CB0] flex items-center justify-center shadow-xs z-10 overflow-hidden relative"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={
                isPlaying
                  ? { rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }
                  : { duration: 0.5, ease: 'easeOut' }
              }
              style={{
                background: `radial-gradient(circle, #2D3748 0%, #1A202C 100%)`
              }}
            >
              <div className="w-4 h-4 rounded-full bg-[#2B6CB0] border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </motion.div>

            {isPlaying && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#38A169] border-2 border-white z-20 shadow-xs"
              />
            )}
          </div>

          {/* Title, Artist & Network Badge with Smooth Fade/Slide Transition */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: currentTrack.badgeColor }}
                    layoutId="badge-dot"
                  />
                  <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider truncate">
                    {currentTrack.network}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#1A202C] font-heading truncate leading-snug">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-[#718096] truncate mt-0.5">
                  {currentTrack.artist} • {currentTrack.bpm} BPM ({currentTrack.key})
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated Equalizer Frequency Bars */}
          <div className="hidden sm:flex items-end gap-1 h-7 px-1 shrink-0">
            {[0.6, 0.9, 0.4, 0.8, 0.5, 1.0, 0.7].map((heightFactor, i) => (
              <motion.span
                key={i}
                className="w-1 bg-[#2B6CB0] rounded-t"
                animate={{
                  height: isPlaying ? [`${20 * heightFactor}%`, `${100 * heightFactor}%`, `${30 * heightFactor}%`] : '15%',
                  backgroundColor: isPlaying ? '#2B6CB0' : '#A0AEC0'
                }}
                transition={{
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: 'mirror',
                  duration: 0.35 + i * 0.08,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrubbing Progress Bar & Time */}
        <div className="space-y-1">
          <div className="relative group">
            <input
              type="range"
              min={0}
              max={trackDuration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#EDF2F7] accent-[#2B6CB0] rounded-lg cursor-pointer appearance-none transition-all"
              title="Seek track position"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#718096] font-medium font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
        </div>

        {/* Buttons & Volume Controls */}
        <div className="flex items-center justify-between pt-1 gap-2">
          
          {/* Main Playback Buttons with Smooth Scale Physics */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handlePrevTrack}
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={t.musicPlayer?.prev || 'Track Sebelumnya'}
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              className="p-2.5 bg-[#2B6CB0] hover:bg-[#2C5282] text-white rounded-full transition-all shadow-xs cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={isPlaying ? (t.musicPlayer?.pause || 'Jeda') : (t.musicPlayer?.play || 'Putar')}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNextTrack}
              className="p-2 text-[#718096] hover:text-[#1A202C] hover:bg-[#F7FAFC] rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={t.musicPlayer?.next || 'Track Selanjutnya'}
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Volume Slider & Mute Toggle */}
          <div className="flex items-center gap-2 bg-[#F7FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#718096] hover:text-[#1A202C] transition-colors cursor-pointer"
              title={isMuted ? (t.musicPlayer?.unmute || 'Unmute') : (t.musicPlayer?.mute || 'Mute')}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </motion.button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-[#CBD5E0] accent-[#2B6CB0] rounded appearance-none cursor-pointer"
              title="Volume control"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
