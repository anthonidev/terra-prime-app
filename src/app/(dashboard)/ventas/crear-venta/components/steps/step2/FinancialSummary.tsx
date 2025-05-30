'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface FinancialSummaryProps {
  totalAmount: number | string;
  totalAmountUrbanDevelopment: number | string;
  isFinanced: boolean;
  hasUrbanization: boolean;
  initialAmount?: number | string;
  interestRate?: number | string;
  quantitySaleCoutes?: number | string;
}

export default function FinancialSummary({
  totalAmount,
  totalAmountUrbanDevelopment,
  isFinanced,
  hasUrbanization,
  initialAmount = 0,
  interestRate = 0,
  quantitySaleCoutes = 0
}: FinancialSummaryProps) {
  const totalAmountNum = Number(totalAmount) || 0;
  const totalAmountUrbanDevelopmentNum = Number(totalAmountUrbanDevelopment) || 0;
  const initialAmountNum = Number(initialAmount) || 0;
  const interestRateNum = Number(interestRate) || 0;
  const quantitySaleCoutesNum = Number(quantitySaleCoutes) || 0;

  const totalSum = totalAmountNum + totalAmountUrbanDevelopmentNum;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Resumen Financiero
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monto del Lote:</span>
              <span className="font-semibold">S/ {totalAmountNum.toFixed(2)}</span>
            </div>
            {hasUrbanization && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Habilitación Urbana:
                </span>
                <span className="font-semibold">
                  S/ {totalAmountUrbanDevelopmentNum.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Total:</span>
              <span className="text-lg font-bold">S/ {totalSum.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant={isFinanced ? 'default' : 'secondary'} className="w-fit">
              {isFinanced ? 'Venta Financiada' : 'Pago Directo'}
            </Badge>

            {isFinanced && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Monto Inicial:</span>
                  <span>S/ {initialAmountNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tasa de Interés:</span>
                  <span>{interestRateNum}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cuotas:</span>
                  <span>{quantitySaleCoutesNum} pagos</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
