import { clamp } from '../../utils/lerp';
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

  constructor() {
    this.scheduleNextBlink();
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
        duration = 3.4;
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
        duration = 3.4;
        break;
    }

    const incomingPriority = STATE_PRIORITY[targetState];
    const currentPriority = this.activeInteraction
      ? STATE_PRIORITY[this.activeInteraction]
      : STATE_PRIORITY[CharacterAnimationState.IDLE];

    if (incomingPriority >= currentPriority) {
      this.activeInteraction = targetState;
      this.interactionElapsed = 0;
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
    let rootY = slowFloatWave * 1.2 * pxToWorld;
    let bodyY = breathWave * 2.5 * pxToWorld;
    let bodyScaleY = 1 + breathWave * 0.0055;
    let hoodieRotZ = secondaryWave * 0.0035;

    // Subtle idle breathing at the shoulders
    let armLeftX = 0;
    let armLeftY = secondaryWave * 1.1 * pxToWorld;
    let armLeftRotZ = -breathWave * 0.012;

    let armRightX = 0;
    let armRightY = secondaryWave * 1.1 * pxToWorld;
    let armRightRotZ = breathWave * 0.012;

    let stringLeftRotZ = Math.sin(this.elapsedTime * omega - 0.9) * 0.018;
    let stringRightRotZ = Math.sin(this.elapsedTime * omega - 1.1) * -0.016;
    let headX = 0;
    let headY = secondaryWave * 1.2 * pxToWorld;
    let headRotZ = Math.sin(this.elapsedTime * omega * 0.5 - 0.4) * 0.012;
    let happyBounceScale = 1;

    // 2D Rig Mouth defaults
    let isTalking = false;
    let mouthOpenAmount = 0;
    let mouthScaleX = 1;
    let mouthScaleY = 1;
    let mouthY = 0;
    let mouthRotZ = 0;

    // 3. Evaluate Active Interaction Animation (talk, head_tilt, happy)
    if (this.activeInteraction) {
      this.interactionElapsed += dt;
      const p = clamp(this.interactionElapsed / this.interactionDuration, 0, 1);
      const envelope = Math.sin(p * Math.PI);

      switch (this.activeInteraction) {
        case CharacterAnimationState.TALK: {
          isTalking = true;
          const t = this.interactionElapsed;

          // Initial excited pop when the bubble appears / switches part
          const startPop = p < 0.16 ? Math.sin((p / 0.16) * Math.PI) : 0;

          // Multi-syllable anime lip-sync cadence (active until p = 0.88, then warm smile)
          const speechWindow =
            smoothstep01(0.02, 0.09, p) * (1 - smoothstep01(0.84, 0.94, p));
          const phraseGate = Math.sin(t * 4.8) > -0.62 ? 1 : 0.15;
          const rawSyllable =
            0.52 +
            0.34 * Math.sin(t * 22.0) +
            0.24 * Math.cos(t * 13.5) +
            0.18 * Math.sin(t * 31.0);
          mouthOpenAmount = clamp(rawSyllable * phraseGate * speechWindow, 0, 1);

          mouthScaleX = 0.94 + mouthOpenAmount * 0.14;
          mouthScaleY = 0.48 + mouthOpenAmount * 0.66;
          mouthY = -mouthOpenAmount * 1.2 * pxToWorld;
          mouthRotZ = Math.sin(t * 7.2) * 0.028 * speechWindow;

          // Expressive conversational head nods & tilts while explaining Crypto/Web3 facts
          const nodWave = Math.abs(Math.sin(t * 5.8)) * speechWindow;
          const tiltWave =
            (Math.sin(t * 3.4) * 0.046 + Math.cos(t * 1.9) * 0.026) * envelope;

          rootY += (startPop * 4.2 + nodWave * 1.8) * pxToWorld;
          bodyY += (startPop * 2.2 + Math.sin(t * 5.8) * 1.4 * speechWindow) * pxToWorld;
          bodyScaleY += startPop * 0.01 + nodWave * 0.006;
          happyBounceScale = 1 + startPop * 0.009;

          headRotZ += tiltWave;
          headX += Math.sin(t * 3.4) * 2.2 * pxToWorld * envelope;
          headY += (startPop * 2.8 + nodWave * 2.4) * pxToWorld;

          hoodieRotZ += Math.sin(t * 3.4) * 0.01 * envelope;
          armRightRotZ += (startPop * 0.03 + nodWave * 0.022) * envelope;
          armLeftRotZ -= (startPop * 0.03 + nodWave * 0.022) * envelope;

          // Secondary pendulum sway on hoodie drawstrings while speaking
          stringLeftRotZ += Math.sin(t * 6.2) * 0.035 * envelope;
          stringRightRotZ -= Math.sin(t * 6.2) * 0.035 * envelope;

          // Expressive conversational blinks + lively eye engagement
          if ((p > 0.14 && p < 0.22) || (p > 0.56 && p < 0.64)) {
            const bp = p < 0.3 ? (p - 0.14) / 0.08 : (p - 0.56) / 0.08;
            eyeScaleY = Math.min(eyeScaleY, 1 - Math.sin(bp * Math.PI) * 0.86);
          } else {
            eyeScaleY = Math.min(eyeScaleY, 1 - mouthOpenAmount * 0.06);
          }
          break;
        }
        case CharacterAnimationState.HEAD_TILT: {
          const tiltCurve = easeOutBack(Math.sin(p * Math.PI), 1.15);
          headRotZ += 0.082 * tiltCurve;
          headX += -2.6 * pxToWorld * tiltCurve;
          headY += 1.5 * pxToWorld * tiltCurve;
          armRightRotZ += 0.035 * tiltCurve;
          armLeftRotZ -= 0.035 * tiltCurve;
          break;
        }
        case CharacterAnimationState.HAPPY: {
          const bounce = Math.abs(Math.sin(p * Math.PI * 2));
          rootY += bounce * 5.5 * pxToWorld * envelope;
          bodyScaleY += bounce * 0.014 * envelope;
          happyBounceScale = 1 + bounce * 0.012 * envelope;
          headRotZ += Math.sin(p * Math.PI * 2) * 0.032 * envelope;
          armRightY += bounce * 2.8 * pxToWorld * envelope;
          armLeftY += bounce * 2.8 * pxToWorld * envelope;
          armRightRotZ += bounce * 0.045 * envelope;
          armLeftRotZ -= bounce * 0.045 * envelope;
          eyeScaleY = Math.min(eyeScaleY, 1 - envelope * 0.78);
          break;
        }
        case CharacterAnimationState.LOOK_LEFT: {
          headRotZ += 0.06 * envelope;
          headX -= 3.2 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_RIGHT: {
          headRotZ -= 0.06 * envelope;
          headX += 3.2 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_UP: {
          headY += 3.5 * pxToWorld * envelope;
          break;
        }
        case CharacterAnimationState.LOOK_DOWN: {
          headY -= 3.5 * pxToWorld * envelope;
          break;
        }
        default:
          break;
      }

      if (p >= 1) {
        this.activeInteraction = null;
      }
    }

    // 3b. Bubble Text Mouth Animation (Active whenever speech bubble is visible, including when backsound is ON)
    if (isBubbleActive && !isTalking) {
      isTalking = true;
      const t = this.elapsedTime;
      const phraseGate = Math.sin(t * 4.2) > -0.45 ? 1 : 0.18;
      const rawSyllable =
        0.5 +
        0.34 * Math.sin(t * 19.5) +
        0.24 * Math.cos(t * 12.2) +
        0.16 * Math.sin(t * 27.0);
      mouthOpenAmount = clamp(rawSyllable * phraseGate, 0, 1);

      mouthScaleX = 0.94 + mouthOpenAmount * 0.14;
      mouthScaleY = 0.48 + mouthOpenAmount * 0.64;
      mouthY = -mouthOpenAmount * 1.15 * pxToWorld;
      mouthRotZ = Math.sin(t * 6.4) * 0.026 * phraseGate;

      // Subtle conversational nod while bubble remains open
      const nodWave = Math.abs(Math.sin(t * 4.8)) * phraseGate;
      headRotZ += Math.sin(t * 2.8) * 0.025;
      headY += nodWave * 1.6 * pxToWorld;
    }

    // 3c. Gentle Cozy Backsound Head/Body Groove (Mouth stays calm unless bubble text is open)
    if (isCozyMode) {
      const t = this.elapsedTime;
      const grooveBeat = Math.sin(t * 3.2);
      headRotZ += grooveBeat * 0.018;
      headY += Math.abs(grooveBeat) * 1.2 * pxToWorld;
      bodyY += Math.abs(grooveBeat) * 0.8 * pxToWorld;
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
