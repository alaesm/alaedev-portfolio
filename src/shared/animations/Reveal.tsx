'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import { cn } from '@/shared/lib/cn';
import { motionPresets } from './motion-presets';
import { useReducedMotionSafe } from './useReducedMotion';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
};

export function Reveal({
  children,
  className,
  rootMargin = '0px 0px -6% 0px',
  threshold = 0.08,
}: RevealProps): JSX.Element {
  const reducedMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const [ioVisible, setIoVisible] = useState(false);

  const visible = reducedMotion || ioVisible;

  useEffect(() => {
    if (reducedMotion) return undefined;
    const el = ref.current;
    if (!el || ioVisible) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIoVisible(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ioVisible, reducedMotion, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        motionPresets.revealBlock,
        visible && motionPresets.revealVisible,
        className,
      )}
    >
      {children}
    </div>
  );
}
