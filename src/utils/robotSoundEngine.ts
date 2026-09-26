/**
 * Dedicated Robot Character Voice & Servo Sound Synthesizer
 *
 * Menggunakan instance AudioContext tersendiri (terpisah dari BGM player)
 * sehingga efek suara robot tetap berbunyi jernih baik saat BGM sedang Play maupun Pause.
 * Setiap karakter memiliki karakter suara (pitch contour, FM timbre, dan artikulasi) yang unik.
 */

export type RobotCharacterId =
  | 'coder'
  | 'sentry'
  | 'forge'
  | 'courier'
  | 'aptos'
  | 'sei'
  | 'subquery'
  | 'djbot'
  | 'hero';

class RobotSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private variationCounter: Record<RobotCharacterId, number> = {
    coder: 0,
    sentry: 0,
    forge: 0,
    courier: 0,
    aptos: 0,
    sei: 0,
    subquery: 0,
    djbot: 0,
    hero: 0,
  };

  private getContext(): { ctx: AudioContext; out: GainNode } | null {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.34;
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {
          // Ignore if blocked outside user gesture
        });
      }

      if (!this.masterGain) return null;
      return { ctx: this.ctx, out: this.masterGain };
    } catch {
      return null;
    }
  }

  /**
   * Helper to synthesize an expressive FM/formant robot vocal syllable with pitch glide
   */
  private playSyllable(
    ctx: AudioContext,
    out: GainNode,
    opts: {
      startTime: number;
      duration: number;
      startFreq: number;
      endFreq: number;
      carrierType?: OscillatorType;
      modFreq?: number;
      modDepth?: number;
      filterFreq?: number;
      filterQ?: number;
      gain?: number;
    }
  ) {
    const {
      startTime,
      duration,
      startFreq,
      endFreq,
      carrierType = 'square',
      modFreq = 45,
      modDepth = 35,
      filterFreq = 2200,
      filterQ = 4.5,
      gain = 0.25,
    } = opts;

    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    carrier.type = carrierType;
    carrier.frequency.setValueAtTime(Math.max(40, startFreq), startTime);
    carrier.frequency.exponentialRampToValueAtTime(
      Math.max(40, endFreq),
      startTime + duration
    );

    // FM Robotic Vocal Cord Texture
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(modFreq, startTime);
    modGain.gain.setValueAtTime(modDepth, startTime);
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Resonant Formant Filter for cute droid "talking" character
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, startTime);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(300, filterFreq * 1.35),
      startTime + duration
    );
    filter.Q.value = filterQ;

    // Crisp envelope
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(gain, startTime + Math.min(0.014, duration * 0.25));
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    carrier.connect(filter);
    filter.connect(env);
    env.connect(out);

    carrier.onended = () => {
      try {
        carrier.disconnect();
        modulator.disconnect();
        modGain.disconnect();
        filter.disconnect();
        env.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    };

    carrier.start(startTime);
    modulator.start(startTime);
    carrier.stop(startTime + duration + 0.015);
    modulator.stop(startTime + duration + 0.015);
  }

  /**
   * Play unique robot sound for the specified animated character
   */
  public play(character: RobotCharacterId) {
    const audio = this.getContext();
    if (!audio) return;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const variant = this.variationCounter[character] % 2;
    this.variationCounter[character] += 1;
    const pitchShift = variant === 0 ? 1 : 1.08;

    switch (character) {
      case 'coder': {
        // "DEV-UNIT 01" (About Me Card): Cheerful CRT chirp + fast mechanical typing blips
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.075,
          startFreq: 520 * pitchShift,
          endFreq: 780 * pitchShift,
          carrierType: 'square',
          modFreq: 68,
          modDepth: 45,
          filterFreq: 1900,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.085,
          duration: 0.065,
          startFreq: 840 * pitchShift,
          endFreq: 660 * pitchShift,
          carrierType: 'triangle',
          modFreq: 90,
          modDepth: 30,
          filterFreq: 2400,
          gain: 0.25,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.16,
          duration: 0.11,
          startFreq: 740 * pitchShift,
          endFreq: 1180 * pitchShift,
          carrierType: 'square',
          modFreq: 55,
          modDepth: 60,
          filterFreq: 2800,
          gain: 0.3,
        });
        break;
      }

      case 'sentry': {
        // "SENTRY-99" (Node Operations Card): Tactical radar scanner sweep + armor lock confirmation
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.11,
          startFreq: 310 * pitchShift,
          endFreq: 620 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 38,
          modDepth: 85,
          filterFreq: 1400,
          filterQ: 5.5,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.12,
          duration: 0.07,
          startFreq: 880 * pitchShift,
          endFreq: 880 * pitchShift,
          carrierType: 'square',
          modFreq: 120,
          modDepth: 25,
          filterFreq: 2600,
          gain: 0.24,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.2,
          duration: 0.13,
          startFreq: 660 * pitchShift,
          endFreq: 1320 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 48,
          modDepth: 50,
          filterFreq: 3000,
          gain: 0.28,
        });
        break;
      }

      case 'forge': {
        // "FORGE-03" (Experience Card Header): Heavy isometric block-forge clank + harmonic crystal chime
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.09,
          startFreq: 240 * pitchShift,
          endFreq: 180 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 28,
          modDepth: 110,
          filterFreq: 950,
          filterQ: 6,
          gain: 0.32,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.095,
          duration: 0.08,
          startFreq: 587.33 * pitchShift,
          endFreq: 880 * pitchShift,
          carrierType: 'square',
          modFreq: 64,
          modDepth: 40,
          filterFreq: 2200,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.18,
          duration: 0.14,
          startFreq: 1174.66 * pitchShift,
          endFreq: 1567.98 * pitchShift,
          carrierType: 'triangle',
          modFreq: 80,
          modDepth: 30,
          filterFreq: 3400,
          filterQ: 3.5,
          gain: 0.28,
        });
        break;
      }

      case 'courier': {
        // "COURIER-7" (Connect Card): Friendly R2-style whistle greeting ("gm ser!")
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.09,
          startFreq: 680 * pitchShift,
          endFreq: 1240 * pitchShift,
          carrierType: 'sine',
          modFreq: 52,
          modDepth: 95,
          filterFreq: 2600,
          filterQ: 3,
          gain: 0.32,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.095,
          duration: 0.07,
          startFreq: 1180 * pitchShift,
          endFreq: 790 * pitchShift,
          carrierType: 'triangle',
          modFreq: 75,
          modDepth: 55,
          filterFreq: 2200,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.175,
          duration: 0.12,
          startFreq: 860 * pitchShift,
          endFreq: 1480 * pitchShift,
          carrierType: 'sine',
          modFreq: 60,
          modDepth: 80,
          filterFreq: 3100,
          gain: 0.32,
        });
        break;
      }

      case 'aptos': {
        // Aptos Aero-Sprinter Droid: High-TPS aerodynamic zip + rapid triple telemetry pulse
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.06,
          startFreq: 600 * pitchShift,
          endFreq: 1450 * pitchShift,
          carrierType: 'square',
          modFreq: 95,
          modDepth: 50,
          filterFreq: 3000,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.065,
          duration: 0.055,
          startFreq: 920 * pitchShift,
          endFreq: 1680 * pitchShift,
          carrierType: 'square',
          modFreq: 110,
          modDepth: 45,
          filterFreq: 3400,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.13,
          duration: 0.09,
          startFreq: 1200 * pitchShift,
          endFreq: 1960 * pitchShift,
          carrierType: 'triangle',
          modFreq: 70,
          modDepth: 35,
          filterFreq: 3800,
          gain: 0.28,
        });
        break;
      }

      case 'sei': {
        // Sei Twin-Turbo Parallel Bot: Dual-core electric buzz + twin harmonic chord flash
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.08,
          startFreq: 360 * pitchShift,
          endFreq: 720 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 115,
          modDepth: 90,
          filterFreq: 1800,
          filterQ: 5,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.085,
          duration: 0.11,
          startFreq: 540 * pitchShift,
          endFreq: 1080 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 140,
          modDepth: 75,
          filterFreq: 2600,
          filterQ: 4.5,
          gain: 0.28,
        });
        break;
      }

      case 'subquery': {
        // SubQuery Indexer Owl-Bot: Analytical owl-bot "hoot-bleep" + monocle lens focus ping
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.1,
          startFreq: 480 * pitchShift,
          endFreq: 410 * pitchShift,
          carrierType: 'triangle',
          modFreq: 32,
          modDepth: 65,
          filterFreq: 1350,
          filterQ: 4,
          gain: 0.3,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.11,
          duration: 0.075,
          startFreq: 980 * pitchShift,
          endFreq: 1340 * pitchShift,
          carrierType: 'sine',
          modFreq: 88,
          modDepth: 45,
          filterFreq: 2900,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.195,
          duration: 0.09,
          startFreq: 760 * pitchShift,
          endFreq: 1120 * pitchShift,
          carrierType: 'triangle',
          modFreq: 64,
          modDepth: 40,
          filterFreq: 2500,
          gain: 0.26,
        });
        break;
      }

      case 'djbot': {
        // DJ Beat-Bot 8-Bit: Funky turntable robot boop-bap + synth drop
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.07,
          startFreq: 440 * pitchShift,
          endFreq: 880 * pitchShift,
          carrierType: 'square',
          modFreq: 85,
          modDepth: 70,
          filterFreq: 2200,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.075,
          duration: 0.065,
          startFreq: 659.25 * pitchShift,
          endFreq: 523.25 * pitchShift,
          carrierType: 'square',
          modFreq: 65,
          modDepth: 55,
          filterFreq: 2000,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.145,
          duration: 0.12,
          startFreq: 587.33 * pitchShift,
          endFreq: 1174.66 * pitchShift,
          carrierType: 'sawtooth',
          modFreq: 50,
          modDepth: 65,
          filterFreq: 2900,
          gain: 0.28,
        });
        break;
      }

      case 'hero': {
        // Main Hero Chibi Character: Warm melodic mecha-chibi greeting arpeggio
        this.playSyllable(ctx, out, {
          startTime: now,
          duration: 0.08,
          startFreq: 523.25 * pitchShift,
          endFreq: 659.25 * pitchShift,
          carrierType: 'triangle',
          modFreq: 55,
          modDepth: 40,
          filterFreq: 2100,
          gain: 0.28,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.085,
          duration: 0.08,
          startFreq: 659.25 * pitchShift,
          endFreq: 783.99 * pitchShift,
          carrierType: 'square',
          modFreq: 72,
          modDepth: 35,
          filterFreq: 2500,
          gain: 0.26,
        });
        this.playSyllable(ctx, out, {
          startTime: now + 0.17,
          duration: 0.13,
          startFreq: 783.99 * pitchShift,
          endFreq: 1046.5 * pitchShift,
          carrierType: 'triangle',
          modFreq: 64,
          modDepth: 50,
          filterFreq: 3000,
          gain: 0.3,
        });
        break;
      }
    }
  }
}

export const robotSound = new RobotSoundEngine();
