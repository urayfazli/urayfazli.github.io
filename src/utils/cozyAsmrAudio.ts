// Procedural Cozy Felt-Piano & Night Rain / Vinyl ASMR Soundscape Engine
// Uses Web Audio API with cached stereo noise buffers and automatic transient node cleanup.

class CozyAsmrSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private rainBuffer: AudioBuffer | null = null;
  private isPlaying = false;
  private isTransitioning = false;
  private chordTimer: number | null = null;
  private dropletTimer: number | null = null;
  private stopTimeout: number | null = null;
  private activeNodes: AudioNode[] = [];

  public getPlayingState(): boolean {
    return this.isPlaying;
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
        this.rainBuffer = null;
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.cleanupNodes();
      this.isPlaying = true;

      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Master output gain with gentle fade-in
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.38, now + 1.1);
      master.connect(ctx.destination);
      this.masterGain = master;
      this.activeNodes.push(master);

      // 1. ASMR Warm Night Rain & Vinyl Crackle Layer (Cached Stereo Buffer)
      this.startAsmrRainAndVinylLayer(ctx, master);

      // 2. Cozy Sub-Warmth Pad Layer
      this.startCozyWarmthDrone(ctx, master);

      // 3. Cozy Felt-Piano / Kalimba Lo-Fi Progression Loop
      this.startCozyChordLoop(ctx, master);

      // 4. Delicate ASMR Raindrop / Wood-Tap Micro-Triggers
      this.startAsmrDropletLoop(ctx, master);

      // Play an immediate gentle welcome chime so the user hears instant confirmation on 2x tap
      this.playConfirmationChime(ctx, master, true);
    } finally {
      this.isTransitioning = false;
    }
  }

  public stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    this.clearTimers();

    if (this.ctx && this.masterGain) {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      try {
        this.playConfirmationChime(ctx, this.masterGain, false);
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.001), now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
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
      }, 600);
    } else {
      this.cleanupNodes();
    }
  }

  private clearTimers(): void {
    if (this.chordTimer !== null) {
      window.clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.dropletTimer !== null) {
      window.clearInterval(this.dropletTimer);
      this.dropletTimer = null;
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

  private getOrCreateRainBuffer(ctx: AudioContext): AudioBuffer {
    if (this.rainBuffer && this.rainBuffer.sampleRate === ctx.sampleRate) {
      return this.rainBuffer;
    }

    const durationSeconds = 6;
    const sampleRate = ctx.sampleRate;
    const frameCount = sampleRate * durationSeconds;
    const buffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        // Paul Kellet's pink noise filter for warm rain texture
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.018;
        b6 = white * 0.115926;

        // Subtle vinyl / fireplace ASMR crackle impulses
        let crackle = 0;
        if (Math.random() < 0.0014) {
          crackle = (Math.random() * 2 - 1) * 0.22;
        }

        data[i] = pink + crackle;
      }
    }

    this.rainBuffer = buffer;
    return buffer;
  }

  /**
   * Plays a stereo 6-second loop containing:
   * - Soft pink/brown noise (cozy night rain on window)
   * - Subtle vinyl crackle & ASMR micro-pop impulses panned across left/right earphones
   */
  private startAsmrRainAndVinylLayer(ctx: AudioContext, destination: AudioNode): void {
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.getOrCreateRainBuffer(ctx);
    noiseSource.loop = true;

    // Warm low-pass filter so the rain sounds muffled & cozy (inside a room with earphones)
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1350;
    lowpass.Q.value = 0.5;

    // Slow breathing LFO on filter cutoff for natural rain wave motion
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.14;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 280;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.52;

    noiseSource.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(destination);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, lowpass, lfo, lfoGain, rainGain);
  }

  /**
   * Soft sub-pad warmth so the soundscape feels like a warm blanket
   */
  private startCozyWarmthDrone(ctx: AudioContext, destination: AudioNode): void {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Warm F2 & C3 fifth interval
    osc1.frequency.value = 87.31;
    osc2.frequency.value = 130.81;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;

    const padGain = ctx.createGain();
    padGain.gain.value = 0.09;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(padGain);
    padGain.connect(destination);

    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2, filter, padGain);
  }

  /**
   * Cozy Lo-Fi Rhodes / Felt Piano Chord Progression + Kalimba Melody
   */
  private startCozyChordLoop(ctx: AudioContext, destination: AudioNode): void {
    // Cozy nostalgia progression: Fmaj9 -> Em7 -> Dm9 -> Cmaj9
    const chords: { notes: number[]; melody: number[] }[] = [
      {
        // Fmaj9 (F3, A3, C4, E4, G4)
        notes: [174.61, 220.0, 261.63, 329.63, 392.0],
        melody: [523.25, 659.25, 587.33],
      },
      {
        // Em7 (E3, G3, B3, D4, G4)
        notes: [164.81, 196.0, 246.94, 293.66, 392.0],
        melody: [493.88, 587.33, 523.25],
      },
      {
        // Dm9 (D3, F3, A3, C4, E4)
        notes: [146.83, 174.61, 220.0, 261.63, 329.63],
        melody: [440.0, 523.25, 659.25],
      },
      {
        // Cmaj9 (C3, E3, G3, B3, D4)
        notes: [130.81, 164.81, 196.0, 246.94, 293.66],
        melody: [392.0, 493.88, 587.33],
      },
    ];

    let step = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const chord = chords[step % chords.length];
      step++;

      // Strum each note of the chord slightly arpeggiated like a gentle felt piano / guitar
      chord.notes.forEach((freq, idx) => {
        const delaySec = idx * 0.085;
        const pan = (idx - 2) * 0.22; // Gentle stereo spread across earphones
        this.triggerFeltPianoNote(ctx, destination, freq, delaySec, 3.6, 0.055, pan);
      });

      // Play 2 delicate music-box / kalimba notes in between
      const m1 = chord.melody[Math.floor(Math.random() * chord.melody.length)];
      const m2 = chord.melody[Math.floor(Math.random() * chord.melody.length)];
      this.triggerKalimbaPluck(ctx, destination, m1, 1.35, -0.35);
      this.triggerKalimbaPluck(ctx, destination, m2, 2.55, 0.35);
    };

    // Play first chord right away
    playChordStep();
    this.chordTimer = window.setInterval(playChordStep, 3800);
  }

  /**
   * Subtle ASMR binaural water droplets / soft wooden ear-taps panned left and right
   */
  private startAsmrDropletLoop(ctx: AudioContext, destination: AudioNode): void {
    const playDroplet = () => {
      if (!this.isPlaying || !this.ctx) return;
      if (Math.random() > 0.72) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      // Soft resonant ASMR droplet / wooden tap frequency
      const baseFreq = 520 + Math.random() * 680;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.38, now + 0.065);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      if (panner) {
        // Binaural left/right earphone placement
        panner.pan.setValueAtTime((Math.random() * 2 - 1) * 0.78, now);
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
          // Ignore disconnect errors
        }
      };

      osc.start(now);
      osc.stop(now + 0.1);
    };

    this.dropletTimer = window.setInterval(playDroplet, 650);
  }

  private triggerFeltPianoNote(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    durationSec: number,
    peakGain: number,
    panValue: number
  ): void {
    const start = ctx.currentTime + delaySec;
    const oscMain = ctx.createOscillator();
    const oscWarm = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    oscMain.type = 'sine';
    oscWarm.type = 'triangle';

    // Subtle lo-fi detune warmth
    oscMain.frequency.setValueAtTime(freq, start);
    oscWarm.frequency.setValueAtTime(freq * 1.0015, start);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(920, start);
    filter.frequency.exponentialRampToValueAtTime(340, start + durationSec);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    oscMain.connect(filter);
    oscWarm.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.setValueAtTime(panValue, start);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }

    oscMain.onended = () => {
      try {
        oscMain.disconnect();
        oscWarm.disconnect();
        filter.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    };

    oscMain.start(start);
    oscWarm.start(start);
    oscMain.stop(start + durationSec + 0.05);
    oscWarm.stop(start + durationSec + 0.05);
  }

  private triggerKalimbaPluck(
    ctx: AudioContext,
    destination: AudioNode,
    freq: number,
    delaySec: number,
    panValue: number
  ): void {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // Gentle bell overtone characteristic of a wooden kalimba tine
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.98, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.038, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.45);

    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.linearRampToValueAtTime(0.009, start + 0.008);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

    osc.connect(gain);
    overtone.connect(overtoneGain);
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
        overtone.disconnect();
        overtoneGain.disconnect();
        gain.disconnect();
        panner?.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    };

    osc.start(start);
    overtone.start(start);
    osc.stop(start + 1.5);
    overtone.stop(start + 0.22);
  }

  private playConfirmationChime(ctx: AudioContext, destination: AudioNode, turningOn: boolean): void {
    const notes = turningOn ? [523.25, 659.25, 783.99] : [659.25, 523.25];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.045, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain);
      gain.connect(destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      };
      osc.start(start);
      osc.stop(start + 0.38);
    });
  }
}

export const cozyAsmrAudio = new CozyAsmrSoundEngine();
