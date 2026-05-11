interface AdminErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function AdminErrorState({
  message = 'Failed to load data.',
  onRetry,
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 border border-rose/20 bg-s1 rounded-sm">
      <div className="font-mono text-2xl text-rose">✕</div>
      <p className="font-mono text-sm text-rose">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-mono text-xs text-f2 border border-ln px-3 py-1.5 rounded-sm hover:border-ln2 hover:text-f1 transition-all"
        >
          Retry
        </button>
      )}
    </div>
  );
}
