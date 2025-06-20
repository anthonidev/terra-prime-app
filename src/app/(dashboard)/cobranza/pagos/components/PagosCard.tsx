'use client';

import { Card, CardContent } from '@components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, Eye, User } from 'lucide-react';
import { PaymentListItem } from '@domain/entities/sales/payment.entity';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';

export default function PagosCard({ data }: { data: PaymentListItem[] }) {
  const router = useRouter();

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron clientes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((data) => {
        return (
          <Card key={data.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>{data.banckName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Registrado:&nbsp;
                    {format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
              </div>
              <div className="flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/cobranza/pagos/detalle/${data.id}`)}
                  className="hover:bg-primary/10 hover:text-primary"
                  title="Ver detalles"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Ver detalles</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
