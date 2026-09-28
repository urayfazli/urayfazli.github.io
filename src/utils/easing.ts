/**
 * Smooth easing functions for idle breathing, blinking, and playful interactions.
 */

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t: number, overshoot = 1.70158): number {
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
}

export function easeOutElasticSoft(t: number): number {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -9 * t) * Math.sin((t * 8 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}
