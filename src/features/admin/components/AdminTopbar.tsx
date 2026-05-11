'use client';

import Link from 'next/link';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

export function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-14 border-b border-ln bg-s0/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-f3">~/admin</span>
        <span className="text-ln">›</span>
        <span className="font-mono text-sm text-f1">{title}</span>
        {subtitle && (
          <>
            <span className="text-ln">›</span>
            <span className="font-mono text-xs text-f3">{subtitle}</span>
          </>
        )}
      </div>
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs text-f3 hover:text-mint border border-ln px-3 py-1.5 rounded-sm hover:border-mint/40 transition-all duration-base"
      >
        ↗ View Portfolio
      </Link>
    </header>
  );
}
