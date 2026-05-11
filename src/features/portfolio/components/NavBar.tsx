'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/shared/components/ui/SocialIcons';
import { cn } from '@/shared/lib/cn';
import { SITE, NAV_LINKS } from '@/shared/constants/site';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16',
        'border-b border-ln transition-all duration-base',
        scrolled ? 'bg-s0/95 backdrop-blur-[10px]' : 'bg-transparent',
      )}
    >
      <nav className="h-full px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="font-mono font-bold text-f0 text-sm tracking-tight hover:text-mint transition-colors duration-base">
          alaedev
          <span className="caret" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-f2 tracking-wide hover:text-f0 transition-colors duration-base"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-xs text-mint">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            AVAILABLE
          </div>
          <div className="w-px h-4 bg-ln" />
          <a href={SITE.github} target="_blank" rel="noopener noreferrer"
            className="text-f2 hover:text-f0 transition-colors duration-base">
            <GithubIcon size={15} />
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
            className="text-f2 hover:text-f0 transition-colors duration-base">
            <LinkedinIcon size={15} />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-f2 hover:text-f0 transition-colors p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-s1 border-b border-ln">
          <div className="mx-auto px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-mono text-sm text-f1 hover:text-mint transition-colors duration-base"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-ln flex items-center gap-4">
              <a href={SITE.github} target="_blank" rel="noopener noreferrer"
                className="text-f2 hover:text-f0 transition-colors">
                <GithubIcon size={16} />
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-f2 hover:text-f0 transition-colors">
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
