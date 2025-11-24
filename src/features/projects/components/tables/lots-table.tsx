'use client';

import { Edit } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { Lot, LotStatus } from '../../types';
import type { PaginationMeta } from '@/shared/types/pagination';
import { LotCard } from '../cards/lot-card';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface LotsTableProps {
  lots: Lot[];
  meta: PaginationMeta;
  onEdit: (lot: Lot) => void;
  onPageChange: (page: number) => void;
}

const statusVariants: Record<LotStatus, 'default' | 'secondary' | 'outline'> = {
  Activo: 'default',
  Separado: 'secondary',
  Vendido: 'outline',
  Inactivo: 'outline',
};

export function LotsTable({ lots, meta, onEdit, onPageChange }: LotsTableProps) {
  const columns: ColumnDef<Lot>[] = [
    {
      accessorKey: 'name',
      header: 'Lote',
      cell: ({ row }) => <span className="font-medium">Lote {row.original.name}</span>,
    },
    {
      accessorKey: 'stageName',
      header: 'Etapa',
    },
    {
      accessorKey: 'blockName',
      header: 'Manzana',
      cell: ({ row }) => `Manzana ${row.original.blockName}`,
    },
    {
      accessorKey: 'area',
      header: 'Área (m²)',
      cell: ({ row }) => {
        const area = parseFloat(row.original.area);
        return <span className="font-mono">{area.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: 'lotPrice',
      header: 'Precio Lote',
      cell: ({ row }) => {
        const lotPrice = parseFloat(row.original.lotPrice);
        const currency = row.original.currency === 'USD' ? 'USD' : 'PEN';
        return <span className="font-mono text-sm">{formatCurrency(lotPrice, currency)}</span>;
      },
    },
    {
      accessorKey: 'urbanizationPrice',
      header: 'Urbanización',
      cell: ({ row }) => {
        const urbanizationPrice = parseFloat(row.original.urbanizationPrice);
        const currency = row.original.currency === 'USD' ? 'USD' : 'PEN';
        return (
          <span className="font-mono text-sm">{formatCurrency(urbanizationPrice, currency)}</span>
        );
      },
    },
    {
      id: 'totalPrice',
      header: 'Total',
      cell: ({ row }) => {
        const lotPrice = parseFloat(row.original.lotPrice);
        const urbanizationPrice = parseFloat(row.original.urbanizationPrice);
        const total = lotPrice + urbanizationPrice;
        const currency = row.original.currency === 'USD' ? 'USD' : 'PEN';
        return (
          <span className="text-primary font-mono text-sm font-semibold">
            {formatCurrency(total, currency)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={statusVariants[row.original.status]} className="w-fit text-xs">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => onEdit(row.original)}>
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (lots.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 shadow-sm">
        <p className="text-muted-foreground text-center">No se encontraron lotes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop: Tabla */}
      <div className="bg-card hidden rounded-lg border shadow-sm md:block">
        <DataTable columns={columns} data={lots} />
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-4 md:hidden">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} onEdit={onEdit} />
        ))}
      </div>

      {/* Pagination */}
      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
