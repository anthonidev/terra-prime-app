'use client';

import { Badge } from '@components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LotProject } from '@domain/entities/lotes/lot.entity';
import { Building2, CreditCard, DollarSign } from 'lucide-react';
import { StatusBadge } from '@components/common/table/StatusBadge';

type Props = {
  data: LotProject[];
};

const LotCard = ({ data }: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
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
      {data.map((lot) => {
        return (
          <Card key={lot.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lote #{lot.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="default">{lot.status}</Badge>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="h-4 w-4" />
                  <span>Lote: {lot.name}</span>
                  <span className="ml-auto font-medium">
                    {formatCurrency(Number(lot.lotPrice))}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Total:</span>
                  <span className="ml-auto font-bold text-green-600">
                    {formatCurrency(Number(lot.totalPrice))}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado:
                  </span>
                  <StatusBadge status={lot.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LotCard;
