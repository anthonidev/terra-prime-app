'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building2, CreditCard, DollarSign, Eye, User } from 'lucide-react';
import { ListByClient } from '@domain/entities/cobranza';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyType } from '@/lib/domain/entities/sales/payment.entity';

export default function DetalleCard({ id, data }: { id: number; data: ListByClient[] }) {
  const router = useRouter();

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
      {data.map((info) => {
        return (
          <Card key={info.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {info.client.firstName} {info.client.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cliente #{info.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={info.type === 'FINANCED' ? 'default' : 'secondary'}>
                    {info.type === 'FINANCED' ? 'Financiado' : 'Directo'}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/cobranza/clientes-asignados/detalle/${info.id}`)}
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
                  <Building2 className="h-4 w-4" />
                  <span>Lote: {info.lot.name}</span>
                  <span className="ml-auto font-medium">
                    {formatCurrency(Number(info.lot.lotPrice))}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Total:</span>
                  <span className="ml-auto font-bold text-green-600">
                    {formatCurrency(Number(info.totalAmount))}
                  </span>
                </div>

                {info.vendor && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span>
                      Vendedor: {info.vendor.firstName} {info.vendor.lastName}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado:
                  </span>
                  <Badge
                    variant={
                      info.status === 'COMPLETED'
                        ? 'default'
                        : info.status === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {info.status === 'COMPLETED'
                      ? 'Completada'
                      : info.status === 'PENDING'
                        ? 'Pendiente'
                        : info.status}
                  </Badge>
                </div>

                {info.financing && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <div>Inicial: {formatCurrency(Number(info.financing.initialAmount))}</div>
                      <div>Tasa: {info.financing.interestRate}%</div>
                      <div>Cuotas: {info.financing.quantityCoutes}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    router.push(`/cobranza/clientes-asignados/detalle/${id}/${info.id}`)
                  }
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
