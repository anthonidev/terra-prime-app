'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { MySale, StatusSale } from '../../types';

// Status badge configurations
const statusConfig: Record<
  StatusSale,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  RESERVATION_PENDING: { label: 'Reserva Pendiente', variant: 'outline' },
  RESERVATION_PENDING_APPROVAL: { label: 'Reserva Por Aprobar', variant: 'secondary' },
  RESERVED: { label: 'Reservado', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PENDING_APPROVAL: { label: 'Por Aprobar', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  IN_PAYMENT_PROCESS: { label: 'En Proceso de Pago', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

const columns: ColumnDef<MySale>[] = [
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
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {client.firstName} {client.lastName}
          </span>
          <span className="text-sm text-muted-foreground">{client.phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'lot',
    header: 'Lote',
    cell: ({ row }) => {
      const lot = row.original.lot;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{lot.name}</span>
          <span className="text-sm text-muted-foreground">
            {lot.project} - {lot.stage}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <span className="capitalize">
          {type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Monto Total',
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number;
      const currency = row.original.currency;
      return (
        <span className="font-medium">
          {currency === 'USD' ? '$' : 'S/'} {amount.toLocaleString('es-PE')}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusSale;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const saleId = row.original.id;
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ventas/detalle/${saleId}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalle
          </Link>
        </Button>
      );
    },
  },
];

interface MySalesTableProps {
  data: MySale[];
}

export function MySalesTable({ data }: MySalesTableProps) {
  return <DataTable columns={columns} data={data} />;
}
