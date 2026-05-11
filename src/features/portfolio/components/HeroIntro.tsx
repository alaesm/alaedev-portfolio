'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GithubIcon, LinkedinIcon } from '@/shared/components/ui/SocialIcons';
import { SITE } from '@/shared/constants/site';
import { cn } from '@/shared/lib/cn';
import { ANIM_MS } from '@/shared/animations/animation-tokens';
import { TypewriterText } from '@/shared/animations/TypewriterText';
import { useReducedMotionSafe } from '@/shared/animations/useReducedMotion';

const HERO_DISPLAY_NAME = 'Said Medjahed\nAlaeddine';
const HERO_BRAND_LINE = '> AlaeDev';
const HERO_TAGLINE = 'Building intelligent digital systems.';

const ROLE_BADGES = [
  'Software Developer',
  'AI Enthusiast',
  'Information Systems Graduate',
] as const;

const titleClamp = 'clamp(42px, 7vw, 96px)';

const nameHeading = (
  <>
    Said Medjahed
    <br />
    Alaeddine
  </>
);

export function HeroIntro() {
  const reducedMotion = useReducedMotionSafe();

  /** 1=name → 2=brand → 3=tagline → 4=badges */
  const [phase, setPhase] = useState(() => (reducedMotion ? 4 : 1));

  useEffect(() => {
    if (reducedMotion) setPhase(4);
  }, [reducedMotion]);

  const [visibleBadgeCount, setVisibleBadgeCount] = useState(() =>
    reducedMotion ? ROLE_BADGES.length : 0,
  );

  /** `number[]` avoids Node/Web `setTimeout` return-type mismatch under @types/node. */
  const badgeTimersRef = useRef<number[]>([]);
  const phaseDelayRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      badgeTimersRef.current.forEach((id) => window.clearTimeout(id));
      if (phaseDelayRef.current !== null) window.clearTimeout(phaseDelayRef.current);
    },
    [],
  );

  useEffect(() => {
    badgeTimersRef.current.forEach((id) => window.clearTimeout(id));
    badgeTimersRef.current = [];

    if (phase < 4 || reducedMotion) {
      if (reducedMotion) setVisibleBadgeCount(ROLE_BADGES.length);
      return;
    }

    setVisibleBadgeCount(0);

    ROLE_BADGES.forEach((_, i) => {
      badgeTimersRef.current.push(
        window.setTimeout(
          () => setVisibleBadgeCount((c) => Math.max(c, i + 1)),
          ANIM_MS.heroStepPause + i * ANIM_MS.stagger,
        ) as unknown as number,
      );
    });

    return () => {
      badgeTimersRef.current.forEach((id) => window.clearTimeout(id));
      badgeTimersRef.current = [];
    };
  }, [phase, reducedMotion]);

  const schedulePhase = (next: number) => {
    if (phaseDelayRef.current !== null) window.clearTimeout(phaseDelayRef.current);
    phaseDelayRef.current = window.setTimeout(() => {
      phaseDelayRef.current = null;
      setPhase(next);
    }, ANIM_MS.heroStepPause) as unknown as number;
  };

  return (
    <div className="relative w-full px-6 py-20 md:py-32">
      <span className="sr-only">{SITE.owner}</span>

      <div
        className={cn(
          'font-mono text-xs text-mint tracking-widest uppercase mb-8 opacity-100',
          'motion-safe:animate-fadeIn motion-reduce:opacity-100 motion-reduce:animate-none',
        )}
        aria-hidden
      >
        // system.identity · boot sequence
      </div>

      <div className="min-h-[clamp(5.75rem,12vw,8.75rem)] mb-6">
        {reducedMotion ? (
          <h1
            className="font-sans font-semibold text-f0 leading-[1.02] tracking-tight"
            style={{ fontSize: titleClamp }}
            suppressHydrationWarning
          >
            {nameHeading}
          </h1>
        ) : phase === 1 ? (
          <TypewriterText
            as="h1"
            text={HERO_DISPLAY_NAME}
            speed={28}
            className="font-sans font-semibold text-f0 leading-[1.02] tracking-tight"
            style={{ fontSize: titleClamp }}
            cursor
            hideCursorOnComplete
            suppressHydrationWarning
            ariaLive="polite"
            onComplete={() => setPhase(2)}
          />
        ) : (
          <h1
            className="font-sans font-semibold text-f0 leading-[1.02] tracking-tight"
            style={{ fontSize: titleClamp }}
            suppressHydrationWarning
          >
            {nameHeading}
          </h1>
        )}
      </div>

      {phase >= 2 && (
        <div className="mb-4 min-h-[1.75rem]">
          {reducedMotion ? (
            <p className="font-mono text-sm text-mint tracking-wide" aria-hidden>
              {HERO_BRAND_LINE}
            </p>
          ) : phase === 2 ? (
            <TypewriterText
              as="p"
              text={HERO_BRAND_LINE}
              speed={36}
              className="font-mono text-sm text-mint tracking-wide"
              hideCursorOnComplete
              ariaLive="off"
              ariaHidden
              onComplete={() => schedulePhase(3)}
            />
          ) : (
            <p className="font-mono text-sm text-mint tracking-wide" aria-hidden>
              {HERO_BRAND_LINE}
            </p>
          )}
        </div>
      )}

      {phase >= 3 && (
        <div className="min-h-[3.75rem] mb-8">
          {reducedMotion ? (
            <p className="font-sans text-f1 text-lg leading-relaxed" style={{ lineHeight: 1.6 }}>
              {HERO_TAGLINE}
            </p>
          ) : phase === 3 ? (
            <TypewriterText
              as="p"
              text={HERO_TAGLINE}
              speed={22}
              className="font-sans text-f1 text-lg leading-relaxed"
              style={{ lineHeight: 1.6 }}
              hideCursorOnComplete
              ariaLive="polite"
              onComplete={() => schedulePhase(4)}
            />
          ) : (
            <p className="font-sans text-f1 text-lg leading-relaxed" style={{ lineHeight: 1.6 }}>
              {HERO_TAGLINE}
            </p>
          )}
        </div>
      )}

      {phase >= 4 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {ROLE_BADGES.map((label, i) => (
            <span
              key={label}
              className={cn(
                'hero-badge-slot font-mono text-xs text-f2 border border-ln2 px-3 py-1.5 rounded-sm',
                'bg-s2',
                visibleBadgeCount > i && 'hero-badge-slot--visible',
              )}
              style={{ transitionDelay: reducedMotion ? '0ms' : `${i * ANIM_MS.stagger}ms` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="font-mono text-xs text-mint tracking-wide mb-6">{SITE.role}</p>

      <p className="font-sans text-f1 text-lg leading-relaxed mb-10" style={{ lineHeight: 1.6 }}>
        Freelance software developer. Building production web &amp; mobile systems since 2024.
        Based in Tlemcen — collaborating with teams across MENA &amp; the Gulf.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-mint border border-mint/45 bg-mint/10 px-3 py-1.5 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-mint motion-safe:animate-pulse motion-reduce:animate-none" />
          AVAILABLE FOR FREELANCE
        </div>
        <div className="inline-flex items-center gap-2 font-mono text-xs text-amber border border-amber/45 bg-amber/10 px-3 py-1.5 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          OPEN TO ACADEMIC OPPORTUNITIES
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-12">
        <a
          href="#works"
          className={cn(
            'font-mono text-sm px-5 py-2.5 border border-mint bg-mint text-s0 font-medium rounded-sm',
            'hover:brightness-110 active:translate-y-px motion-safe:transition-all motion-safe:duration-fast',
          )}
        >
          View Projects
        </a>
        <a
          href="#contact"
          className={cn(
            'font-mono text-sm px-5 py-2.5 border border-ln text-f0 rounded-sm',
            'hover:border-ln2 hover:bg-s2 active:bg-s3 active:translate-y-px motion-safe:transition-all motion-safe:duration-fast',
          )}
        >
          Contact Me
        </a>
        <a
          href="/cv-placeholder.pdf"
          className={cn(
            'font-mono text-sm px-5 py-2.5 border border-ln text-f2 rounded-sm',
            'hover:border-ln2 hover:bg-s2 active:translate-y-px motion-safe:transition-all motion-safe:duration-fast flex items-center gap-2',
          )}
          aria-label="Download CV (coming soon)"
        >
          Download CV
          <ArrowUpRight size={13} strokeWidth={1.5} />
        </a>
      </div>

      <div className="flex items-center gap-6 pb-4">
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 font-mono text-xs text-f2 hover:text-f0 motion-safe:transition-colors motion-safe:duration-base group',
          )}
        >
          <GithubIcon size={13} />
          <span>github</span>
          <ArrowUpRight
            size={10}
            strokeWidth={1.5}
            className="opacity-0 group-hover:opacity-100 motion-safe:transition-opacity"
          />
        </a>
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 font-mono text-xs text-f2 hover:text-f0 motion-safe:transition-colors motion-safe:duration-base group',
          )}
        >
          <LinkedinIcon size={13} />
          <span>linkedin</span>
          <ArrowUpRight
            size={10}
            strokeWidth={1.5}
            className="opacity-0 group-hover:opacity-100 motion-safe:transition-opacity"
          />
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className={cn(
            'font-mono text-xs text-f2 hover:text-f0 motion-safe:transition-colors motion-safe:duration-base',
          )}
        >
          {SITE.email}
        </a>
      </div>
    </div>
  );
}
