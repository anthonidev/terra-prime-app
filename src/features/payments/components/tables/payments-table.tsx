'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { Payment } from '../../types';
import {
  createDateColumn,
  createPaymentConfigColumn,
  createClientColumn,
  createLotColumn,
  createAmountColumn,
  createTicketColumn,
  createStatusColumn,
  createRegisteredByColumn,
} from '../shared/column-definitions';

interface PaymentsTableProps {
  data: Payment[];
}

const STORAGE_KEY = 'payments-table-visibility-v1';

const columns: ColumnDef<Payment>[] = [
  createDateColumn<Payment>(),
  createPaymentConfigColumn<Payment>(),
  createClientColumn<Payment>(),
  createLotColumn<Payment>(),
  createAmountColumn<Payment>(),
  createTicketColumn<Payment>(),
  createStatusColumn<Payment>(),
  createRegisteredByColumn<Payment>(),
  {
    id: 'actions',
    header: 'Acciones',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <Link href={`/pagos/detalle/${payment.id}`}>
            <Eye className="text-muted-foreground hover:text-primary h-4 w-4 transition-colors" />
            <span className="sr-only">Ver detalle</span>
          </Link>
        </Button>
      );
    },
  },
];

export function PaymentsTable({ data }: PaymentsTableProps) {
  return (
    <DataTable columns={columns} data={data} storageKey={STORAGE_KEY} enableColumnVisibility />
  );
}
