import { HeroIntro } from './HeroIntro';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

      <HeroIntro />

      {/* Bottom hairline */}
      <div className="section-divider" />
    </section>
  );
}
