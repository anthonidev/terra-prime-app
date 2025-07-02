'use client';

import { StatusBadge } from '@/components/common/table/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CurrencyType, PaymentListItem } from '@domain/entities/sales/payment.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Code, CreditCard, DollarSign, Eye, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PagosCards = ({ data }: { data: PaymentListItem[] }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron ventas
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
      {data.map((item) => {
        return (
          <Card key={item.id} className="py-2 transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.banckName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pago #{item.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status}></StatusBadge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/ventas/pagos/detalle/${item.id}`)}
                    className="hover:bg-primary/10 hover:text-primary"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver detalles</span>
                  </Button>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Monto:</span>
                  <span className="ml-auto font-bold text-green-600">
                    {formatCurrency(item.amount, item.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha de venta: </span>
                  <span className="ml-auto font-bold">{formatDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Code className="h-4 w-4" />
                  <span>Cod. Operación:</span>
                  <span className="ml-auto font-bold">{item.codeOperation ?? '--'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Ticket className="h-4 w-4" />
                  <span>N. Ticket:</span>
                  <span className="ml-auto font-bold">{item.numberTicket ?? '--'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PagosCards;
