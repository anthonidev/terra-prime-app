import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SkeletonData() {
  return (
    <div className="space-y-8">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <Skeleton className="h-5 w-5" />

            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center">
        <div className="flex space-x-1 rounded-lg border bg-gray-100 p-1 dark:bg-gray-800">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-11 w-32" />
            </div>
          </div>

          <Separator />

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full" />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </CardContent>

        <div className="flex-shrink-0 gap-4 border-t border-gray-200 bg-white px-8 pt-6 pb-8 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex gap-4">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 flex-1" />
          </div>
        </div>
      </Card>
    </div>
  );
}
