'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface PaymentScheduleSummaryProps {
  isFinanced: boolean;
  financingInstallments?: Array<{
    couteAmount: number;
    expectedPaymentDate: string;
  }>;
}

export default function PaymentScheduleSummary({
  isFinanced,
  financingInstallments
}: PaymentScheduleSummaryProps) {
  if (!isFinanced || !financingInstallments || financingInstallments.length === 0) {
    return null;
  }

  const totalToPay = financingInstallments.reduce((sum, item) => sum + item.couteAmount, 0);
  const firstInstallment = financingInstallments[0];
  const lastInstallment = financingInstallments[financingInstallments.length - 1];

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <UserCheck className="h-4 w-4" />
          Cronograma de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total de cuotas:</span>
            <span className="font-medium">{financingInstallments.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Monto por cuota:</span>
            <span className="font-medium">S/ {firstInstallment.couteAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Primera cuota:</span>
            <span className="font-medium">
              {format(new Date(firstInstallment.expectedPaymentDate), 'dd/MM/yyyy', {
                locale: es
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Última cuota:</span>
            <span className="font-medium">
              {format(new Date(lastInstallment.expectedPaymentDate), 'dd/MM/yyyy', {
                locale: es
              })}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Total a pagar:</span>
            <span className="font-bold">S/ {totalToPay.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
