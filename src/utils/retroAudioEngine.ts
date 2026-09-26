/**
 * Hybrid 8-Bit & MP3 Audio Engine
 *
 * - Memutar file audio asli (.wav 8-bit & .mp3) dari folder `public/audio/` yang terdaftar di `src/data/backsoundData.ts`
 * - Otomatis fallback ke Web Audio API 8-Bit Chiptune Synthesizer apabila file audio dihapus/tidak ditemukan
 */

import { BACKSOUND_TRACKS, RetroTrack } from '../data/backsoundData';

export type { RetroTrack };
export const RETRO_TRACKS = BACKSOUND_TRACKS;

// Musical note frequencies (Hz) for built-in 8-bit synth
const NOTE_FREQS: Record<string, number> = {
  C2: 65.41,
  E2: 82.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  REST: 0,
};

class RetroAudioEngine {
  private tracks: RetroTrack[] = [...BACKSOUND_TRACKS];
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private usingHtmlAudio = false;
  private failedUrls = new Set<string>();

  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.28; // Default comfortable volume
  private stepInterval: number | null = null;
  private currentStep = 0;
  private isWidgetVisible = true;
  private listeners: Array<() => void> = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master lowpass filter for warm, cozy retro sound (softens harsh square waves)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 2400;

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private stopHtmlAudio() {
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch {
        // Ignore cleanup errors
      }
      this.htmlAudio = null;
    }
    this.usingHtmlAudio = false;
  }

  private tryStartHtmlAudio(track: RetroTrack): boolean {
    const src = track.audioSrc;
    if (!src || this.failedUrls.has(src)) {
      this.usingHtmlAudio = false;
      return false;
    }

    try {
      this.stopHtmlAudio();
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = this.volume;
      audio.preload = 'auto';

      const handleFallback = () => {
        this.failedUrls.add(src);
        if (this.htmlAudio === audio) {
          this.stopHtmlAudio();
          this.notify();
        }
      };

      audio.addEventListener('error', handleFallback, { once: true });

      this.htmlAudio = audio;
      this.usingHtmlAudio = true;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          handleFallback();
        });
      }
      return true;
    } catch {
      this.usingHtmlAudio = false;
      return false;
    }
  }

  // Play a single 8-bit chiptune beep/note
  private playPulseNote(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainLevel = 0.18,
    decay = 0.85
  ) {
    if (!this.ctx || !this.filterNode || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Subtle retro vibrato for emotional warmth
    if (type === 'square' && freq > 200) {
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 5.5;
      vibratoGain.gain.value = freq * 0.015;
      vibrato.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + duration);
    }

    // Classic ADSR envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(gainLevel, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(gainLevel * decay * 0.4, now + duration * 0.7);
    noteGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.filterNode);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Subtle 8-bit retro noise snare/hi-hat
  private playNoiseTick(duration = 0.04, isSnare = false) {
    if (!this.ctx || !this.filterNode) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = isSnare ? 'bandpass' : 'highpass';
      noiseFilter.frequency.value = isSnare ? 1200 : 5000;

      const noiseGain = this.ctx.createGain();
      const vol = isSnare ? 0.08 : 0.035;
      noiseGain.gain.setValueAtTime(vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.filterNode);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Fallback
    }
  }

  private step() {
    if (!this.isPlaying) return;

    const track = this.tracks[this.currentTrackIndex];
    const totalSteps = Math.max(1, track.melody.length);
    const stepDuration = 60 / track.bpm / 2; // Sixteenth note step duration

    // Synthesize 8-bit notes only when not playing an HTML5 audio file (.wav / .mp3)
    if (!this.usingHtmlAudio) {
      // 1. Play Lead Melody (Square wave)
      const melodyNote = track.melody[this.currentStep % totalSteps];
      const melodyFreq = NOTE_FREQS[melodyNote] || 0;
      if (melodyFreq > 0) {
        this.playPulseNote(melodyFreq, stepDuration * 0.9, 'square', 0.16);
      }

      // 2. Play Bassline (Triangle wave for authentic warm NES bass)
      const bassNote = track.bass[this.currentStep % totalSteps];
      const bassFreq = NOTE_FREQS[bassNote] || 0;
      if (bassFreq > 0) {
        this.playPulseNote(bassFreq, stepDuration * 1.2, 'triangle', 0.28, 0.9);
      }

      // 3. Play Chord Arpeggios every 4 steps
      const chordIndex = Math.floor((this.currentStep % 16) / 4);
      const chord = track.chords[chordIndex % track.chords.length];
      if (chord && this.currentStep % 2 === 0) {
        const arpNote = chord[(this.currentStep / 2) % chord.length];
        const arpFreq = NOTE_FREQS[arpNote] || 0;
        if (arpFreq > 0) {
          this.playPulseNote(arpFreq, stepDuration * 0.6, 'sine', 0.08);
        }
      }

      // 4. Subtle percussion tick (hi-hat on off-beats, snare on step 4 & 12)
      const beatInBar = this.currentStep % 8;
      if (beatInBar === 4) {
        this.playNoiseTick(0.06, true); // Snare
      } else if (beatInBar % 2 === 0) {
        this.playNoiseTick(0.02, false); // Hi-hat
      }
    }

    this.currentStep = (this.currentStep + 1) % totalSteps;
    this.notify();
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const track = this.tracks[this.currentTrackIndex];
    const stepMs = (60 / track.bpm / 2) * 1000;

    // Play audio file from `public/audio/` synchronously inside user gesture
    this.tryStartHtmlAudio(track);

    // Step timer drives equalizer bars, DJ Bot head-bob, and 8-bit synth fallback
    this.step();
    this.stepInterval = window.setInterval(() => {
      this.step();
    }, stepMs);

    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.stopHtmlAudio();
    if (this.stepInterval !== null) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public nextTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentStep = 0;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentStep = 0;
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.volume;
    }
    this.notify();
  }

  public getVolume() {
    return this.volume;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrack(): RetroTrack {
    return this.tracks[this.currentTrackIndex];
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  public getIsWidgetVisible(): boolean {
    return this.isWidgetVisible;
  }

  public setWidgetVisible(visible: boolean) {
    this.isWidgetVisible = visible;
    this.notify();
  }

  public toggleWidgetVisible() {
    this.isWidgetVisible = !this.isWidgetVisible;
    this.notify();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

// Global singleton instance
export const retroAudio = new RetroAudioEngine();
