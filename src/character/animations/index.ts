import { clamp, damp } from '../../utils/lerp';
import { easeInOutSine, easeOutBack } from '../../utils/easing';

/**
 * Section 18 — Animation States
 */
export enum CharacterAnimationState {
  IDLE = 'IDLE',
  BLINK = 'BLINK',
  TALK = 'TALK',
  WAVE = 'WAVE',
  LOOK_LEFT = 'LOOK_LEFT',
  LOOK_RIGHT = 'LOOK_RIGHT',
  HAPPY = 'HAPPY',
  LOOK_UP = 'LOOK_UP',
  LOOK_DOWN = 'LOOK_DOWN',
  HEAD_TILT = 'HEAD_TILT',
}

export type PlayableAnimationName =
  | 'idle'
  | 'blink'
  | 'talk'
  | 'speak'
  | 'wave'
  | 'greet'
  | 'head_tilt'
  | 'happy'
  | 'look_left'
  | 'look_right'
  | 'look_up'
  | 'look_down';

/**
 * Priority Hierarchy:
 * interaction / talk (4) > expression (3) > blink (2) > idle (1)
 */
export const STATE_PRIORITY: Record<CharacterAnimationState, number> = {
  [CharacterAnimationState.TALK]: 4,
  [CharacterAnimationState.WAVE]: 4,
  [CharacterAnimationState.HAPPY]: 4,
  [CharacterAnimationState.HEAD_TILT]: 4,
  [CharacterAnimationState.LOOK_LEFT]: 3,
  [CharacterAnimationState.LOOK_RIGHT]: 3,
  [CharacterAnimationState.LOOK_UP]: 3,
  [CharacterAnimationState.LOOK_DOWN]: 3,
  [CharacterAnimationState.BLINK]: 2,
  [CharacterAnimationState.IDLE]: 1,
};

export interface EvaluatedRigPose {
  state: CharacterAnimationState;
  rootY: number;
  bodyY: number;
  bodyScaleY: number;
  hoodieRotZ: number;
  armLeftX: number;
  armLeftY: number;
  armLeftRotZ: number;
  armRightX: number;
  armRightY: number;
  armRightRotZ: number;
  stringLeftRotZ: number;
  stringRightRotZ: number;
  headX: number;
  headY: number;
  headRotZ: number;
  eyeScaleX: number;
  eyeScaleY: number;
  isTalking: boolean;
  mouthOpenAmount: number;
  mouthScaleX: number;
  mouthScaleY: number;
  mouthY: number;
  mouthRotZ: number;
  happyBounceScale: number;
}

export class AnimationController {
  private elapsedTime = 0;
  private currentState: CharacterAnimationState = CharacterAnimationState.IDLE;

  // Blink system timers (Section 5: 3-7s interval, 120-180ms duration)
  private nextBlinkTimer = 3.2;
  private isBlinking = false;
  private blinkElapsed = 0;
  private blinkDuration = 0.15;

  // Active interaction animation timer
  private activeInteraction: CharacterAnimationState | null = null;
  private interactionElapsed = 0;
  private interactionDuration = 0;

  // Live text-bubble phoneme/viseme lip-sync state
  private hasSpeechViseme = false;
  private speechVisemeActive = false;
  private targetVisemeOpen = 0;
  private targetVisemeWidth = 1;
  private smoothedVisemeOpen = 0;
  private smoothedVisemeWidth = 1;

  // Smooth phrase-level head motion state while speaking (prevents 12Hz phoneme jitter & 3.4s cutoff snaps)
  private talkElapsed = 0;
  private talkPopElapsed = 10;
  private speechPauseTimer = 0;
  private smoothedHeadTalkEnergy = 0;
  private smoothedSyllableAccent = 0;

  constructor() {
    this.scheduleNextBlink();
  }

  public setSpeechViseme(
    openAmount: number,
    widthFactor = 1,
    active = true
  ): void {
    this.hasSpeechViseme = true;
    this.speechVisemeActive = active;
    this.targetVisemeOpen = active ? clamp(openAmount, 0, 1) : 0;
    this.targetVisemeWidth = active ? clamp(widthFactor, 0.85, 1.15) : 1;
    if (active && openAmount > 0.14) {
      this.speechPauseTimer = 0;
    }
  }

  private scheduleNextBlink(): void {
    this.nextBlinkTimer = 3.0 + Math.random() * 4.0;
    this.blinkDuration = 0.12 + Math.random() * 0.06;
  }

  public getState(): CharacterAnimationState {
    return this.currentState;
  }

  /**
   * Triggers a specific animation respecting the state priority system:
   * interaction > expression > blink > idle
   */
  public playAnimation(name: PlayableAnimationName | string): void {
    const normalized = name.toLowerCase().trim();

    if (normalized === 'idle' || normalized === 'wave' || normalized === 'greet') {
      this.activeInteraction = null;
      this.currentState = CharacterAnimationState.IDLE;
      return;
    }

    if (normalized === 'blink') {
      if (!this.isBlinking) {
        this.isBlinking = true;
        this.blinkElapsed = 0;
        this.blinkDuration = 0.13 + Math.random() * 0.05;
      }
      return;
    }

    let targetState: CharacterAnimationState = CharacterAnimationState.TALK;
    let duration = 3.4;

    switch (normalized) {
      case 'talk':
      case 'speak':
        targetState = CharacterAnimationState.TALK;
        duration = 12.0;
        break;
      case 'happy':
      case 'happy_bounce':
        targetState = CharacterAnimationState.HAPPY;
        duration = 1.05;
        break;
      case 'head_tilt':
      case 'tilt':
        targetState = CharacterAnimationState.HEAD_TILT;
        duration = 1.0;
        break;
      case 'look_left':
        targetState = CharacterAnimationState.LOOK_LEFT;
        duration = 0.9;
        break;
      case 'look_right':
        targetState = CharacterAnimationState.LOOK_RIGHT;
        duration = 0.9;
        break;
      case 'look_up':
        targetState = CharacterAnimationState.LOOK_UP;
        duration = 0.9;
        break;
      case 'look_down':
        targetState = CharacterAnimationState.LOOK_DOWN;
        duration = 0.9;
        break;
      default:
        targetState = CharacterAnimationState.TALK;
        duration = 12.0;
        break;
    }

    const incomingPriority = STATE_PRIORITY[targetState];
    const currentPriority = this.activeInteraction
      ? STATE_PRIORITY[this.activeInteraction]
      : STATE_PRIORITY[CharacterAnimationState.IDLE];

    if (incomingPriority >= currentPriority) {
      if (targetState === CharacterAnimationState.TALK) {
        // Trigger a gentle initial speaking nod without resetting continuous talkElapsed phase
        this.talkPopElapsed = 0;
        if (this.activeInteraction !== CharacterAnimationState.TALK) {
          this.interactionElapsed = 0;
        }
      } else {
        this.interactionElapsed = 0;
      }
      this.activeInteraction = targetState;
      this.interactionDuration = duration;
    }
  }

  /**
   * Triggers the 2D Rig talking animation when the character is clicked/tapped.
   */
  public playRandomPlayfulAnimation(): PlayableAnimationName {
    this.playAnimation('talk');
    return 'talk';
  }

  /**
   * Evaluates the discrete blink curve:
   * open eyes (1.0) -> half closed (0.48) -> closed (0.08) -> open (1.0)
   */
  private evaluateBlinkScaleY(progress: number): number {
    if (progress < 0.28) {
      const t = progress / 0.28;
      return 1.0 - t * 0.52;
    }
    if (progress < 0.58) {
      const t = (progress - 0.28) / 0.3;
      return 0.48 - easeInOutSine(t) * 0.4;
    }
    const t = (progress - 0.58) / 0.42;
    return 0.08 + easeInOutSine(clamp(t, 0, 1)) * 0.92;
  }

  public update(
    delta: number,
    planeHeight: number,
    reducedMotion: boolean,
    cursorNormX: number,
    cursorNormY: number,
    isCozyMode = false,
    isBubbleActive = false
  ): EvaluatedRigPose {
    const dt = Math.min(delta, 0.1);
    this.elapsedTime += dt;

    // 1. Update Automatic Blink System (3-7s interval, 120-180ms duration)
    let eyeScaleY = 1.0;
    if (this.isBlinking) {
      this.blinkElapsed += dt;
      const p = this.blinkElapsed / this.blinkDuration;
      if (p >= 1) {
        this.isBlinking = false;
        this.scheduleNextBlink();
        eyeScaleY = 1.0;
      } else {
        eyeScaleY = this.evaluateBlinkScaleY(p);
      }
    } else {
      this.nextBlinkTimer -= dt;
      if (this.nextBlinkTimer <= 0) {
        this.isBlinking = true;
        this.blinkElapsed = 0;
      }
    }

    // 2. Base Subtle Idle Animation (Section 4: 6.0s loop duration, 2-4px breathing)
    const idleCyclePeriod = 6.0;
    const omega = (Math.PI * 2) / idleCyclePeriod;
    const breathWave = reducedMotion ? 0 : Math.sin(this.elapsedTime * omega);
    const secondaryWave = reducedMotion ? 0 : Math.sin(this.elapsedTime * omega - 0.65);
    const slowFloatWave = reducedMotion ? 0 : Math.cos(this.elapsedTime * omega * 0.5);

    const pxToWorld = planeHeight / 420;
    let rootY = slowFloatWave * 1.1 * pxToWorld;
    let bodyY = breathWave * 2.2 * pxToWorld;
    let bodyScaleY = 1 + breathWave * 0.005;
    let hoodieRotZ = secondaryWave * 0.003;

    // Subtle idle breathing at the shoulders
    let armLeftX = 0;
    let armLeftY = secondaryWave * 1.0 * pxToWorld;
    let armLeftRotZ = -breathWave * 0.011;

    let armRightX = 0;
    let armRightY = secondaryWave * 1.0 * pxToWorld;
    let armRightRotZ = breathWave * 0.011;

    let stringLeftRotZ = Math.sin(this.elapsedTime * omega - 0.9) * 0.016;
    let stringRightRotZ = Math.sin(this.elapsedTime * omega - 1.1) * -0.015;
    let headX = 0;
    // Couple headY to bodyY so the neck never stretches or compresses during breathing
    let headY = bodyY + secondaryWave * 0.45 * pxToWorld;
    let headRotZ = Math.sin(this.elapsedTime * omega * 0.5 - 0.4) * 0.011;
    let happyBounceScale = 1;

    // 2D Rig Mouth defaults
    let isTalking = false;
    let mouthOpenAmount = 0;
    let mouthScaleX = 1;
    let mouthScaleY = 1;
    let mouthY = 0;
    let mouthRotZ = 0;

    // Smoothly track live text-bubble phoneme/viseme targets for crisp lip-sync
    const targetOpen =
      isBubbleActive && this.speechVisemeActive ? this.targetVisemeOpen : 0;
    const targetWidth =
      isBubbleActive && this.speechVisemeActive ? this.targetVisemeWidth : 1;
    this.smoothedVisemeOpen = damp(this.smoothedVisemeOpen, targetOpen, 24, dt);
    this.smoothedVisemeWidth = damp(
      this.smoothedVisemeWidth,
      targetWidth,
      20,
      dt
    );

    // Track phrase-level speaking activity for the head (immune to 12Hz consonant/vowel chatter)
    this.talkElapsed += dt;
    this.talkPopElapsed = Math.min(10, this.talkPopElapsed + dt);
    if (isBubbleActive && this.speechVisemeActive && this.targetVisemeOpen <= 0.14) {
      this.speechPauseTimer += dt;
    } else if (!isBubbleActive || !this.speechVisemeActive) {
      this.speechPauseTimer = 1;
    }

    const activelyVocalizing =
      isBubbleActive &&
      (this.hasSpeechViseme
        ? this.speechVisemeActive
        : this.activeInteraction === CharacterAnimationState.TALK);

    // During normal word flow (speechPauseTimer < 0.18s), keep head energy steady at 1.0;
    // during punctuation pauses (',' '.' '!' '?'), dip gently to 0.35; when finished, damp to 0.
    const rawTargetHeadEnergy = activelyVocalizing
      ? this.hasSpeechViseme && this.speechPauseTimer >= 0.18
        ? 0.35
        : 1.0
      : 0;
    this.smoothedHeadTalkEnergy = damp(
      this.smoothedHeadTalkEnergy,
      reducedMotion ? 0 : rawTargetHeadEnergy,
      5.5,
      dt
    );
    this.smoothedSyllableAccent = damp(
      this.smoothedSyllableAccent,
      reducedMotion ? 0 : targetOpen,
      9.5,
      dt
    );

    // If speech bubble is closed, cancel any active TALK state immediately so mouth never animates without a bubble
    if (!isBubbleActive && this.activeInteraction === CharacterAnimationState.TALK) {
      this.activeInteraction = null;
      this.speechVisemeActive = false;
      this.smoothedVisemeOpen = 0;
    }

    // 3. Evaluate Active Non-Talk Interaction Animations (head_tilt, happy, look_*)
    if (
      this.activeInteraction &&
      this.activeInteraction !== CharacterAnimationState.TALK
    ) {
      this.interactionElapsed += dt;
      const p = clamp(this.interactionElapsed / this.interactionDuration, 0, 1);
      const envelope = Math.sin(p * Math.PI);

      switch (this.activeInteraction) {
        case CharacterAnimationState.HEAD_TILT: {
          const tiltCurve = easeOutBack(Math.sin(p * Math.PI), 1.15);
          headRotZ += 0.065 * tiltCurve;
          headX += -1.2 * pxToWorld * tiltCurve;
          headY += 0.8 * pxToWorld * tiltCurve;
          armRightRotZ += 0.028 * tiltCurve;
          armLeftRotZ -= 0.028 * tiltCurve;
          break;
        }
        case CharacterAnimationState.HAPPY: {
          const bounce = Math.abs(Math.sin(p * Math.PI * 2));
          const bounceOffset = bounce * 3.8 * pxToWorld * envelope;
          rootY += bounceOffset;
          bodyScaleY += bounce * 0.011 * envelope;
          happyBounceScale = 1 + bounce * 0.01 * envelope;
          headRotZ += Math.sin(p * Math.PI * 2) * 0.026 * envelope;
          armRightY += bounce * 2.2 * pxToWorld * envelope;
          armLeftY += bounce * 2.2 * pxToWorld * envelope;
          armRightRotZ += bounce * 0.038 * envelope;
          armLeftRotZ -= bounce * 0.038 * envelope;
          eyeScaleY = Math.min(eyeScaleY, 1 - envelope * 0.78);
          break;
        }
        case CharacterAnimationState.LOOK_LEFT: {
          headRotZ += 0.05 * envelope;
          headX -= 1.5 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_RIGHT: {
          headRotZ -= 0.05 * envelope;
          headX += 1.5 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_UP: {
          headY += 2.2 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_DOWN: {
          headY -= 2.2 * pxToWorld * envelope;
          break;
        }
        default:
          break;
      }

      if (p >= 1) {
        this.activeInteraction = null;
      }
    }

    // 3b. Unified Continuous Speaking Animation (Active whenever speech bubble is open or talking)
    if (
      isBubbleActive ||
      this.activeInteraction === CharacterAnimationState.TALK ||
      this.smoothedHeadTalkEnergy > 0.005
    ) {
      const t = this.talkElapsed;

      if (isBubbleActive) {
        if (this.hasSpeechViseme) {
          mouthOpenAmount = this.smoothedVisemeOpen;
          isTalking = this.speechVisemeActive || mouthOpenAmount > 0.02;
        } else {
          const phraseGate = Math.sin(t * 3.6) > -0.55 ? 1 : 0;
          const beatWave =
            Math.sin(t * 24.0) * 0.65 + Math.sin(t * 13.5) * 0.35;
          mouthOpenAmount =
            phraseGate > 0 ? clamp((beatWave + 0.25) * 0.86, 0, 1) : 0;
          isTalking = true;
        }
      }

      const isOpenSyllable = mouthOpenAmount > 0.24;
      const widthMod = this.hasSpeechViseme ? this.smoothedVisemeWidth : 1;
      mouthScaleX =
        widthMod *
        (isOpenSyllable
          ? 0.94 + mouthOpenAmount * 0.14
          : 0.98 + mouthOpenAmount * 0.06);
      mouthScaleY = isOpenSyllable
        ? 0.66 + mouthOpenAmount * 0.48
        : 0.96 + mouthOpenAmount * 0.12;
      mouthY = -mouthOpenAmount * 1.2 * pxToWorld;
      mouthRotZ = Math.sin(t * 6.2) * 0.018 * mouthOpenAmount;

      // Soft initial greeting pop over the first 0.42s when a bubble opens
      const popProgress = clamp(this.talkPopElapsed / 0.42, 0, 1);
      const startPop =
        popProgress < 1 && !reducedMotion ? Math.sin(popProgress * Math.PI) : 0;

      const talkEnergy = this.smoothedHeadTalkEnergy;
      const syllableNod = this.smoothedSyllableAccent;

      // Smooth, natural phrase-cadence head tilt around the neck joint (~1.9 deg max, zero jitter)
      const talkTiltWave =
        (Math.sin(t * 2.15) * 0.022 + Math.cos(t * 1.25) * 0.011) * talkEnergy +
        startPop * 0.014;

      // Gentle zero-centered rhythmic head nod coupled with torso so the neck never stretches
      const rhythmNod = Math.sin(t * 3.6) * talkEnergy;
      const bodyTalkLift = (startPop * 1.4 + Math.abs(rhythmNod) * 0.55) * pxToWorld;

      rootY += startPop * 1.2 * pxToWorld;
      bodyY += bodyTalkLift;
      bodyScaleY += startPop * 0.004 + Math.abs(rhythmNod) * 0.0025;
      happyBounceScale = 1 + startPop * 0.004;

      headRotZ += talkTiltWave;
      // Keep neck pivot horizontally aligned with torso; rotation around neck pivot naturally arcs the head!
      headX += Math.sin(t * 2.15) * 0.35 * pxToWorld * talkEnergy;
      // Head rides smoothly on bodyY + gentle conversational nod + tiny downward jaw accent on vowels
      headY =
        bodyY +
        secondaryWave * 0.4 * pxToWorld +
        (rhythmNod * 0.65 - syllableNod * 0.35 + startPop * 0.5) * pxToWorld;

      hoodieRotZ += Math.sin(t * 2.15) * 0.005 * talkEnergy;
      armRightRotZ += (startPop * 0.018 + Math.abs(rhythmNod) * 0.012) * talkEnergy;
      armLeftRotZ -= (startPop * 0.018 + Math.abs(rhythmNod) * 0.012) * talkEnergy;

      // Gentle pendulum sway on hoodie drawstrings while speaking
      stringLeftRotZ += Math.sin(t * 4.2) * 0.018 * talkEnergy;
      stringRightRotZ -= Math.sin(t * 4.2) * 0.018 * talkEnergy;

      if (!isBubbleActive && this.smoothedHeadTalkEnergy <= 0.01) {
        this.activeInteraction = null;
      }
    }

    // 3c. Gentle Cozy Backsound Head/Body Groove (Coordinated headY & bodyY so neck stays intact)
    if (isCozyMode && !reducedMotion) {
      const t = this.elapsedTime;
      const grooveBeat = Math.sin(t * 3.0);
      const grooveLift = Math.abs(grooveBeat) * 0.9 * pxToWorld;
      headRotZ += grooveBeat * 0.016;
      bodyY += grooveLift;
      headY += grooveLift + Math.cos(t * 3.0) * 0.35 * pxToWorld;
    }

    // Slightly widen X as Y closes so closed eyes form a crisp horizontal anime eyelid line
    const eyeScaleX = 1 + (1 - eyeScaleY) * 0.16;

    // 4. Determine Resolved Priority State (Section 18)
    if (this.activeInteraction) {
      this.currentState = this.activeInteraction;
    } else if (Math.abs(cursorNormX) > 0.32 || Math.abs(cursorNormY) > 0.32) {
      if (Math.abs(cursorNormX) >= Math.abs(cursorNormY)) {
        this.currentState =
          cursorNormX < 0
            ? CharacterAnimationState.LOOK_LEFT
            : CharacterAnimationState.LOOK_RIGHT;
      } else {
        this.currentState =
          cursorNormY > 0
            ? CharacterAnimationState.LOOK_UP
            : CharacterAnimationState.LOOK_DOWN;
      }
    } else if (this.isBlinking) {
      this.currentState = CharacterAnimationState.BLINK;
    } else {
      this.currentState = CharacterAnimationState.IDLE;
    }

    return {
      state: this.currentState,
      rootY,
      bodyY,
      bodyScaleY,
      hoodieRotZ,
      armLeftX,
      armLeftY,
      armLeftRotZ,
      armRightX,
      armRightY,
      armRightRotZ,
      stringLeftRotZ,
      stringRightRotZ,
      headX,
      headY,
      headRotZ,
      eyeScaleX,
      eyeScaleY,
      isTalking,
      mouthOpenAmount,
      mouthScaleX,
      mouthScaleY,
      mouthY,
      mouthRotZ,
      happyBounceScale,
    };
  }
}

function smoothstep01(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
