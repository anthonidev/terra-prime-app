'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { Building2, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import VentasActionsButton from './VentasActionsButton';
import { CurrencyType, SaleList } from '@domain/entities/sales/salevendor.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';

type Props = {
  data: SaleList[];
};

const VentasTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    type: false
  });

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const columns = useMemo<ColumnDef<SaleList>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            # {(row.getValue('id') as string).substring(0, 8)}...
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'clientInfo',
        header: 'Cliente',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {sale.client.firstName} {sale.client.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{sale.client.phone}</div>
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
                <span className="text-sm font-medium">{sale.lot.name}</span>
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
        accessorKey: 'totalAmount',
        header: 'Monto Total',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">
                {formatCurrency(row.getValue('totalAmount'), sale.currency)}
              </span>
            </div>
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
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <VentasActionsButton sale={row.original} />,
        enableHiding: false
      }
    ],
    []
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
    <TableTemplate<SaleList>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default VentasTable;
