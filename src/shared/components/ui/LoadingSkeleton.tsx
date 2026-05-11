import { cn } from '@/shared/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-s2',
        className,
      )}
    />
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-ln p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-px w-full" />
      <div className="grid md:grid-cols-2 gap-8 pt-2">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-3 w-20 shrink-0" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
