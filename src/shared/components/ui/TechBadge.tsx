import { cn } from '@/shared/lib/cn';

interface TechBadgeProps {
  label: string;
  className?: string;
}

export function TechBadge({ label, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 font-mono text-xs',
        'border border-ln text-f2 rounded-sm',
        'hover:border-ln2 hover:text-f1 transition-colors duration-base',
        className,
      )}
    >
      {label}
    </span>
  );
}
