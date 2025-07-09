'use client';

import TableTemplate from '@components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { DollarSign, Calendar, Square, Ruler, MapPin, Eye } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CurrencyType } from '@domain/entities/sales/salevendor.entity';
import { LotProject } from '@domain/entities/lotes/lot.entity';
import { Badge } from '@components/ui/badge';

type Props = {
  data: LotProject[];
};

const VentasTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    type: true
  });

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const columns = useMemo<ColumnDef<LotProject>[]>(
    () => [
      {
        id: 'index',
        header: () => (
          <div className="flex items-center justify-center gap-2 font-semibold">
            <span className="text-xs">#</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {row.index + 1}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Square className="h-4 w-4 text-purple-600" />
            <span>Lote</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Square className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {row.getValue('name')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lote residencial</div>
            </div>
          </div>
        ),
        enableHiding: false
      },
      {
        accessorKey: 'area',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Ruler className="h-4 w-4 text-blue-600" />
            <span>Área m²</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
              {row.getValue('area')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">metros cuadrados</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'lotPrice',
        header: () => (
          <div className="flex items-center justify-end gap-2 font-semibold">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Precio Lote</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {formatCurrency(row.getValue('lotPrice'), row.original.projectCurrency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Precio base</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'urbanizationPrice',
        header: () => (
          <div className="flex items-center justify-end gap-2 font-semibold">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span>Precio HU</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(row.getValue('urbanizationPrice'), row.original.projectCurrency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Habilitación urbana</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Eye className="h-4 w-4 text-gray-600" />
            <span>Estado</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge variant="destructive" className="px-3 py-1 text-xs font-medium">
              {row.getValue('status')}
            </Badge>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>Fecha de creación</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(row.getValue('createdAt'))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(row.getValue('createdAt'))}
              </div>
            </div>
          </div>
        ),
        enableHiding: true
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
    <TableTemplate<LotProject>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default VentasTable;
