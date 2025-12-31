import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wallet, Percent, Calculator, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import type { FinancingDetail } from '../../types';

interface FinancingSummaryInfoProps {
  financing: FinancingDetail;
}

export function FinancingSummaryInfo({ financing }: FinancingSummaryInfoProps) {
  const progressPercentage =
    financing.totalCouteAmount > 0
      ? Math.round((financing.totalPaid / financing.totalCouteAmount) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Resumen del Financiamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso de Pago</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Pagado: {formatCurrency(financing.totalPaid)}</span>
            <span>Total: {formatCurrency(financing.totalCouteAmount)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Financing Type */}
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4" />
              Tipo de Financiamiento
            </div>
            <p className="mt-1 text-lg font-semibold">{financing.financingType}</p>
          </div>

          {/* Interest Rate */}
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Percent className="h-4 w-4" />
              Tasa de Interés
            </div>
            <p className="mt-1 text-lg font-semibold">{financing.interestRate}%</p>
          </div>

          {/* Number of Installments */}
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground text-sm">Cantidad de Cuotas</div>
            <p className="mt-1 text-lg font-semibold">{financing.quantityCoutes}</p>
          </div>

          {/* Total Coute Amount */}
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground text-sm">Monto Total de Cuotas</div>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(financing.totalCouteAmount)}
            </p>
          </div>

          {/* Initial Amount */}
          {financing.initialAmount > 0 && (
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-sm">Monto Inicial</div>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(financing.initialAmount)}
              </p>
              <div className="mt-1 flex gap-2 text-xs">
                <span className="text-green-600">
                  Pagado: {formatCurrency(financing.initialAmountPaid)}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-orange-600">
                  Pendiente: {formatCurrency(financing.initialAmountPending)}
                </span>
              </div>
            </div>
          )}

          {/* Total Paid */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <div className="text-sm text-green-700 dark:text-green-300">Total Pagado</div>
            <p className="mt-1 text-lg font-semibold text-green-700 dark:text-green-300">
              {formatCurrency(financing.totalPaid)}
            </p>
          </div>

          {/* Total Pending */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
            <div className="text-sm text-orange-700 dark:text-orange-300">Total Pendiente</div>
            <p className="mt-1 text-lg font-semibold text-orange-700 dark:text-orange-300">
              {formatCurrency(financing.totalPending)}
            </p>
          </div>

          {/* Late Fees */}
          {financing.totalLateFee > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" />
                Moras Totales
              </div>
              <p className="mt-1 text-lg font-semibold text-red-700 dark:text-red-300">
                {formatCurrency(financing.totalLateFee)}
              </p>
              <div className="mt-1 flex gap-2 text-xs">
                <span>Pagado: {formatCurrency(financing.totalLateFeePaid)}</span>
                <span>|</span>
                <span>Pendiente: {formatCurrency(financing.totalLateFeeePending)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
