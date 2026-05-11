interface SectionHeaderProps {
  index: string;
  label: string;
  command?: string;
  accent?: 'mint' | 'amber';
}

export function SectionHeader({ index, label, command, accent = 'mint' }: SectionHeaderProps) {
  const accentClass = accent === 'amber' ? 'text-amber' : 'text-mint';

  return (
    <div className="mb-10 space-y-3">
      <div className={`font-mono text-xs tracking-widest uppercase ${accentClass}`}>
        // [{index}] {label}
      </div>
      {command && (
        <div className="font-mono text-sm text-f2">
          <span className={accentClass}>~/{label.toLowerCase()}</span>
          <span className="text-f3"> $ </span>
          <span className="text-f1">{command}</span>
        </div>
      )}
      <div className="section-divider" />
    </div>
  );
}
