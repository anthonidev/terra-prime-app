'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { FinancingInstallmentCollector } from '@domain/entities/cobranza';
import { CurrencyType } from '@/lib/domain/entities/sales/payment.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';

interface Props {
  currency: CurrencyType;
  data: FinancingInstallmentCollector[];
}

export default function HuCard({ currency, data }: Props) {
  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((info) => {
        return (
          <Card key={info.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-3">
                  <StatusBadge status={info.status} />
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Cuota a pagar : {formatCurrency(Number(info.couteAmount), currency)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>Cuota pagada : {formatCurrency(Number(info.coutePaid), currency)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    Cuota Pendiente : {formatCurrency(Number(info.coutePending), currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
