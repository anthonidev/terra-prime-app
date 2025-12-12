import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { UserInfo } from '@/shared/components/user-info';
import type { Payment, StatusPayment } from '../../types';
import { PaymentConfigBadge } from './payment-config-badge';
import { statusConfig } from './status-config';

export function createDateColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const day = format(date, 'dd MMM', { locale: es });
      const year = format(date, 'yyyy', { locale: es });

      return (
        <div className="flex flex-col">
          <span className="text-foreground text-sm leading-none font-medium">{day}</span>
          <span className="text-muted-foreground mt-0.5 text-xs leading-none">{year}</span>
        </div>
      );
    },
    enableHiding: true,
  };
}

export function createPaymentConfigColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'paymentConfig',
    header: 'Tipo de Pago',
    cell: ({ row }) => {
      const paymentConfig = row.original.paymentConfig;
      return <PaymentConfigBadge code={paymentConfig.code} name={paymentConfig.name} />;
    },
    enableHiding: false,
  };
}

export function createClientColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => {
      const client = row.original.client;
      const lead = client?.lead;

      if (!lead?.firstName && !lead?.lastName) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return <UserInfo name={`${lead.firstName} ${lead.lastName}`} document={lead.document} />;
    },
    enableHiding: false,
  };
}

export function createLotColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'lot',
    header: 'Lote',
    cell: ({ row }) => {
      const lot = row.original.lot;

      if (!lot?.name) {
        return <span className="text-muted-foreground text-sm">Sin información</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-sm leading-none font-semibold">
                Lote {lot.name}
              </span>
              {lot.block && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {lot.block}
                </Badge>
              )}
            </div>
            {lot.stage && (
              <span className="text-muted-foreground mt-1 text-xs leading-none">{lot.stage}</span>
            )}
          </div>
        </div>
      );
    },
    enableHiding: true,
  };
}

export function createAmountColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'amount',
    header: 'Monto',
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
    enableHiding: false,
  };
}

export function createTicketColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'numberTicket',
    header: 'Boleta',
    cell: ({ row }) => {
      const ticket = row.getValue('numberTicket') as string | null | undefined;
      return ticket ? (
        <Badge variant="secondary" className="font-mono text-xs">
          {ticket}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
    enableHiding: true,
  };
}

export function createStatusColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusPayment;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    enableHiding: false,
  };
}

export function createRegisteredByColumn<T extends Payment>(): ColumnDef<T> {
  return {
    accessorKey: 'user',
    header: 'Registrado por',
    cell: ({ row }) => {
      const user = row.original.user;
      return <UserInfo name={`${user.firstName} ${user.lastName}`} email={user.email} />;
    },
    enableHiding: true,
  };
}
