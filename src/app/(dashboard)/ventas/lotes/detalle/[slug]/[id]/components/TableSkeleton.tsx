import { Skeleton } from '@components/ui/skeleton';
import { Card, CardContent } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filtros skeleton */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla skeleton - Vista desktop */}
      <div className="hidden md:block">
        <Card className="border-gray-200 shadow-sm dark:border-gray-800">
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Skeleton className="h-5 w-8" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-20" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-20" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-32" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-20" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards skeleton - Vista móvil */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="ml-auto h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="ml-auto h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-8 w-60" />
      </div>
    </div>
  );
}
