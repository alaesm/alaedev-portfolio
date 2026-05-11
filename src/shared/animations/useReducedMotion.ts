'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(cb: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getSnapshot(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * System preference for reduced motion (WCAG friendly).
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getSnapshot, getServerSnapshot);
}
