interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="space-y-0.5">
        <h1 className="font-mono text-base text-f0 tracking-tight">{title}</h1>
        {description && (
          <p className="font-mono text-xs text-f3">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
