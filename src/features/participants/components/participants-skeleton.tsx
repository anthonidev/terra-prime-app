import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function ParticipantsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      {/* Actions Row Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full md:w-[180px]" />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10 ml-auto" />
            </div>

            {/* Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b py-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 ml-auto" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between border-t px-4 py-4">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton (Mobile) */}
      <div className="flex flex-col gap-4 border-t bg-card px-4 py-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
