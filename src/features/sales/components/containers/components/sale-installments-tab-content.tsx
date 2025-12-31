'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { RegisterInstallmentPaymentApprovedModal } from '../../dialogs/register-installment-payment-approved-modal';
import type {
  SaleDetailInstallment,
  SaleDetailLotFinancing,
  SaleDetailUrbanDevelopmentFinancing,
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

interface SummaryMeta {
  installmentsCount: number;
  totalAmount: number;
}

interface SaleInstallmentsTabContentProps {
  installments: SaleDetailInstallment[];
  currency: CurrencyType;
  title: string;
  financingId: string | null;
  saleId: string;
  onPaymentSuccess?: () => void;
  canRegisterPayment?: boolean;
  lotInfo?: SaleDetailLotFinancing | null;
  urbanDevelopmentInfo?: SaleDetailUrbanDevelopmentFinancing | null;
  summaryMeta?: SummaryMeta | null;
}

export function SaleInstallmentsTabContent({
  installments,
  currency,
  title,
  financingId,
  saleId,
  onPaymentSuccess,
  canRegisterPayment = false,
  lotInfo,
  urbanDevelopmentInfo,
  summaryMeta,
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

  // Calculate progress
  const totalAmount = summaryMeta?.totalAmount || calculatedTotals.totalAmount;
  const totalPaid = calculatedTotals.totalPaid;
  const totalPending = calculatedTotals.totalPending;
  const totalLateFee = calculatedTotals.totalLateFee;
  const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  // Get quantity of installments
  const quantityCoutes =
    summaryMeta?.installmentsCount ||
    (lotInfo ? parseInt(String(lotInfo.quantityCoutes)) : null) ||
    (urbanDevelopmentInfo ? parseInt(String(urbanDevelopmentInfo.quantityCoutes)) : null) ||
    installments.length;

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    onPaymentSuccess?.();
  };

  return (
    <>
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
                  {formatCurrency(totalPaid, currency)} / {formatCurrency(totalAmount, currency)}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          {installments.length > 0 && (
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
