import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="mt-2 h-4 w-20" />
            </div>
            {i < 3 && <Skeleton className="mx-2 h-0.5 flex-1" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end gap-3 pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
