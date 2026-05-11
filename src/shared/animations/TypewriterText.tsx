'use client';

import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from 'react';
import { cn } from '@/shared/lib/cn';
import { useReducedMotionSafe } from './useReducedMotion';
import { ANIM_MS } from './animation-tokens';

export type TypewriterElement = 'h1' | 'h2' | 'p' | 'span';

export type TypewriterTextProps = {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  style?: CSSProperties;
  cursor?: boolean;
  as?: TypewriterElement;
  reducedMotionFallback?: boolean;
  instant?: boolean;
  onComplete?: () => void;
  ariaLive?: 'off' | 'polite';
  hideCursorOnComplete?: boolean;
  suppressHydrationWarning?: boolean;
  /** Decorative type lines (e.g. prompt) — keep polite live region on primary copy only. */
  ariaHidden?: boolean;
};

const DEFAULT_SPEED_MS = 32;

function renderSlice(slice: string) {
  const lines = slice.split('\n');
  if (lines.length === 1) return slice;
  return lines.map((line, i, arr) => (
    <span key={`tw-${slice.length}-${i}`}>
      {line}
      {i < arr.length - 1 ? <br /> : null}
    </span>
  ));
}

export function TypewriterText({
  text,
  speed = DEFAULT_SPEED_MS,
  startDelay = 0,
  className,
  style,
  cursor = true,
  as = 'span',
  reducedMotionFallback = true,
  instant = false,
  onComplete,
  ariaLive = 'polite',
  hideCursorOnComplete = true,
  suppressHydrationWarning,
  ariaHidden,
}: TypewriterTextProps): JSX.Element {
  const prefersReduced = useReducedMotionSafe();
  const skipAnimation =
    instant || (reducedMotionFallback && prefersReduced) || speed <= 0;

  const [displayedChars, setDisplayedChars] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedChars(text.length);
      setShowCaret(!hideCursorOnComplete && Boolean(cursor));
      queueMicrotask(() => onCompleteRef.current?.());
      return undefined;
    }

    setDisplayedChars(0);
    setShowCaret(Boolean(cursor));

    let disposed = false;
    let pos = 0;
    /** Web `setInterval` ids; `number` avoids `@types/node` Timeout mismatch. */
    let intervalId: number | undefined;

    const tickMs = Math.max(12, Math.min(96, speed));

    const startTimer = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (disposed) return;

        pos = Math.min(pos + 1, text.length);
        setDisplayedChars(pos);

        if (pos >= text.length) {
          if (intervalId !== undefined) window.clearInterval(intervalId);
          intervalId = undefined;
          queueMicrotask(() => onCompleteRef.current?.());
          if (hideCursorOnComplete && cursor) {
            window.setTimeout(() => {
              if (!disposed) setShowCaret(false);
            }, ANIM_MS.cursorGrace);
          }
        }
      }, tickMs) as unknown as number;
    }, Math.max(0, startDelay)) as unknown as number;

    return () => {
      disposed = true;
      window.clearTimeout(startTimer);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [cursor, hideCursorOnComplete, skipAnimation, speed, startDelay, text]);

  const slice = text.slice(0, displayedChars);
  const body = useMemo(() => renderSlice(slice), [slice]);

  const content = (
    <>
      {body}
      {cursor && showCaret ? <span className="caret" aria-hidden /> : null}
    </>
  );

  return createElement(as, {
    className: cn(className),
    style,
    'aria-live': skipAnimation ? 'off' : ariaLive,
    ...(ariaHidden !== undefined ? { 'aria-hidden': ariaHidden } : {}),
    suppressHydrationWarning,
  }, content);
}
