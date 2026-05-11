import { ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/shared/components/ui/SocialIcons';
import { SITE } from '@/shared/constants/site';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

      <div className="relative w-full px-6 py-20 md:py-32">
        {/* System marker */}
        <div className="font-mono text-xs text-mint tracking-widest uppercase mb-8">
          [00] system status · online
        </div>

        {/* Name — display size */}
        <h1 className="font-sans font-semibold text-f0 leading-[1.02] tracking-tight mb-6"
          style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}>
          Said Medjahed
          <br />
          Alaeddine
          <span className="caret" />
        </h1>

        {/* Role sub-line */}
        <p className="font-mono text-sm text-mint tracking-wide mb-6">
          {SITE.role}
        </p>

        {/* Description */}
        <p className="font-sans text-f1 text-lg leading-relaxed mb-10"
          style={{ lineHeight: '1.6' }}>
          Freelance software developer. Building production web &amp; mobile systems since 2024.
          Based in Tlemcen — collaborating with teams across MENA &amp; the Gulf.
        </p>

        {/* Status chips */}
        <div className="flex flex-wrap gap-3 mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-mint border border-mint/45 bg-mint/10 px-3 py-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            AVAILABLE FOR FREELANCE
          </div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-amber border border-amber/45 bg-amber/10 px-3 py-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            OPEN TO ACADEMIC OPPORTUNITIES
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <a
            href="#works"
            className="font-mono text-sm px-5 py-2.5 border border-mint bg-mint text-s0 font-medium
              rounded-sm hover:brightness-110 active:translate-y-px transition-all duration-fast"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="font-mono text-sm px-5 py-2.5 border border-ln text-f0
              rounded-sm hover:border-ln2 hover:bg-s2 active:bg-s3 active:translate-y-px transition-all duration-fast"
          >
            Contact Me
          </a>
          <a
            href="/cv-placeholder.pdf"
            className="font-mono text-sm px-5 py-2.5 border border-ln text-f2
              rounded-sm hover:border-ln2 hover:bg-s2 active:translate-y-px transition-all duration-fast flex items-center gap-2"
            aria-label="Download CV (coming soon)"
          >
            Download CV
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-f2
              hover:text-f0 transition-colors duration-base group"
          >
            <GithubIcon size={13} />
            <span>github</span>
            <ArrowUpRight size={10} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-f2
              hover:text-f0 transition-colors duration-base group"
          >
            <LinkedinIcon size={13} />
            <span>linkedin</span>
            <ArrowUpRight size={10} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="font-mono text-xs text-f2 hover:text-f0 transition-colors duration-base"
          >
            {SITE.email}
          </a>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="section-divider" />
    </section>
  );
}
