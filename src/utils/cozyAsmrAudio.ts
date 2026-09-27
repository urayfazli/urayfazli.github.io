// Procedural Cozy Game Farm ASMR Soundscape Engine
// Genre: Cozy Farming Sim RPG (Stardew Valley / Story of Seasons / Animal Crossing pastoral acoustic vibe)
// Layers:
// 1. Acoustic Fingerstyle Guitar Arpeggios (Warm G Major / D Major pastoral progression)
// 2. Wooden Marimba & Sweet Pastoral Ocarina / Flute Counter-Melody
// 3. Sunny Meadow Wheat Breeze & Wooden Windmill ASMR Texture (Cached Stereo Buffer)
// 4. Binaural Farm Nature ASMR Micro-Triggers (Morning Songbird Chirps, Babbling Brook Droplets, Tactile Crop-Harvest Pops & Bamboo Wind Chimes)

class CozyFarmAsmrSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private breezeBuffer: AudioBuffer | null = null;
  private pluckNoiseBuffer: AudioBuffer | null = null;
  private isPlaying = false;
  private isTransitioning = false;
  private wasPlayingBeforeHidden = false;
  private barTimer: number | null = null;
  private natureTimer: number | null = null;
  private stopTimeout: number | null = null;
  private activeNodes: AudioNode[] = [];
  private listeners = new Set<(playing: boolean) => void>();

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

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }

  public async toggle(): Promise<boolean> {
    if (this.isTransitioning) {
      return this.isPlaying;
    }
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start();
      return this.isPlaying;
    }
  }

  public async start(): Promise<void> {
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
        this.breezeBuffer = null;
        this.pluckNoiseBuffer = null;
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.cleanupNodes();
      this.isPlaying = true;
      this.notifyListeners();

      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Master output gain with warm fade-in
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.44, now + 0.9);
      master.connect(ctx.destination);
      this.masterGain = master;
      this.activeNodes.push(master);

      // 1. Sunny Meadow Wheat Breeze & Wooden Windmill ASMR Layer
      this.startFarmMeadowBreezeLayer(ctx, master);

      // 2. Warm Acoustic Harmonium / Accordion Sub-Drone (Pastoral Farm Warmth)
      this.startPastoralWarmthPad(ctx, master);

      // 3. Acoustic Fingerstyle Guitar + Wooden Marimba & Ocarina Farm Progression
      this.startCozyFarmMusicLoop(ctx, master);

      // 4. Binaural Farm ASMR Nature Triggers (Birds, Brook Water, Harvest Pop, Bamboo Chimes)
      this.startFarmNatureAsmrLoop(ctx, master);

      // Immediate Cozy Farm Harvest / Welcome Chime on 2x tap
      this.playHarvestConfirmationSfx(ctx, master, true);
    } catch {
      this.isPlaying = false;
      this.notifyListeners();
    } finally {
      this.isTransitioning = false;
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
        this.playHarvestConfirmationSfx(ctx, ctx.destination, false, 0.024);
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
   * Short 45ms burst buffer used for realistic acoustic guitar string pluck transient (Karplus-inspired)
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

  /**
   * Cached 7-second stereo buffer of soft rustling wheat fields, gentle meadow wind,
   * and subtle wooden windmill / porch creak ticks.
   */
  private getOrCreateMeadowBreezeBuffer(ctx: AudioContext): AudioBuffer {
    if (this.breezeBuffer && this.breezeBuffer.sampleRate === ctx.sampleRate) {
      return this.breezeBuffer;
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
        // Slow natural meadow breeze envelope (rustling grass & leaves)
        const breezeWave =
          0.55 +
          0.32 * Math.sin((2 * Math.PI * t) / 3.5 + phaseOffset) +
          0.13 * Math.sin((2 * Math.PI * t) / 1.75);

        const white = Math.random() * 2 - 1;
        // Soft brown/pink hybrid filter for silky leaf rustle (much softer than rain)
        b0 = 0.995 * b0 + white * 0.045;
        b1 = 0.98 * b1 + b0 * 0.08;
        b2 = 0.94 * b2 + (white * 0.02 - b1 * 0.02);

        // Occasional ultra-gentle dry wheat / wooden windmill tick
        let woodTick = 0;
        if (Math.random() < 0.00045) {
          woodTick = (Math.random() * 2 - 1) * 0.09;
        }

        data[i] = (b1 * 0.014 * breezeWave) + woodTick;
      }
    }

    this.breezeBuffer = buffer;
    return buffer;
  }

  private startFarmMeadowBreezeLayer(ctx: AudioContext, destination: AudioNode): void {
    const breezeSource = ctx.createBufferSource();
    breezeSource.buffer = this.getOrCreateMeadowBreezeBuffer(ctx);
    breezeSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 680;
    bandpass.Q.value = 0.65;

    // Gentle LFO sweeping the breeze through the farm trees
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
   * Warm G2 + D3 pastoral fifth drone (like a distant cozy accordion/harmonium in a sunny valley)
   */
  private startPastoralWarmthPad(ctx: AudioContext, destination: AudioNode): void {
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
   * Cozy Game Farm RPG Progression (Stardew Valley / Harvest Moon / Animal Crossing style):
   * Fingerpicked Acoustic Guitar Arpeggios + Wooden Marimba + Sweet Pastoral Ocarina
   */
  private startCozyFarmMusicLoop(ctx: AudioContext, destination: AudioNode): void {
    // 6-bar pastoral progression in G Major:
    // Bar 1: Gmaj7 (Sunny Farm Morning)
    // Bar 2: Cmaj9 (Windmill Meadow)
    // Bar 3: Em7   (Shady Orchard Path)
    // Bar 4: D6    (Golden Wheat Field)
    // Bar 5: Am7   (Babbling River Bridge)
    // Bar 6: D9 -> G6 (Cozy Barn Return)
    const farmBars: {
      bass: number;
      guitarPicking: number[]; // 8 fingerpicked 8th-note frequencies
      marimbaNotes: { freq: number; beatOffset: number; pan: number }[];
      ocarinaNote?: { freq: number; beatOffset: number; duration: number };
    }[] = [
      {
        // Bar 1: Gmaj7 (G2, D3, G3, B3, D4, F#4, G4)
        bass: 98.0,
        guitarPicking: [196.0, 246.94, 293.66, 392.0, 369.99, 293.66, 246.94, 293.66],
        marimbaNotes: [
          { freq: 587.33, beatOffset: 0.4, pan: -0.35 }, // D5
          { freq: 783.99, beatOffset: 1.6, pan: 0.35 },  // G5
          { freq: 659.25, beatOffset: 2.4, pan: -0.2 },  // E5
        ],
        ocarinaNote: { freq: 783.99, beatOffset: 0.8, duration: 1.35 }, // G5
      },
      {
        // Bar 2: Cmaj9 (C3, G3, B3, D4, E4, G4)
        bass: 130.81,
        guitarPicking: [130.81, 196.0, 246.94, 329.63, 293.66, 246.94, 196.0, 246.94],
        marimbaNotes: [
          { freq: 659.25, beatOffset: 0.4, pan: 0.3 },   // E5
          { freq: 587.33, beatOffset: 1.2, pan: -0.3 },  // D5
          { freq: 493.88, beatOffset: 2.4, pan: 0.25 },  // B4
        ],
        ocarinaNote: { freq: 659.25, beatOffset: 1.4, duration: 1.25 }, // E5
      },
      {
        // Bar 3: Em7 (E2, B2, E3, G3, B3, D4)
        bass: 82.41,
        guitarPicking: [164.81, 196.0, 246.94, 293.66, 392.0, 293.66, 246.94, 196.0],
        marimbaNotes: [
          { freq: 493.88, beatOffset: 0.8, pan: -0.35 }, // B4
          { freq: 587.33, beatOffset: 1.6, pan: 0.3 },   // D5
          { freq: 659.25, beatOffset: 2.4, pan: -0.25 }, // E5
        ],
      },
      {
        // Bar 4: D6/9 (D3, A3, B3,E4, F#4)
        bass: 146.83,
        guitarPicking: [146.83, 220.0, 246.94, 369.99, 329.63, 293.66, 220.0, 246.94],
        marimbaNotes: [
          { freq: 739.99, beatOffset: 0.4, pan: 0.35 },  // F#5
          { freq: 659.25, beatOffset: 1.2, pan: -0.3 },  // E5
          { freq: 587.33, beatOffset: 2.0, pan: 0.2 },   // D5
        ],
        ocarinaNote: { freq: 587.33, beatOffset: 1.0, duration: 1.4 }, // D5
      },
      {
        // Bar 5: Am7 (A2, E3, G3, C4, E4)
        bass: 110.0,
        guitarPicking: [110.0, 164.81, 196.0, 261.63, 329.63, 261.63, 196.0, 220.0],
        marimbaNotes: [
          { freq: 523.25, beatOffset: 0.4, pan: -0.3 },  // C5
          { freq: 659.25, beatOffset: 1.6, pan: 0.3 },   // E5
          { freq: 783.99, beatOffset: 2.4, pan: -0.25 }, // G5
        ],
      },
      {
        // Bar 6: D9 -> G6 Turnaround (D3, F#3, A3, B3, D4, G4)
        bass: 98.0,
        guitarPicking: [146.83, 220.0, 293.66, 369.99, 196.0, 246.94, 293.66, 392.0],
        marimbaNotes: [
          { freq: 659.25, beatOffset: 0.4, pan: 0.25 },  // E5
          { freq: 739.99, beatOffset: 1.2, pan: -0.25 }, // F#5
          { freq: 783.99, beatOffset: 2.0, pan: 0.0 },   // G5
        ],
        ocarinaNote: { freq: 783.99, beatOffset: 1.8, duration: 1.1 }, // G5
      },
    ];

    let barIndex = 0;
    const eighthNoteSec = 0.4; // Relaxed ~75 BPM pastoral stroll (3.2s per bar)

    const scheduleBar = () => {
      if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const bar = farmBars[barIndex % farmBars.length];
      barIndex++;

      // Warm acoustic bass thumb pluck on beat 1
      this.triggerAcousticGuitarPluck(ctx, destination, bar.bass, 0, 2.2, 0.075, -0.1);

      // 8 fingerpicked acoustic guitar notes across the bar
      bar.guitarPicking.forEach((freq, idx) => {
        const delaySec = idx * eighthNoteSec;
        const isAccent = idx === 0 || idx === 3 || idx === 6;
        const gain = isAccent ? 0.068 : 0.048;
        const pan = ((idx % 4) - 1.5) * 0.18;
        this.triggerAcousticGuitarPluck(ctx, destination, freq, delaySec, 1.35, gain, pan);
      });

      // Wooden Marimba / Kalimba melody sprinkles
      bar.marimbaNotes.forEach((m) => {
        this.triggerWoodenMarimbaNote(ctx, destination, m.freq, m.beatOffset, m.pan);
      });

      // Sweet Pastoral Ocarina / Wooden Flute phrase on selected bars
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

    scheduleBar();
    this.barTimer = window.setInterval(scheduleBar, 3200);
  }

  /**
   * Binaural Cozy Farm ASMR Nature & Harvest Micro-Triggers:
   * - Morning Songbirds (sweet double chirp in trees)
   * - Babbling Farm Brook / Watering Can Droplets
   * - Tactile Crop-Harvest "Pop" / Bamboo Wind Chimes
   */
  private startFarmNatureAsmrLoop(ctx: AudioContext, destination: AudioNode): void {
    const triggerFarmAmbience = () => {
      if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const roll = Math.random();

      if (roll < 0.28) {
        // 1. Sweet Morning Songbird Double-Chirp (panned in the orchard trees)
        const pan = (Math.random() * 1.5 - 0.75);
        const basePitch = 1650 + Math.random() * 520;
        this.triggerSongbirdChirp(ctx, destination, basePitch, 0, pan);
        if (Math.random() < 0.75) {
          this.triggerSongbirdChirp(ctx, destination, basePitch * 1.12, 0.14, pan);
        }
      } else if (roll < 0.62) {
        // 2. Babbling Farm Brook / Watering Trough Droplet
        const pan = (Math.random() * 1.6 - 0.8);
        const dropFreq = 480 + Math.random() * 520;
        this.triggerBrookDroplet(ctx, destination, dropFreq, 0, pan);
      } else if (roll < 0.82) {
        // 3. Cozy Stardew-style Crop Harvest "Bloop/Pop" Tactile ASMR
        const pan = (Math.random() * 1.2 - 0.6);
        this.triggerHarvestPopAsmr(ctx, destination, 0, pan);
      } else {
        // 4. Gentle Bamboo Porch Wind Chime
        const chimeNotes = [783.99, 987.77, 1174.66, 1318.51]; // G5, B5, D6, E6
        const note = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];
        this.triggerWoodenMarimbaNote(ctx, destination, note, 0, (Math.random() * 1.4 - 0.7), 0.022);
      }
    };

    this.natureTimer = window.setInterval(triggerFarmAmbience, 950);
  }

  /**
   * Synthesizes a warm fingerpicked acoustic nylon/steel guitar note with wooden body resonance
   */
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

    // Triangle + Sine for warm acoustic string body, plus octave harmonic pluck
    oscFundamental.type = 'triangle';
    oscHarmonic.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, start);
    oscHarmonic.frequency.setValueAtTime(freq * 2, start);

    // Subtle finger-pluck noise transient
    pluckBurst.buffer = this.getOrCreatePluckBuffer(ctx);
    burstGain.gain.setValueAtTime(peakGain * 0.28, start);
    burstGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);

    // Acoustic guitar lowpass envelope (bright on pluck, warm wooden decay)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(2400, freq * 5.5), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 1.4), start + durationSec * 0.75);

    // String amplitude envelope
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(peakGain * 0.35, start + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    // 2nd harmonic decays faster like a real plucked string
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

  /**
   * Wooden Marimba / Cozy Kalimba mallet strike
   */
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

    // 4th harmonic characteristic of a rosewood marimba bar
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

  /**
   * Sweet Pastoral Ocarina / Wooden Flute note with gentle vibrato
   */
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

    // Gentle breathy vibrato
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

  /**
   * Sweet Morning Songbird Chirp (Cozy Farm Orchard ASMR)
   */
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

  /**
   * Babbling Farm Brook / Watering Can Droplet ASMR
   */
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

  /**
   * Tactile Cozy Game Crop-Harvest "Bloop/Pop" ASMR (like picking a berry/turnip in Stardew Valley)
   */
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

  /**
   * Joyful Cozy Farm Harvest / Level-Up Confirmation Chime on 2x tap
   */
  private playHarvestConfirmationSfx(
    ctx: AudioContext,
    destination: AudioNode,
    turningOn: boolean,
    peakGain = 0.048,
  ): void {
    // G Major pentatonic harvest sparkle (G4 - B4 - D5 - G5) on turn-on, gentle descending wood chime on turn-off
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
