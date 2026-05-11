'use client';

import { cn } from '@/shared/lib/cn';

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  danger?: boolean;
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isLoading,
  danger = true,
}: AdminConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-s0/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-sm border border-ln bg-s1 rounded-sm shadow-2xl animate-fadeIn">
        <div className="px-4 py-2.5 border-b border-ln bg-s2 flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', danger ? 'bg-rose/60' : 'bg-amber/60')} />
          <span className="font-mono text-xs text-f3">confirm.sh</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <p className="font-mono text-sm text-f0">{title}</p>
            <p className="font-mono text-xs text-f3">{description}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="font-mono text-xs text-f2 border border-ln px-4 py-2 rounded-sm hover:text-f1 hover:border-ln2 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'font-mono text-xs px-4 py-2 rounded-sm transition-all',
                danger
                  ? 'bg-rose/10 text-rose border border-rose/30 hover:bg-rose/20'
                  : 'bg-mint text-fi border border-mint/30 hover:bg-mint/90',
                isLoading && 'opacity-50 cursor-not-allowed',
              )}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
