'use client';

import TableTemplate from '@components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { Calendar, Ruler, Square } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CurrencyType } from '@domain/entities/sales/salevendor.entity';
import { LotProject } from '@domain/entities/lotes/lot.entity';

type Props = {
  data: LotProject[];
};

const VentasTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    createdAt: false
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
        id: 'lote',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Square className="h-4 w-4" />
            <span>Lote</span>
          </div>
        ),
        cell: ({ row }) => {
          const lote = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Square className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Etapa:&nbsp;
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    {lote.stageName}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Manzana:&nbsp;
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    {lote.blockName}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Lote:&nbsp;
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                    {lote.name}
                  </span>
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'area',
        header: () => <span>Area</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            {row.getValue('area')} m²
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'lotPrice',
        header: () => <span>Precio Lote</span>,
        cell: ({ row }) => (
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(row.getValue('lotPrice'), row.original.projectCurrency)}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'urbanizationPrice',
        header: () => <span>Precio HU</span>,
        cell: ({ row }) => (
          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(row.getValue('urbanizationPrice'), row.original.projectCurrency)}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
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
