import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PaymentDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center">
            <Link href="/mis-pagos" passHref>
              <Button variant="ghost" size="sm" className="mr-2 -ml-3">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-5 w-64" />
        </div>

        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Información general */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Detalles de pago */}
              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-2 h-5 w-32" />
                  <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="mb-2 h-5 w-24" />
                  <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-2 h-5 w-40" />
                  <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="mb-2 h-5 w-32" />
                  <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes de comprobantes */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
