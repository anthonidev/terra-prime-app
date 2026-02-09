'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Calendar,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DataTable } from '@/shared/components/data-table/data-table';
import { PaymentMetadataModal } from '../dialogs/payment-metadata-modal';
import type { PaymentSummary, StatusPayment, CurrencyType } from '../../types';
import { formatDateOnly, formatDateTime } from '@/shared/utils/date-formatter';

type SortOrder = 'asc' | 'desc' | null;

// Function to parse and compare ticket numbers (e.g., B001-00000398, BT01-53966)
function compareTicketNumbers(a: string | null, b: string | null): number {
  if (!a && !b) return 0;
  if (!a) return 1; // null values go to the end
  if (!b) return -1;

  // Split by hyphen to get prefix and number
  const [prefixA, numA] = a.split('-');
  const [prefixB, numB] = b.split('-');

  // First compare prefixes alphabetically
  const prefixCompare = (prefixA || '').localeCompare(prefixB || '');
  if (prefixCompare !== 0) return prefixCompare;

  // Then compare numbers numerically
  const numberA = parseInt(numA || '0', 10);
  const numberB = parseInt(numB || '0', 10);
  return numberA - numberB;
}

// Payment status badge configurations
const paymentStatusConfig: Record<
  StatusPayment,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    dotColor: string;
  }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline', dotColor: 'bg-yellow-500' },
  APPROVED: { label: 'Aprobado', variant: 'default', dotColor: 'bg-green-500' },
  COMPLETED: { label: 'Completado', variant: 'secondary', dotColor: 'bg-blue-500' },
  REJECTED: { label: 'Rechazado', variant: 'destructive', dotColor: 'bg-red-500' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive', dotColor: 'bg-gray-400' },
};

// Payment config badge styles
const configBadgeStyles: Record<string, string> = {
  'Pago de Venta': 'bg-green-50 text-green-700 border-green-200',
  'Pago de Reserva': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pago de Inicial': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pago de Cuota': 'bg-purple-50 text-purple-700 border-purple-200',
  'Pago de Mora': 'bg-red-50 text-red-700 border-red-200',
};

interface SalePaymentsTableProps {
  payments: PaymentSummary[];
  currency: CurrencyType;
}

export function SalePaymentsTable({ payments, currency }: SalePaymentsTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentSummary | null>(null);
  const [ticketSortOrder, setTicketSortOrder] = useState<SortOrder>('asc');
  const [showCancelled, setShowCancelled] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  // Filter and sort payments
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;
    if (!showCancelled) {
      filtered = payments.filter((payment) => payment.status !== 'CANCELLED');
    }

    if (!ticketSortOrder) return filtered;

    return [...filtered].sort((a, b) => {
      const comparison = compareTicketNumbers(a.numberTicket, b.numberTicket);
      return ticketSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [payments, ticketSortOrder, showCancelled]);

  // Count cancelled payments
  const cancelledCount = useMemo(() => {
    return payments.filter((payment) => payment.status === 'CANCELLED').length;
  }, [payments]);

  // Toggle sort order: asc -> desc -> null -> asc
  const toggleTicketSort = () => {
    setTicketSortOrder((current) => {
      if (current === 'asc') return 'desc';
      if (current === 'desc') return null;
      return 'asc';
    });
  };

  const columns: ColumnDef<PaymentSummary>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const id = row.getValue('id') as number;
        return (
          <Link
            href={`/pagos/detalle/${id}`}
            className="text-primary group inline-flex items-center gap-1 font-mono text-sm font-medium hover:underline"
          >
            #{id}
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Creacion
        </span>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <span className="text-muted-foreground text-sm tabular-nums">
            {formatDateTime(date, 'dd MMM yyyy')}
          </span>
        );
      },
    },
    {
      accessorKey: 'dateOperation',
      header: () => (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Operacion
        </span>
      ),
      cell: ({ row }) => {
        const date = row.getValue('dateOperation') as string | null;
        if (!date) return <span className="text-muted-foreground/50">--</span>;
        return <span className="text-sm tabular-nums">{formatDateOnly(date, 'dd MMM yyyy')}</span>;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        return (
          <span className="text-sm font-semibold tabular-nums">
            {currencySymbol} {amount.toLocaleString('es-PE')}
          </span>
        );
      },
    },
    {
      accessorKey: 'numberTicket',
      header: () => (
        <span className="inline-flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5" />
          N° Boleta
        </span>
      ),
      cell: ({ row }) => {
        const ticket = row.getValue('numberTicket') as string | null;
        return ticket ? (
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{ticket}</code>
        ) : (
          <span className="text-muted-foreground/50">--</span>
        );
      },
    },
    {
      accessorKey: 'paymentConfig',
      header: 'Tipo',
      cell: ({ row }) => {
        const config = row.getValue('paymentConfig') as string;
        const badgeStyle = configBadgeStyles[config] || 'bg-muted text-muted-foreground';
        return (
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${badgeStyle}`}
          >
            {config}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as StatusPayment;
        const config = paymentStatusConfig[status];
        return (
          <Badge variant={config.variant} className="gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'reviewedAt',
      header: 'Revision',
      cell: ({ row }) => {
        const date = row.getValue('reviewedAt') as string | null;
        if (!date) return <span className="text-muted-foreground/50">--</span>;
        return (
          <span className="text-muted-foreground text-sm tabular-nums">
            {formatDateTime(date, 'dd MMM yyyy HH:mm')}
          </span>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Motivo',
      cell: ({ row }) => {
        const reason = row.getValue('reason') as string | null;
        if (!reason) return <span className="text-muted-foreground/50">--</span>;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground block max-w-[150px] cursor-default truncate text-sm">
                  {reason}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{reason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: 'metadata',
      header: '',
      cell: ({ row }) => {
        const payment = row.original;
        const hasMetadata = payment.metadata && Object.keys(payment.metadata).length > 0;

        if (!hasMetadata) return null;

        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedPayment(payment)}
            aria-label={`Ver metadata del pago #${payment.id}`}
          >
            <Info className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const totalAmount = useMemo(
    () =>
      payments.reduce((sum, payment) => {
        if (payment.status === 'APPROVED') {
          return sum + payment.amount;
        }
        return sum;
      }, 0),
    [payments]
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Resumen de Pagos</CardTitle>
              <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                {filteredAndSortedPayments.length}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {cancelledCount > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showCancelled"
                    checked={showCancelled}
                    onCheckedChange={(checked) => setShowCancelled(checked === true)}
                  />
                  <Label
                    htmlFor="showCancelled"
                    className="text-muted-foreground cursor-pointer text-sm font-normal"
                  >
                    Cancelados ({cancelledCount})
                  </Label>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTicketSort}
                className="h-8 gap-1.5"
                aria-label={`Ordenar por N° Boleta${ticketSortOrder ? ` (${ticketSortOrder === 'asc' ? 'ascendente' : 'descendente'})` : ''}`}
              >
                {ticketSortOrder === 'asc' ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : ticketSortOrder === 'desc' ? (
                  <ArrowDown className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5" />
                )}
                <span className="hidden text-xs sm:inline">Boleta</span>
              </Button>
              <div className="border-l pl-3 text-right">
                <p className="text-muted-foreground text-xs">Total Pagado</p>
                <p className="text-base font-bold tabular-nums">
                  {currencySymbol} {totalAmount.toLocaleString('es-PE')}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredAndSortedPayments.length > 0 ? (
            <DataTable columns={columns} data={filteredAndSortedPayments} />
          ) : (
            <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">No hay pagos para mostrar</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentMetadataModal
        open={!!selectedPayment}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
        metadata={selectedPayment?.metadata ?? null}
        paymentId={selectedPayment?.id ?? 0}
      />
    </>
  );
}
