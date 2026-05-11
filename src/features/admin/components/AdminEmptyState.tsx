interface AdminEmptyStateProps {
  message?: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({
  message = 'No records found.',
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 border border-ln bg-s1 rounded-sm">
      <div className="font-mono text-2xl text-f3">◻</div>
      <p className="font-mono text-sm text-f3">{message}</p>
      {action}
    </div>
  );
}
