import { cn } from '@/shared/lib/cn';

type BadgeVariant = 'mint' | 'amber' | 'rose' | 'neutral' | 'sky';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  mint:    'border-mint/45 bg-mint/10 text-mint',
  amber:   'border-amber/45 bg-amber/10 text-amber',
  rose:    'border-rose/45 bg-rose/10 text-rose',
  sky:     'border-sky/45 bg-sky/10 text-sky',
  neutral: 'border-ln2 bg-s2 text-f2',
};

export function StatusBadge({ label, variant = 'neutral', dot = false, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5',
        'font-mono text-[11px] tracking-widest uppercase',
        'border rounded-sm',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'mint'    && 'bg-mint',
            variant === 'amber'   && 'bg-amber',
            variant === 'rose'    && 'bg-rose',
            variant === 'sky'     && 'bg-sky',
            variant === 'neutral' && 'bg-f3',
          )}
        />
      )}
      {label}
    </span>
  );
}
