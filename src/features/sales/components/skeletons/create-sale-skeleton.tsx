import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CreateSaleSkeleton() {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="mt-1 h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stepper skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    {i !== 5 && <Skeleton className="h-0.5 flex-1" />}
                  </div>
                  <Skeleton className="mt-2 h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
