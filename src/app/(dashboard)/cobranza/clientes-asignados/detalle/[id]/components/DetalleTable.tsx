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
import { Building2, Eye, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ListByClient } from '@domain/entities/cobranza';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/common/table/StatusBadge';

export default function DetalleTable({ id, data }: { id: number; data: ListByClient[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true
  });

  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const columns = useMemo<ColumnDef<ListByClient>[]>(
    () => [
      {
        accessorKey: 'index',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">{row.index + 1}</div>,
        enableHiding: true
      },
      {
        id: 'clientInfo',
        header: 'Cliente',
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {data.client.firstName} {data.client.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{data.client.phone}</div>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'lotInfo',
        header: 'Lote',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">proyecto: {sale.lot.project}</span>
                <span className="text-xs font-medium">etapa: {sale.lot.stage}</span>
                <span className="text-xs font-medium">lote: {sale.lot.name}</span>
                <span className="text-xs font-medium">manzana: {sale.lot.block}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(Number(sale.lot.lotPrice), sale.currency)}
                </span>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <StatusBadge status={row.getValue('type')} />,
        enableHiding: true
      },
      {
        id: 'vendorInfo',
        header: 'Vendedor',
        cell: ({ row }) => {
          const sale = row.original;
          return sale.vendor ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {sale.vendor.firstName} {sale.vendor.lastName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {sale.vendor.document}
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
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/cobranza/clientes-asignados/detalle/${id}/venta/${row.original.id}`)
              }
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
    [router, id]
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
    <TableTemplate<ListByClient>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
}
