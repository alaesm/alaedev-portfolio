/** Durations (ms) shared by JS-controlled animations (typing, phased delays). */
export const ANIM_MS = {
  /** Single opacity/transform reveal */
  reveal: 480,
  /** Between hero sequence steps */
  heroStepPause: 160,
  /** Micro-stagger offset per sibling */
  stagger: 55,
  /** Cap total stagger latency */
  staggerMaxDelay: 400,
  /** Idle before cursor hides after typing */
  cursorGrace: 560,
  /** Terminal label fades in setup */
  labelFade: 220,
} as const;

/** Easing replicated in Tailwind-compatible strings where useful */
export const EASE_OUT = 'cubic-bezier(0.2, 0, 0, 1)' as const;

export function cappedStaggerMs(index: number): number {
  return Math.min(index * ANIM_MS.stagger, ANIM_MS.staggerMaxDelay);
}
