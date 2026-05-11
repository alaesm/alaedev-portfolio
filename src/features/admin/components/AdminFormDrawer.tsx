'use client';

import { cn } from '@/shared/lib/cn';

interface AdminFormDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function AdminFormDrawer({ open, title, onClose, children }: AdminFormDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-s0/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={cn(
          'w-full sm:w-[480px] h-full flex flex-col bg-s1 border-l border-ln shadow-2xl',
          'animate-fadeIn',
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-ln bg-s2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-mint/50" />
          <span className="font-mono text-xs text-f3 flex-1">{title}</span>
          <button
            onClick={onClose}
            className="font-mono text-xs text-f3 hover:text-f1 w-6 h-6 flex items-center justify-center rounded-sm hover:bg-s3 transition-all"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </aside>
    </div>
  );
}
