'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { UserInfo } from '@/shared/components/user-info';
import { MyPayment, StatusPayment } from '../../types';
import { PaymentConfigBadge } from '@/features/payments/components/shared/payment-config-badge';
import { statusConfig } from '@/features/payments/components/shared/status-config';

const STORAGE_KEY = 'my-payments-table-visibility';

interface MyPaymentsTableProps {
  data: MyPayment[];
}

export function MyPaymentsTable({ data }: MyPaymentsTableProps) {
  const columns: ColumnDef<MyPayment>[] = [
    {
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
    },
    {
      accessorKey: 'paymentConfig',
      header: 'Tipo de Pago',
      cell: ({ row }) => {
        const paymentConfig = row.original.paymentConfig;
        return <PaymentConfigBadge code={paymentConfig.code} name={paymentConfig.name} />;
      },
      enableHiding: false,
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

        return <UserInfo name={`${lead.firstName} ${lead.lastName}`} document={lead.document} />;
      },
      enableHiding: false,
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
    },
    {
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
    },
    {
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
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as StatusPayment;
        const config = statusConfig[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
      enableHiding: false,
    },
    {
      id: 'actions',
      header: 'Acciones',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/cobranza/pagos/detalle/${payment.id}`}>
              <Eye className="text-muted-foreground hover:text-primary h-4 w-4 transition-colors" />
              <span className="sr-only">Ver detalle</span>
            </Link>
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable columns={columns} data={data} storageKey={STORAGE_KEY} enableColumnVisibility />
  );
}
