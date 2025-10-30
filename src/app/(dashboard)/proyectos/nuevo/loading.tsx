import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />

      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
