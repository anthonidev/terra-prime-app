import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function PinSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-80" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      {/* Card Skeleton */}
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
