export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-ln rounded-sm overflow-hidden">
      <div className="bg-s2 px-4 py-3 border-b border-ln">
        <div className="h-3 w-48 bg-s3 rounded-sm animate-pulse" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-ln last:border-0 flex gap-4">
          <div className="h-3 w-32 bg-s2 rounded-sm animate-pulse" />
          <div className="h-3 w-48 bg-s2 rounded-sm animate-pulse" />
          <div className="h-3 w-24 bg-s2 rounded-sm animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-ln bg-s1 rounded-sm p-4 space-y-2">
          <div className="h-2 w-20 bg-s2 rounded-sm animate-pulse" />
          <div className="h-6 w-12 bg-s2 rounded-sm animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-2 w-24 bg-s2 rounded-sm animate-pulse" />
          <div className="h-10 bg-s2 rounded-sm animate-pulse" />
        </div>
      ))}
    </div>
  );
}
