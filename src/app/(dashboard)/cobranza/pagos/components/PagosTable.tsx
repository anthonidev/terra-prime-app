'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Button } from '@/components/ui/button';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Eye, SquareActivity, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurrencyType, PaymentListItem } from '@domain/entities/sales/payment.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';

export default function PagosTable({ data }: { data: PaymentListItem[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    type: false,
    contractDate: false,
    codeOperation: false,
    numberTicket: false
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const router = useRouter();

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        cell: ({ row }) => {
          const currency = row.original.currency as CurrencyType;
          const amount = parseFloat(row.getValue('amount'));

          return (
            <div className="font-medium text-green-600">{formatCurrency(amount, currency)}</div>
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
      },
      {
        accessorKey: 'user',
        header: 'Vendedor',
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.firstName + '' + user.lastName}</span>
                <span className="text-muted-foreground max-w-32 truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'client',
        header: 'Cliente',
        cell: ({ row }) => {
          const client = row.original;
          return client.client ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {client.client.lead.firstName}&nbsp;-&nbsp;{client.client.lead.lastName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {client.client.address}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Sin asignar</span>
          );
        },
        enableHiding: false
      },
      {
        id: 'lot',
        header: 'Lote',
        cell: ({ row }) => {
          const lote = row.original;
          return lote.lot ? (
            <div className="flex items-center gap-2">
              <SquareActivity className="text-muted-foreground h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  <span className="text-xs">Pro: </span>
                  {lote.lot.project ?? '--'}
                </span>
                <span className="text-muted-foreground text-xs">Et: {lote.lot.stage ?? '--'}</span>
                <span className="text-muted-foreground text-xs">Ma: {lote.lot.block ?? '--'}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Sin asignar</span>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'paymentConfig',
        header: 'Tipo',
        cell: ({ row }) => {
          const paymentConfig = row.original.paymentConfig;
          return <div className="max-w-28 truncate text-sm">{paymentConfig || 'N/A'}</div>;
        }
      },
      {
        accessorKey: 'codeOperation',
        header: 'Cod. de Operación',
        cell: ({ row }) => (
          <div className="text-sm font-medium">{row.getValue('codeOperation') ?? '--'}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'numberTicket',
        header: 'Boleta',
        cell: ({ row }) => (
          <div className="text-sm font-medium">{row.getValue('numberTicket') ?? '--'}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Pago',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{formatDate(row.getValue('createdAt'))}</span>
          </div>
        ),
        enableHiding: false
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/cobranza/pagos/detalle/${row.original.id}`)}
              className="hover:bg-primary/10 hover:text-primary"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </Button>
          );
        }
      }
    ],
    [router]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });

  return (
    <TableTemplate<PaymentListItem>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
}
