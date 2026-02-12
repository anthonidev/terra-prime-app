'use client';

import { useState, useMemo, useCallback } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CreditCard,
  Wallet,
  Percent,
  Calculator,
  AlertTriangle,
  DollarSign,
  Car,
  CircleOff,
  Scale,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DataTable } from '@/shared/components/data-table/data-table';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { RegisterInstallmentPaymentApprovedModal } from '../../dialogs/register-installment-payment-approved-modal';
import { RegisterInitialPaymentApprovedModal } from '../../dialogs/register-initial-payment-approved-modal';
import { RegisterLateFeePaymentModal } from '../../dialogs/register-late-fee-payment-modal';
import { RegisterSingleInstallmentPaymentModal } from '../../dialogs/register-single-installment-payment-modal';
import { AdjustLateFeeModal } from '../../dialogs/adjust-late-fee-modal';
import { useUpdateParkingStatus } from '../../../hooks/use-update-parking-status';
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
  isADM?: boolean;
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
  isADM = false,
}: SaleInstallmentsTabContentProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInitialPaymentModalOpen, setIsInitialPaymentModalOpen] = useState(false);
  const [isLateFeeModalOpen, setIsLateFeeModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [singlePayment, setSinglePayment] = useState<{
    installmentIds: string[];
    pendingAmount: number;
    mode: 'installment' | 'late-fee';
  } | null>(null);
  const [isSinglePaymentModalOpen, setIsSinglePaymentModalOpen] = useState(false);
  const [adjustLateFeeData, setAdjustLateFeeData] = useState<{
    installmentId: string;
    currentLateFee: number;
  } | null>(null);
  const [isAdjustLateFeeModalOpen, setIsAdjustLateFeeModalOpen] = useState(false);
  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  const { mutate: updateParkingStatus, isPending: isUpdatingParking } =
    useUpdateParkingStatus(saleId);

  // Check if there's pending late fee
  const pendingLateFee = financingItem?.totalLateFeeePending ?? 0;
  const hasLateFee = pendingLateFee > 0;

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

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === installments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(installments.map((i) => i.id)));
    }
  }, [selectedIds.size, installments]);

  const toggleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkParkingUpdate = useCallback(
    (isParked: boolean) => {
      updateParkingStatus(
        { installmentIds: Array.from(selectedIds), isParked },
        { onSuccess: () => setSelectedIds(new Set()) }
      );
    },
    [selectedIds, updateParkingStatus]
  );

  // Calculate total pending for selected installments
  const selectedPendingTotal = useMemo(() => {
    return installments
      .filter((inst) => selectedIds.has(inst.id))
      .reduce((sum, inst) => sum + parseNumeric(inst.coutePending), 0);
  }, [selectedIds, installments]);

  // Calculate total pending late fees for selected installments
  const selectedLateFeePendingTotal = useMemo(() => {
    return installments
      .filter((inst) => selectedIds.has(inst.id))
      .reduce((sum, inst) => sum + parseNumeric(inst.lateFeeAmountPending), 0);
  }, [selectedIds, installments]);

  // Check if any selected installment has pending amount
  const hasSelectedPending = selectedPendingTotal > 0;
  // Check if any selected installment has pending late fees
  const hasSelectedLateFee = selectedLateFeePendingTotal > 0;

  const handleBulkPayment = useCallback(
    (mode: 'installment' | 'late-fee') => {
      const ids = Array.from(selectedIds);
      const pendingAmount =
        mode === 'installment' ? selectedPendingTotal : selectedLateFeePendingTotal;
      setSinglePayment({ installmentIds: ids, pendingAmount, mode });
      setIsSinglePaymentModalOpen(true);
    },
    [selectedIds, selectedPendingTotal, selectedLateFeePendingTotal]
  );

  const handleIndividualParkingToggle = useCallback(
    (installmentId: string, isParked: boolean) => {
      updateParkingStatus({ installmentIds: [installmentId], isParked });
    },
    [updateParkingStatus]
  );

  const isAllSelected = installments.length > 0 && selectedIds.size === installments.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < installments.length;

  const columns: ColumnDef<SaleDetailInstallment>[] = useMemo(() => {
    const cols: ColumnDef<SaleDetailInstallment>[] = [];

    // Checkbox column (ADM only)
    if (isADM) {
      cols.push({
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelected}
            ref={(ref) => {
              if (ref) {
                (ref as unknown as HTMLInputElement).indeterminate = isSomeSelected;
              }
            }}
            onCheckedChange={toggleSelectAll}
            aria-label="Seleccionar todo"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.has(row.original.id)}
            onCheckedChange={() => toggleSelectOne(row.original.id)}
            aria-label={`Seleccionar cuota ${row.original.numberCuote ?? row.index + 1}`}
          />
        ),
        enableSorting: false,
      });
    }

    cols.push(
      {
        accessorKey: 'numberCuote',
        header: 'N°',
        cell: ({ row }) => {
          const index = row.index + 1;
          const installment = row.original;
          return (
            <span className="font-mono font-medium tabular-nums">
              #{installment.numberCuote ?? index}
            </span>
          );
        },
      },
      {
        accessorKey: 'expectedPaymentDate',
        header: 'Vencimiento',
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
          return <span className="font-medium tabular-nums">{formatAmount(amount)}</span>;
        },
      },
      {
        id: 'pago',
        header: 'Pago',
        cell: ({ row }) => {
          const inst = row.original;
          const paid = parseNumeric(inst.coutePaid);
          const pending = parseNumeric(inst.coutePending);
          const lateFee = parseNumeric(inst.lateFeeAmountPending);

          return (
            <div className="space-y-0.5 tabular-nums">
              <div className="text-green-600">{formatAmount(paid)}</div>
              {pending > 0 && (
                <div className="text-xs text-amber-600">{formatAmount(pending)} pend.</div>
              )}
              {lateFee > 0 && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {formatAmount(lateFee)} mora
                </div>
              )}
            </div>
          );
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
      {
        accessorKey: 'isParked',
        header: 'Cochera',
        cell: ({ row }) => {
          if (isADM) {
            return (
              <Switch
                checked={row.original.isParked}
                onCheckedChange={(checked) =>
                  handleIndividualParkingToggle(row.original.id, checked)
                }
                disabled={isUpdatingParking}
                aria-label={row.original.isParked ? 'Quitar cochera' : 'Marcar como cochera'}
              />
            );
          }
          const isParked = row.original.isParked;
          if (!isParked) return <span className="text-muted-foreground">-</span>;
          return <Badge variant="secondary">Cochera</Badge>;
        },
      }
    );

    // Per-installment payment actions (ADM only)
    if (isADM && canRegisterPayment) {
      cols.push({
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const inst = row.original;
          const coutePending = parseNumeric(inst.coutePending);
          const lateFeePending = parseNumeric(inst.lateFeeAmountPending);

          return (
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={coutePending <= 0}
                    onClick={() => {
                      setSinglePayment({
                        installmentIds: [inst.id],
                        pendingAmount: coutePending,
                        mode: 'installment',
                      });
                      setIsSinglePaymentModalOpen(true);
                    }}
                    aria-label="Pagar Cuota"
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pagar Cuota</TooltipContent>
              </Tooltip>
              {lateFeePending > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => {
                        setSinglePayment({
                          installmentIds: [inst.id],
                          pendingAmount: lateFeePending,
                          mode: 'late-fee',
                        });
                        setIsSinglePaymentModalOpen(true);
                      }}
                      aria-label="Pagar Mora"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pagar Mora</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setAdjustLateFeeData({
                        installmentId: inst.id,
                        currentLateFee: parseNumeric(inst.lateFeeAmountPending),
                      });
                      setIsAdjustLateFeeModalOpen(true);
                    }}
                    aria-label="Ajustar Mora"
                  >
                    <Scale className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ajustar Mora</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      });
    }

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isADM, isAllSelected, isSomeSelected, selectedIds, isUpdatingParking, canRegisterPayment]);

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
                  {canRegisterPayment && financingId && financingItem.initialAmountPending > 0 && (
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => setIsInitialPaymentModalOpen(true)}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Registrar Pago Inicial
                    </Button>
                  )}
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
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {canRegisterPayment && financingId && (
                <>
                  <Button size="sm" onClick={() => setIsPaymentModalOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Registrar Pago
                  </Button>
                  <Button
                    size="sm"
                    variant={hasLateFee ? 'destructive' : 'outline'}
                    onClick={() => setIsLateFeeModalOpen(true)}
                    disabled={!hasLateFee}
                    className={!hasLateFee ? 'cursor-not-allowed opacity-50' : ''}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Registrar Pago de Mora
                  </Button>
                </>
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

          {/* Bulk Selection Action Bar (ADM only) */}
          <AnimatePresence>
            {isADM && selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span className="text-sm font-medium">
                  {selectedIds.size} cuota{selectedIds.size > 1 ? 's' : ''} seleccionada
                  {selectedIds.size > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {canRegisterPayment && hasSelectedPending && (
                    <Button size="sm" onClick={() => handleBulkPayment('installment')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar Cuotas
                    </Button>
                  )}
                  {canRegisterPayment && hasSelectedLateFee && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkPayment('late-fee')}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Pagar Moras
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkParkingUpdate(true)}
                    disabled={isUpdatingParking}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Marcar como cochera
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkParkingUpdate(false)}
                    disabled={isUpdatingParking}
                  >
                    <CircleOff className="mr-2 h-4 w-4" />
                    Quitar cochera
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

      {/* Late Fee Payment Modal */}
      {financingId && (
        <RegisterLateFeePaymentModal
          open={isLateFeeModalOpen}
          onOpenChange={setIsLateFeeModalOpen}
          financingId={financingId}
          saleId={saleId}
          currency={currency}
          title={`Registrar Pago de Mora - ${title}`}
          pendingLateFee={pendingLateFee}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Initial Payment Modal */}
      {financingId && financingItem && (
        <RegisterInitialPaymentApprovedModal
          open={isInitialPaymentModalOpen}
          onOpenChange={setIsInitialPaymentModalOpen}
          financingId={financingId}
          saleId={saleId}
          currency={currency}
          initialAmount={financingItem.initialAmount}
          initialAmountPaid={financingItem.initialAmountPaid}
          initialAmountPending={financingItem.initialAmountPending}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Single Installment Payment Modal */}
      {singlePayment && (
        <RegisterSingleInstallmentPaymentModal
          open={isSinglePaymentModalOpen}
          onOpenChange={(open) => {
            setIsSinglePaymentModalOpen(open);
            if (!open) {
              setSinglePayment(null);
              setSelectedIds(new Set());
            }
          }}
          installmentIds={singlePayment.installmentIds}
          saleId={saleId}
          currency={currency}
          pendingAmount={singlePayment.pendingAmount}
          mode={singlePayment.mode}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Adjust Late Fee Modal */}
      {adjustLateFeeData && (
        <AdjustLateFeeModal
          open={isAdjustLateFeeModalOpen}
          onOpenChange={(open) => {
            setIsAdjustLateFeeModalOpen(open);
            if (!open) setAdjustLateFeeData(null);
          }}
          installmentId={adjustLateFeeData.installmentId}
          saleId={saleId}
          currentLateFee={adjustLateFeeData.currentLateFee}
          currency={currency}
        />
      )}
    </>
  );
}
