import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'Failed to load data.' }: ErrorStateProps) {
  return (
    <div className="flex items-center gap-3 py-8 text-f2 font-mono text-sm">
      <AlertTriangle size={14} className="text-rose shrink-0" />
      <span>error: {message}</span>
    </div>
  );
}
