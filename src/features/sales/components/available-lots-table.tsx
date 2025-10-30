'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { Lot } from '../types';
import type { PaginationMeta } from '@/shared/types/pagination';

interface AvailableLotsTableProps {
  lots: Lot[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  ACTIVE: { label: 'Disponible', variant: 'default' },
  RESERVED: { label: 'Reservado', variant: 'secondary' },
  SOLD: { label: 'Vendido', variant: 'outline' },
  INACTIVE: { label: 'No disponible', variant: 'destructive' },
};

export function AvailableLotsTable({
  lots,
  meta,
  onPageChange,
}: AvailableLotsTableProps) {
  const columns: ColumnDef<Lot>[] = [
    {
      accessorKey: 'name',
      header: 'Lote',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'stageName',
      header: 'Etapa',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.stageName}</span>
      ),
    },
    {
      accessorKey: 'blockName',
      header: 'Manzana',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.blockName}</span>
      ),
    },
    {
      accessorKey: 'area',
      header: 'Área',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.area} m²
        </span>
      ),
    },
    {
      accessorKey: 'lotPrice',
      header: 'Precio Lote',
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.projectCurrency} {Number(row.original.lotPrice).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: 'urbanizationPrice',
      header: 'Precio Urbanización',
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.projectCurrency} {Number(row.original.urbanizationPrice).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Precio Total',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-primary">
          {row.original.projectCurrency} {row.original.totalPrice.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status] || {
          label: row.original.status,
          variant: 'outline' as const,
        };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.updatedAt), 'PPP', { locale: es })}
        </span>
      ),
    },
  ];

  if (lots.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <p className="text-center text-muted-foreground">
          No se encontraron lotes disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={lots} />
      </div>

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
