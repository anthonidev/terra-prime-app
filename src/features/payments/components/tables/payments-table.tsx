'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Eye,
  Calendar,
  User,
  Building2,
  DollarSign,
  CreditCard,
  Landmark,
  Activity,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { UserInfo } from '@/shared/components/user-info';
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
    header: ({}) => (
      <div className="flex items-center gap-2">
        <Calendar className="text-muted-foreground h-4 w-4" />
        <span>Fecha</span>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <span className="text-muted-foreground font-medium">
          {format(date, 'dd MMM yyyy', { locale: es })}
        </span>
      );
    },
  },
  {
    accessorKey: 'client',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <User className="text-muted-foreground h-4 w-4" />
        <span>Cliente</span>
      </div>
    ),
    cell: ({ row }) => {
      const client = row.original.client;
      const lead = client?.lead;

      if (!lead?.firstName && !lead?.lastName) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return (
        <UserInfo
          name={`${lead.firstName} ${lead.lastName}`}
          document={lead.document}
          // email={lead.email}
          // phone={lead.phone}
          // avatarFallback={lead.firstName?.[0] || 'C'}
        />
      );
    },
  },
  {
    accessorKey: 'lot',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <Building2 className="text-muted-foreground h-4 w-4" />
        <span>Lote</span>
      </div>
    ),
    cell: ({ row }) => {
      const lot = row.original.lot;

      if (!lot?.name) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{lot.name}</span>
          {lot.project && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              {lot.project}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <DollarSign className="text-muted-foreground h-4 w-4" />
        <span>Monto</span>
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const currency = row.original.currency;
      const symbol = currency === 'USD' ? '$' : 'S/';
      return (
        <div className="text-foreground font-semibold">
          {symbol} {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: 'codeOperation',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <CreditCard className="text-muted-foreground h-4 w-4" />
        <span>Código</span>
      </div>
    ),
    cell: ({ row }) => {
      const code = row.getValue('codeOperation') as string | undefined;
      return code ? (
        <Badge variant="secondary" className="font-mono text-xs">
          {code}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: 'banckName',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <Landmark className="text-muted-foreground h-4 w-4" />
        <span>Banco</span>
      </div>
    ),
    cell: ({ row }) => {
      const bank = row.getValue('banckName') as string | undefined;
      return bank ? (
        <span className="text-sm font-medium">{bank}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <Activity className="text-muted-foreground h-4 w-4" />
        <span>Estado</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusPayment;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'user',
    header: ({}) => (
      <div className="flex items-center gap-2">
        <UserCog className="text-muted-foreground h-4 w-4" />
        <span>Registrado por</span>
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <UserInfo
          name={`${user.firstName} ${user.lastName}`}
          email={user.email}
          // avatarFallback={user.firstName?.[0] || 'U'}
          // size="sm"
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <Link href={`/pagos/detalle/${payment.id}`}>
            <Eye className="text-muted-foreground hover:text-primary h-4 w-4 transition-colors" />
            <span className="sr-only">Ver detalle</span>
          </Link>
        </Button>
      );
    },
  },
];

export function PaymentsTable({ data }: PaymentsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
