'use client';

import { useEffect } from 'react';
import { useToastStore } from '../stores/toast.store';
import { cn } from '@/shared/lib/cn';

const typeStyles: Record<string, string> = {
  success: 'border-mint/40 bg-s2',
  error: 'border-rose/40 bg-s2',
  info: 'border-sky/40 bg-s2',
  warning: 'border-amber/40 bg-s2',
};

const dotStyles: Record<string, string> = {
  success: 'bg-mint',
  error: 'bg-rose',
  info: 'bg-sky',
  warning: 'bg-amber',
};

function ToastItem({ id, type, message }: { id: string; type: string; message: string }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 border px-4 py-3 rounded-sm shadow-lg animate-fadeIn',
        typeStyles[type] ?? typeStyles.info,
      )}
    >
      <span className={cn('mt-1 w-2 h-2 rounded-full shrink-0', dotStyles[type] ?? 'bg-f3')} />
      <p className="font-mono text-xs text-f1 leading-relaxed">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="ml-auto text-f3 hover:text-f1 transition-colors shrink-0 text-xs"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function AdminToast() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
