import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 md:grid-cols-12">
        {/* Photo Section Skeleton */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="bg-card h-full border shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-5">
              <div className="relative">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
              <div className="w-full space-y-1 text-center">
                <Skeleton className="mx-auto h-7 w-40" />
                <Skeleton className="mx-auto h-5 w-24" />
              </div>
              <Skeleton className="ml-auto h-8 w-8 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Profile Form Skeleton */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="bg-card h-full border shadow-sm">
            <CardHeader className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-5">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Skeleton className="h-11 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Form Skeleton */}
      <div className="pt-4">
        <Card className="bg-card/50 border shadow-sm backdrop-blur-sm">
          <CardHeader className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-5">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="flex justify-end pt-4">
              <Skeleton className="h-11 w-48" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
