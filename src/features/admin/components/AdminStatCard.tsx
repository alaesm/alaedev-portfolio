interface AdminStatCardProps {
  label: string;
  value: number | string;
  accent?: 'mint' | 'amber' | 'rose' | 'sky';
  sub?: string;
}

const accentMap: Record<string, string> = {
  mint: 'text-mint',
  amber: 'text-amber',
  rose: 'text-rose',
  sky: 'text-sky',
};

export function AdminStatCard({ label, value, accent = 'mint', sub }: AdminStatCardProps) {
  return (
    <div className="border border-ln bg-s1 rounded-sm p-4 space-y-1 hover:border-ln2 transition-colors">
      <div className="font-mono text-xs text-f3 uppercase tracking-wider">{label}</div>
      <div className={`font-mono text-2xl font-semibold ${accentMap[accent]}`}>{value}</div>
      {sub && <div className="font-mono text-xs text-f3">{sub}</div>}
    </div>
  );
}
