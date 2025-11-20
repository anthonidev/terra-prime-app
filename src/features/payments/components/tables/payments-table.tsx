'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { Payment, StatusPayment } from '../../types';

// Status badge configurations
const statusConfig: Record<
  StatusPayment,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};

interface PaymentsTableProps {
  data: Payment[];
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return format(date, 'dd MMM yyyy', { locale: es });
    },
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => {
      const client = row.original.client;
      const lead = client?.lead;

      if (!lead?.firstName && !lead?.lastName) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {lead.firstName} {lead.lastName}
          </span>
          {lead.document && <span className="text-muted-foreground text-sm">{lead.document}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'lot',
    header: 'Lote',
    cell: ({ row }) => {
      const lot = row.original.lot;

      if (!lot?.name) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">{lot.name}</span>
          {lot.project && <span className="text-muted-foreground text-sm">{lot.project}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Monto',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const currency = row.original.currency;
      const symbol = currency === 'USD' ? '$' : 'S/';
      return (
        <span className="font-medium">
          {symbol} {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: 'codeOperation',
    header: 'Código Operación',
    cell: ({ row }) => {
      const code = row.getValue('codeOperation') as string | undefined;
      return code ? (
        <span className="font-mono text-sm">{code}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: 'banckName',
    header: 'Banco',
    cell: ({ row }) => {
      const bank = row.getValue('banckName') as string | undefined;
      return bank ? (
        <span className="text-sm">{bank}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusPayment;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'user',
    header: 'Registrado por',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/pagos/detalle/${payment.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </Button>
      );
    },
  },
];

export function PaymentsTable({ data }: PaymentsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
