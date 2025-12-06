'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, DollarSign, Eye, MapPin, Tag, User } from 'lucide-react';
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
  RESERVATION_IN_PAYMENT: { label: 'Reserva en Pago', variant: 'secondary' },
  IN_PAYMENT: { label: 'En Pago', variant: 'secondary' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

const columns: ColumnDef<MySale>[] = [
  {
    accessorKey: 'createdAt',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>Fecha</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <span className="font-medium">{format(date, 'dd MMM yyyy', { locale: es })}</span>;
    },
  },
  {
    accessorKey: 'client',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground h-4 w-4" />
          <span>Cliente</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {client.firstName} {client.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{client.phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'lot',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <span>Lote</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const lot = row.original.lot;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{lot.name}</span>
          <span className="text-muted-foreground text-xs">
            {lot.project} - {lot.stage}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <Tag className="text-muted-foreground h-4 w-4" />
          <span>Tipo</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="secondary" className="font-normal">
          {type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          <span>Monto</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number;
      const currency = row.original.currency;
      return (
        <span className="font-semibold text-green-600">
          {currency === 'USD' ? '$' : 'S/'} {amount.toLocaleString('es-PE')}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalAmountPaid',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          <span>Pagado</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const paid = (row.getValue('totalAmountPaid') as number) || 0;
      const currency = row.original.currency;
      return (
        <span className="font-medium text-blue-600">
          {currency === 'USD' ? '$' : 'S/'} {paid.toLocaleString('es-PE')}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalToPay',
    header: ({}) => {
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          <span>Pendiente</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const pending = (row.getValue('totalToPay') as number) || 0;
      const currency = row.original.currency;
      return (
        <span className="font-medium text-orange-600">
          {currency === 'USD' ? '$' : 'S/'} {pending.toLocaleString('es-PE')}
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
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link href={`/ventas/detalle/${saleId}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver Detalle</span>
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
