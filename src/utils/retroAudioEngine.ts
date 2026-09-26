/**
 * Hybrid 8-Bit & MP3 Audio Engine
 *
 * - Memutar file audio asli (.wav 8-bit & .mp3) dari folder `public/audio/` yang terdaftar di `src/data/backsoundData.ts`
 * - Mendukung Pause/Resume akurat tanpa race-condition (`AbortError` safe) serta sistem pemutaran acak (Shuffle / Random Backsound)
 * - Otomatis fallback ke Web Audio API 8-Bit Chiptune Synthesizer apabila file audio dihapus/tidak ditemukan
 */

import { BACKSOUND_TRACKS, RetroTrack } from '../data/backsoundData';

export type { RetroTrack };
export const RETRO_TRACKS = BACKSOUND_TRACKS;

export type CharacterSfxType =
  | 'coder'
  | 'sentry'
  | 'forge'
  | 'droid-aptos'
  | 'droid-sei'
  | 'droid-subquery'
  | 'messenger'
  | 'dj-bot'
  | 'hero'
  | 'boot-unit';

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
  private htmlAudioTrackId: string | null = null;
  private usingHtmlAudio = false;
  private failedUrls = new Set<string>();

  private isPlaying = false;
  private isShuffle = true; // Default aktif: sistem pemutaran acak (shuffle)
  private shuffleBag: number[] = [];
  private currentTrackIndex = Math.floor(Math.random() * BACKSOUND_TRACKS.length);
  private volume = 0.28; // Default comfortable volume
  private stepInterval: number | null = null;
  private currentStep = 0;
  private synthTickCount = 0;
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
      this.ctx.resume().catch(() => {
        // Ignore autoplay suspension outside gesture
      });
    }
  }

  private clearStepTimer() {
    if (this.stepInterval !== null) {
      window.clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
  }

  private destroyHtmlAudio() {
    if (this.htmlAudio) {
      try {
        this.htmlAudio.onended = null;
        this.htmlAudio.onerror = null;
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch {
        // Ignore cleanup errors
      }
      this.htmlAudio = null;
    }
    this.htmlAudioTrackId = null;
    this.usingHtmlAudio = false;
  }

  private pauseHtmlAudio() {
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
      } catch {
        // Ignore pause errors
      }
    }
  }

  private tryStartOrResumeHtmlAudio(track: RetroTrack): boolean {
    const src = track.audioSrc;
    if (!src || this.failedUrls.has(src)) {
      this.destroyHtmlAudio();
      return false;
    }

    // Resume existing audio element if it is already loaded for this exact track
    if (this.htmlAudio && this.htmlAudioTrackId === track.id) {
      this.htmlAudio.volume = this.volume;
      this.htmlAudio.loop = false;
      this.usingHtmlAudio = true;

      const resumePromise = this.htmlAudio.play();
      if (resumePromise !== undefined) {
        resumePromise.catch((err: unknown) => {
          // Do NOT treat pause() interruption (AbortError) as a broken file!
          const errName = err instanceof DOMException ? err.name : '';
          if (errName === 'AbortError' || !this.isPlaying) {
            return;
          }
          this.failedUrls.add(src);
          this.destroyHtmlAudio();
          this.notify();
        });
      }
      return true;
    }

    try {
      this.destroyHtmlAudio();
      const audio = new Audio(src);
      audio.loop = false; // Disable single-track loop so ended event triggers next/random track
      audio.volume = this.volume;
      audio.preload = 'auto';

      audio.onerror = () => {
        if (this.htmlAudio !== audio) return;
        this.failedUrls.add(src);
        this.destroyHtmlAudio();
        this.notify();
      };

      audio.onended = () => {
        if (this.htmlAudio !== audio || !this.isPlaying) return;
        this.nextTrack();
      };

      this.htmlAudio = audio;
      this.htmlAudioTrackId = track.id;
      this.usingHtmlAudio = true;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          const errName = err instanceof DOMException ? err.name : '';
          // Ignore AbortError when user clicks Pause while play() promise is still resolving
          if (errName === 'AbortError' || !this.isPlaying || this.htmlAudio !== audio) {
            return;
          }
          this.failedUrls.add(src);
          this.destroyHtmlAudio();
          this.notify();
        });
      }
      return true;
    } catch {
      this.usingHtmlAudio = false;
      return false;
    }
  }

  /**
   * Smart non-repeating random index generator (Fisher-Yates bag)
   * Ensures every track is visited in random order without repeating the same song back-to-back.
   */
  private getNextRandomTrackIndex(): number {
    const count = this.tracks.length;
    if (count <= 1) return 0;

    // Filter out currentTrackIndex from remaining bag if possible
    this.shuffleBag = this.shuffleBag.filter((idx) => idx >= 0 && idx < count);

    if (this.shuffleBag.length === 0) {
      const candidates: number[] = [];
      for (let i = 0; i < count; i++) {
        if (i !== this.currentTrackIndex) {
          candidates.push(i);
        }
      }
      // Fisher-Yates shuffle
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = temp;
      }
      this.shuffleBag = candidates;
    }

    const nextIdx = this.shuffleBag.pop();
    if (nextIdx === undefined || nextIdx === this.currentTrackIndex) {
      return (this.currentTrackIndex + 1) % count;
    }
    return nextIdx;
  }

  // Play a single 8-bit chiptune beep/note
  private playPulseNote(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    gainLevel = 0.18,
    decay = 0.85
  ) {
    if (!this.isPlaying || !this.ctx || !this.filterNode || freq <= 0) return;

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
    if (!this.isPlaying || !this.ctx || !this.filterNode) return;
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

      this.synthTickCount += 1;
      // Auto-advance synth fallback after 4 full pattern loops
      if (this.synthTickCount >= totalSteps * 4) {
        this.synthTickCount = 0;
        this.nextTrack();
        return;
      }
    }

    this.currentStep = (this.currentStep + 1) % totalSteps;
    this.notify();
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;

    this.clearStepTimer();
    this.isPlaying = true;

    const track = this.tracks[this.currentTrackIndex];
    const stepMs = (60 / track.bpm / 2) * 1000;

    // Play or resume audio file from `public/audio/` synchronously inside user gesture
    this.tryStartOrResumeHtmlAudio(track);

    // Step timer drives equalizer bars, DJ Bot head-bob, and 8-bit synth fallback
    this.step();
    this.stepInterval = window.setInterval(() => {
      this.step();
    }, stepMs);

    this.notify();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.clearStepTimer();
    this.pauseHtmlAudio();

    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {
        // Ignore suspend errors
      });
    }

    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.clearStepTimer();
    this.destroyHtmlAudio();
    this.currentStep = 0;
    this.synthTickCount = 0;

    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {
        // Ignore suspend errors
      });
    }

    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  public nextTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();

    if (this.isShuffle) {
      this.currentTrackIndex = this.getNextRandomTrackIndex();
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    }

    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    const wasPlaying = this.isPlaying;
    this.stop();

    if (this.isShuffle) {
      this.currentTrackIndex = this.getNextRandomTrackIndex();
    } else {
      this.currentTrackIndex =
        (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    }

    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public playRandomTrack() {
    this.stop();
    this.currentTrackIndex = this.getNextRandomTrackIndex();
    this.start();
  }

  public selectTrack(index: number) {
    if (index < 0 || index >= this.tracks.length) return;
    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentTrackIndex = index;
    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.isShuffle) {
      this.shuffleBag = [];
    }
    this.notify();
  }

  public getIsShuffle() {
    return this.isShuffle;
  }

  public getTracks(): RetroTrack[] {
    return this.tracks;
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
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

  private sfxCtx: AudioContext | null = null;

  private getSfxContext(): AudioContext | null {
    try {
      if (!this.sfxCtx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.sfxCtx = new AudioCtx();
      }
      if (this.sfxCtx.state === 'suspended') {
        this.sfxCtx.resume().catch(() => {});
      }
      return this.sfxCtx;
    } catch {
      return null;
    }
  }

  /**
   * Play a bespoke, signature retro sound effect when any animated character is pressed/clicked.
   * Uses a dedicated SFX AudioContext so character sound effects work whether BGM is playing or paused.
   */
  public playCharacterSfx(character: CharacterSfxType) {
    const ctx = this.getSfxContext();
    if (!ctx) return;

    const sfxVol = Math.max(0.16, Math.min(0.45, this.volume > 0 ? this.volume * 1.15 : 0.25));
    const now = ctx.currentTime;

    const scheduleTone = (
      startFreq: number,
      endFreq: number,
      offsetSec: number,
      durationSec: number,
      wave: OscillatorType = 'square',
      gainMult = 1
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(startFreq, now + offsetSec);
      if (endFreq !== startFreq) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(20, endFreq),
          now + offsetSec + durationSec
        );
      }

      const peak = sfxVol * gainMult;
      gain.gain.setValueAtTime(0.0001, now + offsetSec);
      gain.gain.linearRampToValueAtTime(peak, now + offsetSec + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offsetSec + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offsetSec);
      osc.stop(now + offsetSec + durationSec + 0.015);
    };

    switch (character) {
      case 'coder': {
        // DEV-UNIT 01 (About Me Coder): Tactile mechanical key clacks + cheerful compile arpeggio
        scheduleTone(180, 90, 0, 0.035, 'triangle', 0.7);
        scheduleTone(220, 110, 0.045, 0.035, 'triangle', 0.7);
        scheduleTone(523.25, 523.25, 0.09, 0.07, 'square', 0.55); // C5
        scheduleTone(659.25, 659.25, 0.16, 0.07, 'square', 0.6); // E5
        scheduleTone(783.99, 783.99, 0.23, 0.08, 'square', 0.65); // G5
        scheduleTone(1046.5, 1046.5, 0.31, 0.14, 'triangle', 0.8); // C6
        break;
      }

      case 'sentry': {
        // SENTRY-99 (Node Operations Mech): Radar sonar sweep + dual laser lock-on ping
        scheduleTone(340, 880, 0, 0.14, 'sine', 0.75);
        scheduleTone(1318.5, 1318.5, 0.15, 0.065, 'square', 0.5); // E6 ping
        scheduleTone(1760.0, 1760.0, 0.23, 0.12, 'square', 0.55); // A6 lock-on
        break;
      }

      case 'forge': {
        // FORGE-03 (Experience Block-Keeper): Isometric anvil strike + harmonic block-mint chord
        scheduleTone(240, 110, 0, 0.06, 'sawtooth', 0.65);
        scheduleTone(587.33, 587.33, 0.06, 0.09, 'triangle', 0.7); // D5
        scheduleTone(880.0, 880.0, 0.14, 0.1, 'square', 0.55); // A5
        scheduleTone(1174.66, 1174.66, 0.23, 0.16, 'triangle', 0.8); // D6
        break;
      }

      case 'droid-aptos': {
        // Aptos Aero-Sprinter Droid: High-TPS supersonic turbo zip + emerald chirp
        scheduleTone(320, 1280, 0, 0.11, 'sawtooth', 0.55);
        scheduleTone(987.77, 1318.5, 0.12, 0.1, 'square', 0.6);
        break;
      }

      case 'droid-sei': {
        // Sei Twin-Turbo Parallel Bot: Dual-core parallel electric synth pulse
        scheduleTone(440, 880, 0, 0.08, 'square', 0.55);
        scheduleTone(659.25, 1318.5, 0.02, 0.09, 'triangle', 0.6);
        scheduleTone(1174.66, 880, 0.11, 0.09, 'square', 0.55);
        break;
      }

      case 'droid-subquery': {
        // SubQuery Indexer Owl-Bot: Analytical robo-owl double hoot + data telemetry blip
        scheduleTone(620, 480, 0, 0.09, 'sine', 0.85);
        scheduleTone(660, 510, 0.11, 0.11, 'sine', 0.85);
        scheduleTone(1480, 1480, 0.24, 0.05, 'square', 0.45);
        break;
      }

      case 'messenger': {
        // COURIER-7 (Connect Messenger Bot): Friendly two-tone radio whistle + message chime
        scheduleTone(587.33, 880, 0, 0.1, 'sine', 0.8);
        scheduleTone(783.99, 1174.66, 0.11, 0.12, 'triangle', 0.8);
        scheduleTone(1567.98, 1567.98, 0.24, 0.1, 'sine', 0.65);
        break;
      }

      case 'dj-bot': {
        // DJ BEAT-BOT (RetroAudioPlayer): Vinyl pitch-bend scratch + funky 8-bit boop
        scheduleTone(290, 740, 0, 0.075, 'sawtooth', 0.6);
        scheduleTone(740, 380, 0.075, 0.06, 'sawtooth', 0.55);
        scheduleTone(523.25, 659.25, 0.14, 0.09, 'square', 0.65);
        scheduleTone(783.99, 1046.5, 0.23, 0.12, 'triangle', 0.75);
        break;
      }

      case 'hero': {
        // Hero Main Chibi Character: Warm 8-bit star power-up fanfare
        scheduleTone(440, 440, 0, 0.07, 'square', 0.55); // A4
        scheduleTone(554.37, 554.37, 0.07, 0.07, 'square', 0.55); // C#5
        scheduleTone(659.25, 659.25, 0.14, 0.07, 'square', 0.6); // E5
        scheduleTone(880, 1108.73, 0.21, 0.16, 'triangle', 0.8); // A5 -> C#6
        break;
      }

      case 'boot-unit': {
        // Loading Screen UNIT-00 Operator: Crisp system ready chirp
        scheduleTone(493.88, 739.99, 0, 0.08, 'square', 0.55);
        scheduleTone(987.77, 987.77, 0.09, 0.12, 'triangle', 0.7);
        break;
      }
    }
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
