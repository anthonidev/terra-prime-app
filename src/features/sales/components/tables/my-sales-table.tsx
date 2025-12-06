'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { type PaginationMeta } from '@/shared/types/pagination';
import { type MySale } from '../../types';
import {
  createDateColumn,
  createClientColumn,
  createLotColumn,
  createTotalAmountColumn,
  createCombinedInstallmentsColumn,
  createCombinedInitialAmountColumn,
  createReservationAmountColumn,
  createTypeAndStatusColumn,
  createReportsColumn,
} from '../shared/column-definitions';

interface MySalesTableProps {
  data: MySale[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function MySalesTable({ data, meta, onPageChange }: MySalesTableProps) {
  const columns: ColumnDef<MySale>[] = [
    createDateColumn<MySale>(),
    createClientColumn<MySale>(),
    createLotColumn<MySale>(),
    createTypeAndStatusColumn<MySale>(),
    createTotalAmountColumn<MySale>(),

    // Hidden columns
    createCombinedInstallmentsColumn<MySale>(),
    createCombinedInitialAmountColumn<MySale>(),
    createReservationAmountColumn<MySale>(),

    createReportsColumn<MySale>(),
    {
      id: 'actions',
      header: 'Acciones',
      enableHiding: false,
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

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        enableColumnVisibility={true}
        initialColumnVisibility={{
          combinedInstallments: false,
          combinedInitialAmount: false,
          reservationAmount: false,
        }}
        storageKey="my-sales-table-columns-v5"
      />

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
