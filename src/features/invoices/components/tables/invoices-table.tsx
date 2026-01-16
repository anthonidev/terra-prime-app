'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { InvoiceListItem } from '../../types';
import {
  createDateColumn,
  createDocumentTypeColumn,
  createFullNumberColumn,
  createClientColumn,
  createTotalColumn,
  createStatusColumn,
  createCreatedByColumn,
  createActionsColumn,
} from '../shared/column-definitions';

interface InvoicesTableProps {
  data: InvoiceListItem[];
}

const STORAGE_KEY = 'invoices-table-visibility-v1';

const columns: ColumnDef<InvoiceListItem>[] = [
  createDateColumn(),
  createDocumentTypeColumn(),
  createFullNumberColumn(),
  createClientColumn(),
  createTotalColumn(),
  createStatusColumn(),
  createCreatedByColumn(),
  createActionsColumn(),
];

export function InvoicesTable({ data }: InvoicesTableProps) {
  return (
    <DataTable columns={columns} data={data} storageKey={STORAGE_KEY} enableColumnVisibility />
  );
}
