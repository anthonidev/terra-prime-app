'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, CreditCard } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { type PaginationMeta } from '@/shared/types/pagination';
import { type MySale, type StatusSale } from '../../types';
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
  onRegisterPayment?: (sale: MySale) => void;
  canRegisterPaymentByStatus?: (status: StatusSale) => boolean;
  calculatePendingAmount?: (sale: MySale) => number;
}

export function MySalesTable({
  data,
  meta,
  onPageChange,
  onRegisterPayment,
  canRegisterPaymentByStatus,
  calculatePendingAmount,
}: MySalesTableProps) {
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
        const sale = row.original;
        const canRegister =
          onRegisterPayment &&
          canRegisterPaymentByStatus &&
          calculatePendingAmount &&
          canRegisterPaymentByStatus(sale.status) &&
          calculatePendingAmount(sale) > 0;

        return (
          <div className="flex items-center gap-1">
            {canRegister && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onRegisterPayment(sale)}
                title="Registrar Pago"
              >
                <CreditCard className="h-4 w-4" />
                <span className="sr-only">Registrar Pago</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <Link href={`/ventas/detalle/${sale.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver Detalle</span>
              </Link>
            </Button>
          </div>
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
