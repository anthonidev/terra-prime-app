'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Info, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  COMPLETED: { label: 'Completado', variant: 'secondary' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};

interface SalePaymentsTableProps {
  payments: PaymentSummary[];
  currency: CurrencyType;
}

export function SalePaymentsTable({ payments, currency }: SalePaymentsTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentSummary | null>(null);
  const [ticketSortOrder, setTicketSortOrder] = useState<SortOrder>('asc');
  const [showCancelled, setShowCancelled] = useState(false);

  // Filter and sort payments
  const filteredAndSortedPayments = useMemo(() => {
    // First filter out cancelled if needed
    let filtered = payments;
    if (!showCancelled) {
      filtered = payments.filter((payment) => payment.status !== 'CANCELLED');
    }

    // Then sort by ticket number
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
          <Link href={`/pagos/detalle/${id}`} className="text-primary font-mono hover:underline">
            #{id}
          </Link>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return formatDateTime(date, 'dd MMM yyyy HH:mm');
      },
    },
    {
      accessorKey: 'dateOperation',
      header: 'Fecha de Operación',
      cell: ({ row }) => {
        const date = row.getValue('dateOperation') as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return formatDateOnly(date, 'dd MMM yyyy');
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        return (
          <span className="font-medium">
            {currency === 'USD' ? '$' : 'S/'} {amount.toLocaleString('es-PE')}
          </span>
        );
      },
    },

    {
      accessorKey: 'numberTicket',
      header: 'N° Boleta',
      cell: ({ row }) => {
        const ticket = row.getValue('numberTicket') as string | null;
        return ticket ? (
          <span className="font-mono text-sm">{ticket}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'paymentConfig',
      header: 'Configuración',
      cell: ({ row }) => {
        const config = row.getValue('paymentConfig') as string;
        return <span className="text-sm">{config}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as StatusPayment;
        const config = paymentStatusConfig[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: 'reviewedAt',
      header: 'Fecha de Revisión',
      cell: ({ row }) => {
        const date = row.getValue('reviewedAt') as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return formatDateTime(date, 'dd MMM yyyy HH:mm');
      },
    },
    {
      accessorKey: 'reason',
      header: 'Motivo',
      cell: ({ row }) => {
        const reason = row.getValue('reason') as string | null;
        return reason || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'metadata',
      header: 'Metadata',
      cell: ({ row }) => {
        const payment = row.original;
        const hasMetadata = payment.metadata && Object.keys(payment.metadata).length > 0;

        if (!hasMetadata) {
          return <span className="text-muted-foreground">-</span>;
        }

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPayment(payment)}
            title="Ver metadata"
          >
            <Info className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const totalAmount = payments.reduce((sum, payment) => {
    if (payment.status === 'APPROVED') {
      return sum + payment.amount;
    }
    return sum;
  }, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Resumen de Pagos</CardTitle>
            <div className="flex items-center gap-4">
              {/* Show Cancelled Filter */}
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
                    Mostrar cancelados ({cancelledCount})
                  </Label>
                </div>
              )}
              {/* Sort by Ticket Number */}
              <Button variant="outline" size="sm" onClick={toggleTicketSort} className="h-9 gap-2">
                {ticketSortOrder === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : ticketSortOrder === 'desc' ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">N° Boleta</span>
                {ticketSortOrder && (
                  <span className="text-muted-foreground text-xs">
                    ({ticketSortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                  </span>
                )}
              </Button>
              {/* Total Paid */}
              <div className="text-right">
                <p className="text-muted-foreground text-sm">Total Pagado</p>
                <p className="text-lg font-bold">
                  {currency === 'USD' ? '$' : 'S/'} {totalAmount.toLocaleString('es-PE')}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedPayments.length > 0 ? (
            <DataTable columns={columns} data={filteredAndSortedPayments} />
          ) : (
            <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
              <p className="text-muted-foreground">No hay pagos registrados</p>
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
