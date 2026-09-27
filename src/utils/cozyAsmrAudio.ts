// Dual-Mode Procedural Cozy Game ASMR Soundscape Engine
// Mechanism: Each theme mode (Day Mode & Night Mode) has its own dedicated 1-song soundtrack:
//
// ☀️ MODE SIANG (DAY MODE) — "Sunny Cozy Game Village ASMR"
//    Genre: Cozy Game ASMR (Animal Crossing / Fantasy Life / Sunny Town Cafe & Meadow RPG vibe)
//    Layers:
//    1. Bouncy Acoustic Ukulele & Nylon Guitar Strums/Arpeggios (Bright C Major / F Major 8-bar progression @ ~88 BPM)
//    2. Cozy Toy Piano (Celesta) & Glockenspiel Bell Counter-Melody
//    3. Cheerful Daytime Wooden Recorder / Sweet Whistle Flute Lead Melody with Grace Notes
//    4. Sunny Orchard Breeze & Rustling Leaves ASMR Texture
//    5. Binaural Daytime Cozy Game ASMR Micro-Triggers (Morning Finches, Tactile Cozy Game UI Wood-Click & Item Pickup Pop-Bloop, Fountain Splash Droplets, Glass Wind Chimes)
//
// 🌙 MODE MALAM (NIGHT MODE) — "Starlight Cozy Farm Night ASMR"
//    Genre: Nocturnal Cozy Farming Sim RPG (Stardew Valley Night / Harvest Moon Lullaby vibe)
//    Layers:
//    1. Warm Fingerpicked Acoustic Guitar Arpeggios (Soothing G Major / E Minor 6-bar progression @ ~75 BPM)
//    2. Wooden Marimba / Kalimba & Mellow Nocturnal Ocarina Counter-Melody
//    3. Gentle Night Meadow Breeze & Warm Harmonium Sub-Pad
//    4. Binaural Night Farm ASMR Micro-Triggers (Evening Crickets/Night Bird, Babbling Brook Droplets, Tactile Harvest Pops & Bamboo Porch Chimes)

export type CozyAudioMode = 'day' | 'night';

class CozyFarmAsmrSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nightBreezeBuffer: AudioBuffer | null = null;
  private dayBreezeBuffer: AudioBuffer | null = null;
  private pluckNoiseBuffer: AudioBuffer | null = null;
  private isPlaying = false;
  private isTransitioning = false;
  private wasPlayingBeforeHidden = false;
  private currentMode: CozyAudioMode = 'night';
  private barTimer: number | null = null;
  private natureTimer: number | null = null;
  private stopTimeout: number | null = null;
  private activeNodes: AudioNode[] = [];
  private listeners = new Set<(playing: boolean, mode: CozyAudioMode) => void>();

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.visibilityState === 'hidden') {
          if (this.isPlaying) {
            this.wasPlayingBeforeHidden = true;
            this.ctx.suspend().catch(() => {});
          }
        } else if (document.visibilityState === 'visible') {
          if (this.wasPlayingBeforeHidden && this.isPlaying && this.ctx.state === 'suspended') {
            this.wasPlayingBeforeHidden = false;
            this.ctx.resume().catch(() => {});
          }
        }
      });
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  public getMode(): CozyAudioMode {
    return this.currentMode;
  }

  public subscribe(listener: (playing: boolean, mode: CozyAudioMode) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.currentMode);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isPlaying, this.currentMode));
  }

  /**
   * Sets the active theme mode ('day' or 'night').
   * Each mode has 1 dedicated song. If audio is currently playing when the mode switches,
   * the engine smoothly transitions to the new mode's song automatically.
   */
  public async setMode(mode: CozyAudioMode): Promise<void> {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.notifyListeners();

    if (this.isPlaying && !this.isTransitioning) {
      await this.restartForCurrentMode();
    }
  }

  public async toggle(mode?: CozyAudioMode): Promise<boolean> {
    if (mode && this.currentMode !== mode) {
      this.currentMode = mode;
    }
    if (this.isTransitioning) {
      return this.isPlaying;
    }
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start(this.currentMode);
      return this.isPlaying;
    }
  }

  public async start(mode?: CozyAudioMode): Promise<void> {
    if (mode) {
      this.currentMode = mode;
    }
    if (this.isPlaying || this.isTransitioning) return;
    this.isTransitioning = true;

    try {
      if (this.stopTimeout !== null) {
        window.clearTimeout(this.stopTimeout);
        this.stopTimeout = null;
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
        this.nightBreezeBuffer = null;
        this.dayBreezeBuffer = null;
        this.pluckNoiseBuffer = null;
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.cleanupNodes();
      this.isPlaying = true;
      this.notifyListeners();

      this.launchActiveModeTrack(true);
    } catch {
      this.isPlaying = false;
      this.notifyListeners();
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Seamlessly switches the currently playing song when the user toggles between Day Mode and Night Mode
   */
  private async restartForCurrentMode(): Promise<void> {
    if (!this.ctx || !this.isPlaying) return;
    this.isTransitioning = true;
    try {
      if (this.stopTimeout !== null) {
        window.clearTimeout(this.stopTimeout);
        this.stopTimeout = null;
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Quick gentle fade-out of previous mode nodes before starting new mode song
      if (this.masterGain) {
        const now = this.ctx.currentTime;
        try {
          this.masterGain.gain.cancelScheduledValues(now);
          this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.001), now);
          this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        } catch {
          // Ignore
        }
      }

      this.cleanupNodes();
      this.launchActiveModeTrack(true);
    } finally {
      this.isTransitioning = false;
    }
  }

  private launchActiveModeTrack(playWelcomeChime: boolean): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.45, now + 0.75);
    master.connect(ctx.destination);
    this.masterGain = master;
    this.activeNodes.push(master);

    if (this.currentMode === 'day') {
      // ☀️ MODE SIANG SONG: "Sunny Cozy Game Village ASMR"
      this.startDaySunnyBreezeLayer(ctx, master);
      this.startDayWarmOrganPad(ctx, master);
      this.startDayCozyGameMusicLoop(ctx, master);
      this.startDayCozyGameAsmrLoop(ctx, master);
      if (playWelcomeChime) {
        this.playDayCozyConfirmationSfx(ctx, master, true);
      }
    } else {
      // 🌙 MODE MALAM SONG: "Starlight Cozy Farm Night ASMR"
      this.startNightMeadowBreezeLayer(ctx, master);
      this.startNightPastoralWarmthPad(ctx, master);
      this.startNightCozyFarmMusicLoop(ctx, master);
      this.startNightFarmNatureAsmrLoop(ctx, master);
      if (playWelcomeChime) {
        this.playNightHarvestConfirmationSfx(ctx, master, true);
      }
    }
  }

  public stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.wasPlayingBeforeHidden = false;
    this.notifyListeners();

    this.clearTimers();

    if (this.ctx && this.masterGain) {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      try {
        const currentGain = Math.max(this.masterGain.gain.value, 0.001);
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(currentGain, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        if (this.currentMode === 'day') {
          this.playDayCozyConfirmationSfx(ctx, ctx.destination, false, 0.024);
        } else {
          this.playNightHarvestConfirmationSfx(ctx, ctx.destination, false, 0.024);
        }
      } catch {
        // Ignore scheduling errors if context is closing
      }

      if (this.stopTimeout !== null) {
        window.clearTimeout(this.stopTimeout);
      }
      this.stopTimeout = window.setTimeout(() => {
        this.stopTimeout = null;
        this.cleanupNodes();
        if (this.ctx && this.ctx.state === 'running' && !this.isPlaying) {
          this.ctx.suspend().catch(() => {});
        }
      }, 550);
    } else {
      this.cleanupNodes();
    }
  }

  private clearTimers(): void {
    if (this.barTimer !== null) {
      window.clearInterval(this.barTimer);
      this.barTimer = null;
    }
    if (this.natureTimer !== null) {
      window.clearInterval(this.natureTimer);
      this.natureTimer = null;
    }
  }

  private cleanupNodes(): void {
    this.clearTimers();
    for (const node of this.activeNodes) {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
      } catch {
        // Already stopped
      }
      try {
        node.disconnect();
      } catch {
        // Already disconnected
      }
    }
    this.activeNodes = [];
    this.masterGain = null;
  }

  /**
   * Short 45ms burst buffer used for realistic acoustic guitar / ukulele string pluck transient
   */
  private getOrCreatePluckBuffer(ctx: AudioContext): AudioBuffer {
    if (this.pluckNoiseBuffer && this.pluckNoiseBuffer.sampleRate === ctx.sampleRate) {
      return this.pluckNoiseBuffer;
    }
    const frames = Math.floor(ctx.sampleRate * 0.045);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const env = 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    this.pluckNoiseBuffer = buffer;
    return buffer;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ☀️ DAY MODE TRACK: "SUNNY COZY GAME VILLAGE ASMR" (1 Dedicated Song for Mode Siang)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Cached 6-second stereo buffer of sunny morning orchard leaves rustling & soft wooden porch ticks
   */
  private getOrCreateDayBreezeBuffer(ctx: AudioContext): AudioBuffer {
    if (this.dayBreezeBuffer && this.dayBreezeBuffer.sampleRate === ctx.sampleRate) {
      return this.dayBreezeBuffer;
    }

    const durationSeconds = 6;
    const sampleRate = ctx.sampleRate;
    const frameCount = sampleRate * durationSeconds;
    const buffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0;
      let b1 = 0;
      const phaseOffset = channel * 1.1;

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const sunnyGust =
          0.5 +
          0.35 * Math.sin((2 * Math.PI * t) / 3.0 + phaseOffset) +
          0.15 * Math.sin((2 * Math.PI * t) / 1.5);

        const white = Math.random() * 2 - 1;
        b0 = 0.992 * b0 + white * 0.05;
        b1 = 0.965 * b1 + b0 * 0.09;

        // Crisp sunny leaf / wooden shop sign micro-tick
        let leafTick = 0;
        if (Math.random() < 0.00055) {
          leafTick = (Math.random() * 2 - 1) * 0.075;
        }

        data[i] = b1 * 0.012 * sunnyGust + leafTick;
      }
    }

    this.dayBreezeBuffer = buffer;
    return buffer;
  }

  private startDaySunnyBreezeLayer(ctx: AudioContext, destination: AudioNode): void {
    const breezeSource = ctx.createBufferSource();
    breezeSource.buffer = this.getOrCreateDayBreezeBuffer(ctx);
    breezeSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 920; // Brighter daytime leaf rustle
    bandpass.Q.value = 0.7;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.22;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.32;

    breezeSource.connect(bandpass);
    bandpass.connect(breezeGain);
    breezeGain.connect(destination);

    breezeSource.start();
    lfo.start();

    this.activeNodes.push(breezeSource, bandpass, lfo, lfoGain, breezeGain);
  }

  /**
   * Warm C3 + G3 daytime cozy town harmonium / reed organ breath pad
   */
  private startDayWarmOrganPad(ctx: AudioContext, destination: AudioNode): void {
    const oscRoot = ctx.createOscillator();
    const oscFifth = ctx.createOscillator();
    oscRoot.type = 'sine';
    oscFifth.type = 'triangle';

    // C3 (130.81 Hz) & G3 (196.00 Hz)
    oscRoot.frequency.value = 130.81;
    oscFifth.frequency.value = 196.0;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;

    const padGain = ctx.createGain();
    padGain.gain.value = 0.052;

    oscRoot.connect(filter);
    oscFifth.connect(filter);
    filter.connect(padGain);
    padGain.connect(destination);

    oscRoot.start();
    oscFifth.start();

    this.activeNodes.push(oscRoot, oscFifth, filter, padGain);
  }

  /**
   * ☀️ DAY MODE EXCLUSIVE SONG:
   * 8-Bar Sunny Cozy Game RPG Progression in C Major / F Major (~88 BPM, 2.72s per bar):
   * - Bouncy Acoustic Ukulele / Nylon Guitar Fingerpicking
   * - Cozy Toy Piano / Celesta Bell Melodies
   * - Cheerful Wooden Recorder / Whistle Flute Lead Phrases
   */
  private startDayCozyGameMusicLoop(ctx: AudioContext, destination: AudioNode): void {
    // 8-bar cheerful Cozy Game Village progression:
    // Bar 1: Fmaj7  (Sunny Town Square Morning)
    // Bar 2: G6     (Bakery & Flower Shop Stroll)
    // Bar 3: Em7    (Butterfly Meadow Path)
    // Bar 4: Am7    (Cozy Wooden Bridge)
    // Bar 5: Dm9    (Refreshing Lemonade Stand)
    // Bar 6: G13    (Laughter by the Fountain)
    // Bar 7: Cmaj9  (Golden Afternoon Sunshine)
    // Bar 8: C6 -> A7b9 turnaround (Back to the Plaza)
    const dayCozyBars: {
      bass: number;
      bassFifth: number;
      ukulelePicking: number[]; // 8 bouncy eighth-note plucks
      celestaNotes: { freq: number; beatOffset: number; pan: number }[];
      recorderPhrase?: { freq: number; graceFreq?: number; beatOffset: number; duration: number }[];
    }[] = [
      {
        // Bar 1: Fmaj7 (F2, C3, A3, C4, E4, A4)
        bass: 87.31,
        bassFifth: 130.81,
        ukulelePicking: [261.63, 329.63, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63],
        celestaNotes: [
          { freq: 659.25, beatOffset: 0.0, pan: -0.35 },  // E5
          { freq: 783.99, beatOffset: 0.68, pan: 0.3 },   // G5
          { freq: 880.0, beatOffset: 1.36, pan: -0.25 },  // A5
          { freq: 1046.5, beatOffset: 2.04, pan: 0.35 },  // C6
        ],
        recorderPhrase: [
          { freq: 880.0, graceFreq: 783.99, beatOffset: 0.34, duration: 0.85 }, // A5
          { freq: 1046.5, beatOffset: 1.36, duration: 0.95 },                   // C6
        ],
      },
      {
        // Bar 2: G6 (G2, D3, B3, D4, E4, G4)
        bass: 98.0,
        bassFifth: 146.83,
        ukulelePicking: [246.94, 293.66, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66],
        celestaNotes: [
          { freq: 987.77, beatOffset: 0.34, pan: 0.35 },  // B5
          { freq: 880.0, beatOffset: 1.02, pan: -0.3 },   // A5
          { freq: 783.99, beatOffset: 1.7, pan: 0.25 },   // G5
        ],
        recorderPhrase: [
          { freq: 987.77, graceFreq: 880.0, beatOffset: 0.34, duration: 0.65 }, // B5
          { freq: 783.99, beatOffset: 1.02, duration: 1.15 },                   // G5
        ],
      },
      {
        // Bar 3: Em7 (E2, B2, G3, B3, D4, G4)
        bass: 82.41,
        bassFifth: 123.47,
        ukulelePicking: [196.0, 246.94, 293.66, 392.0, 493.88, 392.0, 293.66, 246.94],
        celestaNotes: [
          { freq: 783.99, beatOffset: 0.0, pan: -0.3 },   // G5
          { freq: 659.25, beatOffset: 0.68, pan: 0.3 },   // E5
          { freq: 587.33, beatOffset: 1.36, pan: -0.25 }, // D5
          { freq: 659.25, beatOffset: 2.04, pan: 0.25 },  // E5
        ],
        recorderPhrase: [
          { freq: 659.25, beatOffset: 0.68, duration: 1.2 }, // E5
        ],
      },
      {
        // Bar 4: Am7 (A2, E3, C4, E4, G4, A4)
        bass: 110.0,
        bassFifth: 164.81,
        ukulelePicking: [220.0, 261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63],
        celestaNotes: [
          { freq: 523.25, beatOffset: 0.34, pan: 0.3 },   // C5
          { freq: 659.25, beatOffset: 1.02, pan: -0.3 },  // E5
          { freq: 880.0, beatOffset: 1.7, pan: 0.35 },    // A5
        ],
        recorderPhrase: [
          { freq: 783.99, graceFreq: 659.25, beatOffset: 0.34, duration: 0.62 }, // G5
          { freq: 880.0, beatOffset: 1.02, duration: 1.1 },                      // A5
        ],
      },
      {
        // Bar 5: Dm9 (D3, A3, F4, A4, C5, E5)
        bass: 146.83,
        bassFifth: 220.0,
        ukulelePicking: [293.66, 349.23, 440.0, 523.25, 659.25, 523.25, 440.0, 349.23],
        celestaNotes: [
          { freq: 880.0, beatOffset: 0.0, pan: -0.35 },   // A5
          { freq: 783.99, beatOffset: 0.68, pan: 0.25 },  // G5
          { freq: 698.46, beatOffset: 1.36, pan: -0.25 }, // F5
          { freq: 880.0, beatOffset: 2.04, pan: 0.35 },   // A5
        ],
        recorderPhrase: [
          { freq: 698.46, graceFreq: 659.25, beatOffset: 0.34, duration: 0.85 }, // F5
          { freq: 880.0, beatOffset: 1.36, duration: 0.9 },                      // A5
        ],
      },
      {
        // Bar 6: G13 (G2, D3, F3, B3, E4, G4)
        bass: 98.0,
        bassFifth: 146.83,
        ukulelePicking: [196.0, 246.94, 293.66, 329.63, 392.0, 493.88, 392.0, 329.63],
        celestaNotes: [
          { freq: 783.99, beatOffset: 0.34, pan: 0.3 },   // G5
          { freq: 880.0, beatOffset: 1.02, pan: -0.3 },   // A5
          { freq: 987.77, beatOffset: 1.7, pan: 0.35 },   // B5
        ],
        recorderPhrase: [
          { freq: 783.99, beatOffset: 0.34, duration: 0.65 }, // G5
          { freq: 987.77, beatOffset: 1.02, duration: 1.1 },  // B5
        ],
      },
      {
        // Bar 7: Cmaj9 (C3, G3, B3, D4, E4, G4)
        bass: 130.81,
        bassFifth: 196.0,
        ukulelePicking: [261.63, 329.63, 392.0, 493.88, 587.33, 523.25, 392.0, 329.63],
        celestaNotes: [
          { freq: 1046.5, beatOffset: 0.0, pan: -0.35 },  // C6
          { freq: 783.99, beatOffset: 0.68, pan: 0.3 },   // G5
          { freq: 659.25, beatOffset: 1.36, pan: -0.25 }, // E5
          { freq: 783.99, beatOffset: 2.04, pan: 0.3 },   // G5
        ],
        recorderPhrase: [
          { freq: 1046.5, graceFreq: 987.77, beatOffset: 0.0, duration: 1.45 }, // C6
        ],
      },
      {
        // Bar 8: C6/9 -> Cozy Turnaround (C3, G3, A3, D4, E4, G4)
        bass: 130.81,
        bassFifth: 164.81,
        ukulelePicking: [261.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63],
        celestaNotes: [
          { freq: 880.0, beatOffset: 0.34, pan: 0.25 },   // A5
          { freq: 783.99, beatOffset: 1.02, pan: -0.25 }, // G5
          { freq: 659.25, beatOffset: 1.7, pan: 0.0 },    // E5
        ],
      },
    ];

    let barIndex = 0;
    const eighthNoteSec = 0.34; // ~88 BPM bouncy daytime cozy village tempo (2.72s per bar)

    const scheduleDayBar = () => {
      if (!this.isPlaying || this.currentMode !== 'day' || !this.ctx || this.ctx.state !== 'running') {
        return;
      }
      const bar = dayCozyBars[barIndex % dayCozyBars.length];
      barIndex++;

      // Bouncy two-beat acoustic bass (Beat 1 root + Beat 3 fifth, classic Animal Crossing / Stardew daytime bounce)
      this.triggerAcousticGuitarPluck(ctx, destination, bar.bass, 0, 1.35, 0.072, -0.12);
      this.triggerAcousticGuitarPluck(ctx, destination, bar.bassFifth, eighthNoteSec * 4, 1.25, 0.058, 0.12);

      // 8 bouncy ukulele / nylon guitar plucks
      bar.ukulelePicking.forEach((freq, idx) => {
        const delaySec = idx * eighthNoteSec;
        const isAccent = idx === 0 || idx === 2 || idx === 5;
        const gain = isAccent ? 0.058 : 0.04;
        const pan = ((idx % 4) - 1.5) * 0.22;
        this.triggerUkulelePluck(ctx, destination, freq, delaySec, 0.95, gain, pan);
      });

      // Cozy Toy Piano / Celesta Bell notes
      bar.celestaNotes.forEach((c) => {
        this.triggerCozyCelestaBell(ctx, destination, c.freq, c.beatOffset, c.pan);
      });

      // Cheerful Daytime Recorder / Sweet Whistle Flute melody
      if (bar.recorderPhrase) {
        bar.recorderPhrase.forEach((note) => {
          this.triggerDayRecorderFluteNote(
            ctx,
            destination,
            note.freq,
            note.beatOffset,
            note.duration,
            note.graceFreq,
          );
        });
      }
    };

    scheduleDayBar();
    this.barTimer = window.setInterval(scheduleDayBar, 2720);
  }

  /**
   * ☀️ Binaural Daytime Cozy Game ASMR Micro-Triggers:
   * 1. Cheerful Morning Songbird & Finch Trills (multi-note sunny chirps)
   * 2. Tactile Cozy Game UI Wood-Click & Inventory Item "Pop-Bloop" ASMR
   * 3. Sunny Fountain / Watering Can Splash Droplets
   * 4. Sparkling Glass & Bamboo Sunny Porch Wind Chimes
   */
  private startDayCozyGameAsmrLoop(ctx: AudioContext, destination: AudioNode): void {
    const triggerDayAsmr = () => {
      if (!this.isPlaying || this.currentMode !== 'day' || !this.ctx || this.ctx.state !== 'running') {
        return;
      }
      const roll = Math.random();

      if (roll < 0.34) {
        // 1. Cheerful Morning Finch 2-or-3-Note Sunny Bird Trill
        const pan = Math.random() * 1.5 - 0.75;
        const basePitch = 1950 + Math.random() * 600;
        this.triggerSongbirdChirp(ctx, destination, basePitch, 0, pan);
        this.triggerSongbirdChirp(ctx, destination, basePitch * 1.18, 0.11, pan);
        if (Math.random() < 0.65) {
          this.triggerSongbirdChirp(ctx, destination, basePitch * 1.32, 0.22, pan);
        }
      } else if (roll < 0.62) {
        // 2. Signature Cozy Game Tactile Wood-Block Click + Item Pickup "Pop-Bloop" ASMR
        const pan = Math.random() * 1.2 - 0.6;
        this.triggerCozyGameWoodClickAsmr(ctx, destination, 0, pan);
        if (Math.random() < 0.7) {
          this.triggerHarvestPopAsmr(ctx, destination, 0.09, pan * 0.8);
        }
      } else if (roll < 0.82) {
        // 3. Sunny Village Fountain / Watering Can Double Splash Droplet
        const pan = Math.random() * 1.5 - 0.75;
        const dropFreq = 580 + Math.random() * 540;
        this.triggerBrookDroplet(ctx, destination, dropFreq, 0, pan);
        if (Math.random() < 0.5) {
          this.triggerBrookDroplet(ctx, destination, dropFreq * 1.25, 0.11, pan);
        }
      } else {
        // 4. Sparkling Sunny Glass Porch Wind Chimes (C6, D6, E6, G6, A6)
        const sunnyChimes = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
        const note1 = sunnyChimes[Math.floor(Math.random() * sunnyChimes.length)];
        const note2 = sunnyChimes[Math.floor(Math.random() * sunnyChimes.length)];
        const pan = Math.random() * 1.4 - 0.7;
        this.triggerCozyCelestaBell(ctx, destination, note1, 0, pan, 0.02);
        this.triggerCozyCelestaBell(ctx, destination, note2, 0.12, -pan * 0.7, 0.016);
      }
    };

    this.natureTimer = window.setInterval(triggerDayAsmr, 820);
  }

  /**
   * Bright acoustic ukulele / nylon string pluck for Day Mode Cozy Game rhythm
   */
  private triggerUkulelePluck(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    durationSec: number,
    peakGain: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const pluckBurst = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const burstGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'triangle';
    overtone.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    overtone.frequency.setValueAtTime(freq * 2, start);

    pluckBurst.buffer = this.getOrCreatePluckBuffer(ctx);
    burstGain.gain.setValueAtTime(peakGain * 0.24, start);
    burstGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.032);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(3100, freq * 6.2), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(480, freq * 1.8), start + durationSec * 0.7);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.009);
    gain.gain.exponentialRampToValueAtTime(peakGain * 0.3, start + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.linearRampToValueAtTime(peakGain * 0.36, start + 0.006);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec * 0.35);

    osc.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    pluckBurst.connect(burstGain);
    burstGain.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        overtone.disconnect();
        pluckBurst.disconnect();
        overtoneGain.disconnect();
        burstGain.disconnect();
        filter.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    overtone.start(start);
    pluckBurst.start(start);
    osc.stop(start + durationSec + 0.03);
    overtone.stop(start + durationSec * 0.4);
  }

  /**
   * Cozy Toy Piano / Celesta Bell strike for Day Mode
   */
  private triggerCozyCelestaBell(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    panValue: number,
    peakGain = 0.036,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const bellHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();
    const bellGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // 3rd harmonic for sweet toy-piano / celesta chime
    bellHarmonic.type = 'triangle';
    bellHarmonic.frequency.setValueAtTime(freq * 3.0, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);

    bellGain.gain.setValueAtTime(0.0001, start);
    bellGain.gain.linearRampToValueAtTime(peakGain * 0.22, start + 0.004);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

    osc.connect(gain);
    bellHarmonic.connect(bellGain);
    bellGain.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        bellHarmonic.disconnect();
        bellGain.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    bellHarmonic.start(start);
    osc.stop(start + 1.2);
    bellHarmonic.stop(start + 0.16);
  }

  /**
   * Cheerful Daytime Wooden Recorder / Sweet Whistle Flute with optional Cozy RPG grace note
   */
  private triggerDayRecorderFluteNote(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    durationSec: number,
    graceFreq?: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (graceFreq) {
      osc.frequency.setValueAtTime(graceFreq, start);
      osc.frequency.exponentialRampToValueAtTime(freq, start + 0.055);
    } else {
      osc.frequency.setValueAtTime(freq, start);
    }

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(5.4, start);
    vibratoGain.gain.setValueAtTime(3.6, start);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1750, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.025, start + 0.07);
    gain.gain.setValueAtTime(0.022, start + Math.max(0.12, durationSec - 0.18));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.onended = () => {
      try {
        osc.disconnect();
        vibrato.disconnect();
        vibratoGain.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    vibrato.start(start);
    osc.stop(start + durationSec + 0.04);
    vibrato.stop(start + durationSec + 0.04);
  }

  /**
   * Tactile Cozy Game Wooden UI / Inventory Click ASMR (like Animal Crossing / Cozy Shop menu tap)
   */
  private triggerCozyGameWoodClickAsmr(
    ctx: AudioContext,
    destination: AudioNode,
    delaySec: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(720, start);
    osc.frequency.exponentialRampToValueAtTime(260, start + 0.028);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, start);
    filter.Q.setValueAtTime(2.2, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.032, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);

    osc.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    osc.stop(start + 0.04);
  }

  /**
   * ☀️ Day Mode Cozy Game Confirmation Bell Chime (C5 - E5 - G5 - A5 - C6)
   */
  private playDayCozyConfirmationSfx(
    ctx: AudioContext,
    destination: AudioNode,
    turningOn: boolean,
    peakGain = 0.046,
  ): void {
    const notes = turningOn
      ? [523.25, 659.25, 783.99, 880.0, 1046.5]
      : [880.0, 783.99, 659.25, 523.25];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.058;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peakGain, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
      osc.connect(gain);
      gain.connect(destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore
        }
      };
      osc.start(start);
      osc.stop(start + 0.37);
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌙 NIGHT MODE TRACK: "STARLIGHT COZY FARM NIGHT ASMR" (1 Dedicated Song for Mode Malam)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Cached 7-second stereo buffer of soft rustling wheat fields, gentle night meadow wind,
   * and subtle wooden windmill / porch creak ticks.
   */
  private getOrCreateNightBreezeBuffer(ctx: AudioContext): AudioBuffer {
    if (this.nightBreezeBuffer && this.nightBreezeBuffer.sampleRate === ctx.sampleRate) {
      return this.nightBreezeBuffer;
    }

    const durationSeconds = 7;
    const sampleRate = ctx.sampleRate;
    const frameCount = sampleRate * durationSeconds;
    const buffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      const phaseOffset = channel * 1.4;

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const breezeWave =
          0.55 +
          0.32 * Math.sin((2 * Math.PI * t) / 3.5 + phaseOffset) +
          0.13 * Math.sin((2 * Math.PI * t) / 1.75);

        const white = Math.random() * 2 - 1;
        b0 = 0.995 * b0 + white * 0.045;
        b1 = 0.98 * b1 + b0 * 0.08;
        b2 = 0.94 * b2 + (white * 0.02 - b1 * 0.02);

        let woodTick = 0;
        if (Math.random() < 0.00045) {
          woodTick = (Math.random() * 2 - 1) * 0.09;
        }

        data[i] = b1 * 0.014 * breezeWave + woodTick;
      }
    }

    this.nightBreezeBuffer = buffer;
    return buffer;
  }

  private startNightMeadowBreezeLayer(ctx: AudioContext, destination: AudioNode): void {
    const breezeSource = ctx.createBufferSource();
    breezeSource.buffer = this.getOrCreateNightBreezeBuffer(ctx);
    breezeSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 680;
    bandpass.Q.value = 0.65;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.16;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.36;

    breezeSource.connect(bandpass);
    bandpass.connect(breezeGain);
    breezeGain.connect(destination);

    breezeSource.start();
    lfo.start();

    this.activeNodes.push(breezeSource, bandpass, lfo, lfoGain, breezeGain);
  }

  /**
   * Warm G2 + D3 pastoral fifth drone for Night Mode
   */
  private startNightPastoralWarmthPad(ctx: AudioContext, destination: AudioNode): void {
    const oscRoot = ctx.createOscillator();
    const oscFifth = ctx.createOscillator();
    oscRoot.type = 'sine';
    oscFifth.type = 'triangle';

    // G2 (98.00 Hz) & D3 (146.83 Hz)
    oscRoot.frequency.value = 98.0;
    oscFifth.frequency.value = 146.83;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 230;

    const padGain = ctx.createGain();
    padGain.gain.value = 0.065;

    oscRoot.connect(filter);
    oscFifth.connect(filter);
    filter.connect(padGain);
    padGain.connect(destination);

    oscRoot.start();
    oscFifth.start();

    this.activeNodes.push(oscRoot, oscFifth, filter, padGain);
  }

  /**
   * 🌙 NIGHT MODE EXCLUSIVE SONG:
   * 6-bar soothing nocturnal pastoral progression in G Major (~75 BPM, 3.2s per bar):
   * Fingerpicked Acoustic Guitar Arpeggios + Wooden Marimba + Sweet Nocturnal Ocarina
   */
  private startNightCozyFarmMusicLoop(ctx: AudioContext, destination: AudioNode): void {
    const farmBars: {
      bass: number;
      guitarPicking: number[];
      marimbaNotes: { freq: number; beatOffset: number; pan: number }[];
      ocarinaNote?: { freq: number; beatOffset: number; duration: number };
    }[] = [
      {
        // Bar 1: Gmaj7
        bass: 98.0,
        guitarPicking: [196.0, 246.94, 293.66, 392.0, 369.99, 293.66, 246.94, 293.66],
        marimbaNotes: [
          { freq: 587.33, beatOffset: 0.4, pan: -0.35 },
          { freq: 783.99, beatOffset: 1.6, pan: 0.35 },
          { freq: 659.25, beatOffset: 2.4, pan: -0.2 },
        ],
        ocarinaNote: { freq: 783.99, beatOffset: 0.8, duration: 1.35 },
      },
      {
        // Bar 2: Cmaj9
        bass: 130.81,
        guitarPicking: [130.81, 196.0, 246.94, 329.63, 293.66, 246.94, 196.0, 246.94],
        marimbaNotes: [
          { freq: 659.25, beatOffset: 0.4, pan: 0.3 },
          { freq: 587.33, beatOffset: 1.2, pan: -0.3 },
          { freq: 493.88, beatOffset: 2.4, pan: 0.25 },
        ],
        ocarinaNote: { freq: 659.25, beatOffset: 1.4, duration: 1.25 },
      },
      {
        // Bar 3: Em7
        bass: 82.41,
        guitarPicking: [164.81, 196.0, 246.94, 293.66, 392.0, 293.66, 246.94, 196.0],
        marimbaNotes: [
          { freq: 493.88, beatOffset: 0.8, pan: -0.35 },
          { freq: 587.33, beatOffset: 1.6, pan: 0.3 },
          { freq: 659.25, beatOffset: 2.4, pan: -0.25 },
        ],
      },
      {
        // Bar 4: D6/9
        bass: 146.83,
        guitarPicking: [146.83, 220.0, 246.94, 369.99, 329.63, 293.66, 220.0, 246.94],
        marimbaNotes: [
          { freq: 739.99, beatOffset: 0.4, pan: 0.35 },
          { freq: 659.25, beatOffset: 1.2, pan: -0.3 },
          { freq: 587.33, beatOffset: 2.0, pan: 0.2 },
        ],
        ocarinaNote: { freq: 587.33, beatOffset: 1.0, duration: 1.4 },
      },
      {
        // Bar 5: Am7
        bass: 110.0,
        guitarPicking: [110.0, 164.81, 196.0, 261.63, 329.63, 261.63, 196.0, 220.0],
        marimbaNotes: [
          { freq: 523.25, beatOffset: 0.4, pan: -0.3 },
          { freq: 659.25, beatOffset: 1.6, pan: 0.3 },
          { freq: 783.99, beatOffset: 2.4, pan: -0.25 },
        ],
      },
      {
        // Bar 6: D9 -> G6 Turnaround
        bass: 98.0,
        guitarPicking: [146.83, 220.0, 293.66, 369.99, 196.0, 246.94, 293.66, 392.0],
        marimbaNotes: [
          { freq: 659.25, beatOffset: 0.4, pan: 0.25 },
          { freq: 739.99, beatOffset: 1.2, pan: -0.25 },
          { freq: 783.99, beatOffset: 2.0, pan: 0.0 },
        ],
        ocarinaNote: { freq: 783.99, beatOffset: 1.8, duration: 1.1 },
      },
    ];

    let barIndex = 0;
    const eighthNoteSec = 0.4; // Relaxed ~75 BPM nocturnal stroll (3.2s per bar)

    const scheduleNightBar = () => {
      if (!this.isPlaying || this.currentMode !== 'night' || !this.ctx || this.ctx.state !== 'running') {
        return;
      }
      const bar = farmBars[barIndex % farmBars.length];
      barIndex++;

      this.triggerAcousticGuitarPluck(ctx, destination, bar.bass, 0, 2.2, 0.075, -0.1);

      bar.guitarPicking.forEach((freq, idx) => {
        const delaySec = idx * eighthNoteSec;
        const isAccent = idx === 0 || idx === 3 || idx === 6;
        const gain = isAccent ? 0.068 : 0.048;
        const pan = ((idx % 4) - 1.5) * 0.18;
        this.triggerAcousticGuitarPluck(ctx, destination, freq, delaySec, 1.35, gain, pan);
      });

      bar.marimbaNotes.forEach((m) => {
        this.triggerWoodenMarimbaNote(ctx, destination, m.freq, m.beatOffset, m.pan);
      });

      if (bar.ocarinaNote) {
        this.triggerPastoralOcarinaNote(
          ctx,
          destination,
          bar.ocarinaNote.freq,
          bar.ocarinaNote.beatOffset,
          bar.ocarinaNote.duration,
        );
      }
    };

    scheduleNightBar();
    this.barTimer = window.setInterval(scheduleNightBar, 3200);
  }

  /**
   * 🌙 Binaural Night Farm ASMR Nature & Harvest Micro-Triggers
   */
  private startNightFarmNatureAsmrLoop(ctx: AudioContext, destination: AudioNode): void {
    const triggerNightAmbience = () => {
      if (!this.isPlaying || this.currentMode !== 'night' || !this.ctx || this.ctx.state !== 'running') {
        return;
      }
      const roll = Math.random();

      if (roll < 0.28) {
        const pan = Math.random() * 1.5 - 0.75;
        const basePitch = 1650 + Math.random() * 520;
        this.triggerSongbirdChirp(ctx, destination, basePitch, 0, pan);
        if (Math.random() < 0.75) {
          this.triggerSongbirdChirp(ctx, destination, basePitch * 1.12, 0.14, pan);
        }
      } else if (roll < 0.62) {
        const pan = Math.random() * 1.6 - 0.8;
        const dropFreq = 480 + Math.random() * 520;
        this.triggerBrookDroplet(ctx, destination, dropFreq, 0, pan);
      } else if (roll < 0.82) {
        const pan = Math.random() * 1.2 - 0.6;
        this.triggerHarvestPopAsmr(ctx, destination, 0, pan);
      } else {
        const chimeNotes = [783.99, 987.77, 1174.66, 1318.51];
        const note = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
        this.triggerWoodenMarimbaNote(ctx, destination, note, 0, Math.random() * 1.4 - 0.7, 0.022);
      }
    };

    this.natureTimer = window.setInterval(triggerNightAmbience, 950);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHARED ACOUSTIC SYNTHESIS & ASMR PRIMITIVES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private triggerAcousticGuitarPluck(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    durationSec: number,
    peakGain: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const oscFundamental = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const pluckBurst = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const harmonicGain = ctx.createGain();
    const burstGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    oscFundamental.type = 'triangle';
    oscHarmonic.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, start);
    oscHarmonic.frequency.setValueAtTime(freq * 2, start);

    pluckBurst.buffer = this.getOrCreatePluckBuffer(ctx);
    burstGain.gain.setValueAtTime(peakGain * 0.28, start);
    burstGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(2400, freq * 5.5), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 1.4), start + durationSec * 0.75);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(peakGain * 0.35, start + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    harmonicGain.gain.setValueAtTime(0.0001, start);
    harmonicGain.gain.linearRampToValueAtTime(peakGain * 0.32, start + 0.008);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec * 0.42);

    oscFundamental.connect(filter);
    oscHarmonic.connect(harmonicGain);
    harmonicGain.connect(filter);
    pluckBurst.connect(burstGain);
    burstGain.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    oscFundamental.onended = () => {
      try {
        oscFundamental.disconnect();
        oscHarmonic.disconnect();
        pluckBurst.disconnect();
        harmonicGain.disconnect();
        burstGain.disconnect();
        filter.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    };

    oscFundamental.start(start);
    oscHarmonic.start(start);
    pluckBurst.start(start);
    oscFundamental.stop(start + durationSec + 0.04);
    oscHarmonic.stop(start + durationSec * 0.45);
  }

  private triggerWoodenMarimbaNote(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    panValue: number,
    peakGain = 0.042,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const woodyOvertone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    woodyOvertone.type = 'sine';
    woodyOvertone.frequency.setValueAtTime(freq * 3.98, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.95);

    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.linearRampToValueAtTime(peakGain * 0.25, start + 0.005);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);

    osc.connect(gain);
    woodyOvertone.connect(overtoneGain);
    overtoneGain.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        woodyOvertone.disconnect();
        overtoneGain.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    woodyOvertone.start(start);
    osc.stop(start + 1.0);
    woodyOvertone.stop(start + 0.11);
  }

  private triggerPastoralOcarinaNote(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    durationSec: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(4.8, start);
    vibratoGain.gain.setValueAtTime(3.2, start);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.026, start + 0.16);
    gain.gain.setValueAtTime(0.024, start + Math.max(0.2, durationSec - 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.onended = () => {
      try {
        osc.disconnect();
        vibrato.disconnect();
        vibratoGain.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    vibrato.start(start);
    osc.stop(start + durationSec + 0.04);
    vibrato.stop(start + durationSec + 0.04);
  }

  private triggerSongbirdChirp(
    ctx: AudioContext,
    destination: AudioNode,
    baseFreq: number,
    delaySec: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, start);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.28, start + 0.045);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.96, start + 0.095);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.014, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      osc.connect(gain);
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    osc.stop(start + 0.11);
  }

  private triggerBrookDroplet(
    ctx: AudioContext,
    destination: AudioNode,
    baseFreq: number,
    delaySec: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, start);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.42, start + 0.065);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.022, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.085);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      osc.connect(gain);
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    osc.stop(start + 0.095);
  }

  private triggerHarvestPopAsmr(
    ctx: AudioContext,
    destination: AudioNode,
    delaySec: number,
    panValue: number,
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(290, start);
    osc.frequency.exponentialRampToValueAtTime(580, start + 0.055);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.024, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.075);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      osc.connect(gain);
      gain.connect(destination);
    }

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore
      }
    };

    osc.start(start);
    osc.stop(start + 0.085);
  }

  private playNightHarvestConfirmationSfx(
    ctx: AudioContext,
    destination: AudioNode,
    turningOn: boolean,
    peakGain = 0.048,
  ): void {
    const notes = turningOn
      ? [392.0, 493.88, 587.33, 783.99]
      : [587.33, 493.88, 392.0];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.068;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peakGain, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.36);
      osc.connect(gain);
      gain.connect(destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore
        }
      };
      osc.start(start);
      osc.stop(start + 0.39);
    });
  }
}

export const cozyAsmrAudio = new CozyFarmAsmrSoundEngine();
