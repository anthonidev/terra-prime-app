'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, Wallet, Percent, Calculator, AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { RegisterInstallmentPaymentApprovedModal } from '../../dialogs/register-installment-payment-approved-modal';
import type {
  SaleDetailInstallment,
  SaleDetailFinancingItem,
  StatusFinancingInstallments,
  CurrencyType,
} from '../../../types';

// Installment status badge configurations
const installmentStatusConfig: Record<
  StatusFinancingInstallments,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PAID: { label: 'Pagada', variant: 'default' },
  EXPIRED: { label: 'Vencida', variant: 'destructive' },
};

interface SaleInstallmentsTabContentProps {
  installments: SaleDetailInstallment[];
  currency: CurrencyType;
  title: string;
  financingId: string | null;
  saleId: string;
  onPaymentSuccess?: () => void;
  canRegisterPayment?: boolean;
  financingItem?: SaleDetailFinancingItem | null;
}

export function SaleInstallmentsTabContent({
  installments,
  currency,
  title,
  financingId,
  saleId,
  onPaymentSuccess,
  canRegisterPayment = false,
  financingItem,
}: SaleInstallmentsTabContentProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  // Helper to parse numeric values that might be strings
  const parseNumeric = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return isNaN(value) ? 0 : value;
  };

  // Calculate totals from installments
  const calculatedTotals = useMemo(() => {
    let totalAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalLateFee = 0;

    installments.forEach((inst) => {
      totalAmount += parseNumeric(inst.couteAmount);
      totalPaid += parseNumeric(inst.coutePaid);
      totalPending += parseNumeric(inst.coutePending);
      totalLateFee += parseNumeric(inst.lateFeeAmountPending);
    });

    return { totalAmount, totalPaid, totalPending, totalLateFee };
  }, [installments]);

  const formatAmount = (amount: number | string | null | undefined): string => {
    const value = parseNumeric(amount);
    return `${currencySymbol} ${value.toLocaleString('es-PE')}`;
  };

  const columns: ColumnDef<SaleDetailInstallment>[] = [
    {
      accessorKey: 'numberCuote',
      header: 'N° Cuota',
      cell: ({ row }) => {
        const index = row.index + 1;
        const installment = row.original;
        return <span className="font-mono font-medium">#{installment.numberCuote ?? index}</span>;
      },
    },
    {
      accessorKey: 'expectedPaymentDate',
      header: 'Fecha de Vencimiento',
      cell: ({ row }) => {
        const dateValue = row.getValue('expectedPaymentDate') as string | null;
        if (!dateValue) return <span className="text-muted-foreground">-</span>;
        const date = new Date(dateValue);
        return format(date, 'dd MMM yyyy', { locale: es });
      },
    },
    {
      accessorKey: 'couteAmount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = row.getValue('couteAmount') as number | string | null;
        return <span className="font-medium">{formatAmount(amount)}</span>;
      },
    },
    {
      accessorKey: 'coutePaid',
      header: 'Pagado',
      cell: ({ row }) => {
        const amount = row.getValue('coutePaid') as number | string | null;
        return <span className="text-green-600">{formatAmount(amount)}</span>;
      },
    },
    {
      accessorKey: 'coutePending',
      header: 'Pendiente',
      cell: ({ row }) => {
        const amount = row.getValue('coutePending') as number | string | null;
        const value = parseNumeric(amount);
        return <span className={value > 0 ? 'text-amber-600' : ''}>{formatAmount(amount)}</span>;
      },
    },
    {
      accessorKey: 'lateFeeAmountPending',
      header: 'Mora',
      cell: ({ row }) => {
        const amount = row.getValue('lateFeeAmountPending') as number | string | null;
        const value = parseNumeric(amount);
        if (value === 0) return <span className="text-muted-foreground">-</span>;
        return <span className="text-red-600">{formatAmount(amount)}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as StatusFinancingInstallments;
        const config = installmentStatusConfig[status];
        if (!config) return <span className="text-muted-foreground">-</span>;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
  ];

  // Use financing item data if available, otherwise use calculated totals
  const totalCouteAmount = financingItem?.totalCouteAmount ?? calculatedTotals.totalAmount;
  const totalPaid = financingItem?.totalPaid ?? calculatedTotals.totalPaid;
  const totalPending = financingItem?.totalPending ?? calculatedTotals.totalPending;
  const totalLateFee = financingItem?.totalLateFee ?? calculatedTotals.totalLateFee;
  const progressPercentage = totalCouteAmount > 0 ? (totalPaid / totalCouteAmount) * 100 : 0;

  // Get quantity of installments
  const quantityCoutes = financingItem?.quantityCoutes ?? installments.length;

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    onPaymentSuccess?.();
  };

  return (
    <>
      {/* Resumen del Financiamiento */}
      {financingItem && (
        <Card className="mb-4">
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
                <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Pagado: {formatCurrency(totalPaid, currency)}</span>
                <span>Total: {formatCurrency(totalCouteAmount, currency)}</span>
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
                <p className="mt-1 text-lg font-semibold">{financingItem.financingType}</p>
              </div>

              {/* Interest Rate */}
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4" />
                  Tasa de Interés
                </div>
                <p className="mt-1 text-lg font-semibold">{financingItem.interestRate}%</p>
              </div>

              {/* Number of Installments */}
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Cantidad de Cuotas</div>
                <p className="mt-1 text-lg font-semibold">{financingItem.quantityCoutes}</p>
              </div>

              {/* Total Coute Amount */}
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Monto Total de Cuotas</div>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(financingItem.totalCouteAmount, currency)}
                </p>
              </div>

              {/* Initial Amount */}
              {financingItem.initialAmount > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Monto Inicial</div>
                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(financingItem.initialAmount, currency)}
                  </p>
                  <div className="mt-1 flex gap-2 text-xs">
                    <span className="text-green-600">
                      Pagado: {formatCurrency(financingItem.initialAmountPaid, currency)}
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-orange-600">
                      Pendiente: {formatCurrency(financingItem.initialAmountPending, currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Paid */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                <div className="text-sm text-green-700 dark:text-green-300">Total Pagado</div>
                <p className="mt-1 text-lg font-semibold text-green-700 dark:text-green-300">
                  {formatCurrency(financingItem.totalPaid, currency)}
                </p>
              </div>

              {/* Total Pending */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                <div className="text-sm text-orange-700 dark:text-orange-300">Total Pendiente</div>
                <p className="mt-1 text-lg font-semibold text-orange-700 dark:text-orange-300">
                  {formatCurrency(financingItem.totalPending, currency)}
                </p>
              </div>

              {/* Late Fees */}
              {financingItem.totalLateFee > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                  <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    Moras Totales
                  </div>
                  <p className="mt-1 text-lg font-semibold text-red-700 dark:text-red-300">
                    {formatCurrency(financingItem.totalLateFee, currency)}
                  </p>
                  <div className="mt-1 flex gap-2 text-xs">
                    <span>Pagado: {formatCurrency(financingItem.totalLateFeePaid, currency)}</span>
                    <span>|</span>
                    <span>
                      Pendiente: {formatCurrency(financingItem.totalLateFeeePending, currency)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>{title}</CardTitle>
              {canRegisterPayment && financingId && (
                <Button size="sm" onClick={() => setIsPaymentModalOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Button>
              )}
            </div>
            {installments.length > 0 && (
              <div className="text-right">
                <p className="text-muted-foreground text-sm">Progreso de Pago</p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalPaid, currency)} /{' '}
                  {formatCurrency(totalCouteAmount, currency)}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards (only shown if no financingItem) */}
          {!financingItem && installments.length > 0 && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-muted-foreground text-right text-sm">
                  {progressPercentage.toFixed(1)}% completado
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">Cuotas</p>
                  <p className="text-lg font-semibold">{quantityCoutes}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">Total Pagado</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(totalPaid, currency)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">Pendiente</p>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatCurrency(totalPending, currency)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">Mora Total</p>
                  <p className={`text-lg font-semibold ${totalLateFee > 0 ? 'text-red-600' : ''}`}>
                    {formatCurrency(totalLateFee, currency)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Installments Table */}
          {installments.length > 0 ? (
            <DataTable columns={columns} data={installments} />
          ) : (
            <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
              <p className="text-muted-foreground">No hay cuotas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {financingId && (
        <RegisterInstallmentPaymentApprovedModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          financingId={financingId}
          saleId={saleId}
          currency={currency}
          title={`Registrar Pago - ${title}`}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
