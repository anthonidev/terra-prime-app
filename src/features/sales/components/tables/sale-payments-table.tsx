'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Info } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { PaymentMetadataModal } from '../dialogs/payment-metadata-modal';
import type { PaymentSummary, StatusPayment, CurrencyType } from '../../types';

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
        const date = new Date(row.getValue('createdAt'));
        return format(date, 'dd MMM yyyy HH:mm', { locale: es });
      },
    },
    {
      accessorKey: 'dateOperation',
      header: 'Fecha de Operación',
      cell: ({ row }) => {
        const date = row.getValue('dateOperation') as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return format(new Date(date), 'dd MMM yyyy', { locale: es });
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
        return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: es });
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
          <div className="flex items-center justify-between">
            <CardTitle>Resumen de Pagos</CardTitle>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Total Pagado</p>
              <p className="text-lg font-bold">
                {currency === 'USD' ? '$' : 'S/'} {totalAmount.toLocaleString('es-PE')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <DataTable columns={columns} data={payments} />
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
