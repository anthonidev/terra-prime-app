'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { SaleResponse } from '@/types/sales';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, CreditCard, DollarSign, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import VentasActionsButton from './VentasActionsButton';

type Props = {
  data: SaleResponse[];
};

const VentasTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    type: false,
    contractDate: false
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const columns = useMemo<ColumnDef<SaleResponse>[]>(
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
                  {formatCurrency(sale.lot.lotPrice)}
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
        cell: ({ row }) => (
          <Badge variant={row.getValue('type') === 'FINANCED' ? 'default' : 'secondary'}>
            {row.getValue('type') === 'FINANCED' ? 'Financiado' : 'Directo'}
          </Badge>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'totalAmount',
        header: 'Monto Total',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-green-600">
              {formatCurrency(row.getValue('totalAmount'))}
            </span>
          </div>
        ),
        enableHiding: false
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const variant =
            status === 'COMPLETED' ? 'default' : status === 'PENDING' ? 'secondary' : 'destructive';

          return (
            <Badge variant={variant}>
              {status === 'COMPLETED' ? 'Completada' : status === 'PENDING' ? 'Pendiente' : status}
            </Badge>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'saleDate',
        header: 'Fecha de Venta',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{formatDate(row.getValue('saleDate'))}</span>
          </div>
        ),
        enableHiding: false
      },
      {
        accessorKey: 'contractDate',
        header: 'Fecha de Contrato',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{formatDate(row.getValue('contractDate'))}</span>
          </div>
        ),
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
    <TableTemplate<SaleResponse>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default VentasTable;
