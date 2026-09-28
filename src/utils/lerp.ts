/**
 * Linear interpolation and frame-rate independent damping utilities
 * for the 2D Chibi Three.js Rig System.
 */

export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/**
 * Frame-rate independent exponential smoothing (damp)
 * Ensures identical 60 FPS feel across 30Hz, 60Hz, and 120Hz displays.
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  delta: number
): number {
  return lerp(current, target, 1 - Math.exp(-lambda * delta));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface SpringState {
  value: number;
  velocity: number;
}

/**
 * Lightweight 1D spring-damper solver for hair & cable secondary motion
 * Avoids heavy physics engines while delivering natural elastic follow-through.
 */
export function stepSpring(
  state: SpringState,
  target: number,
  stiffness: number,
  damping: number,
  delta: number
): number {
  const dt = Math.min(delta, 0.05);
  const force = (target - state.value) * stiffness;
  state.velocity = (state.velocity + force * dt) * Math.exp(-damping * dt);
  state.value += state.velocity * dt;
  return state.value;
}
