'use client';

import { Edit } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { Lot, LotStatus } from '../types';
import type { PaginationMeta } from '@/shared/types/pagination';
import { LotCard } from './lot-card';

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

const statusLabels: Record<LotStatus, string> = {
  Activo: 'Activo',
  Separado: 'Separado',
  Vendido: 'Vendido',
  Inactivo: 'Inactivo',
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
        return (
          <span className="font-mono">
            {row.original.currency}{' '}
            {lotPrice.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'urbanizationPrice',
      header: 'Urbanización',
      cell: ({ row }) => {
        const urbanizationPrice = parseFloat(row.original.urbanizationPrice);
        return (
          <span className="font-mono">
            {row.original.currency}{' '}
            {urbanizationPrice.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
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
        return (
          <span className="font-mono font-semibold text-primary">
            {row.original.currency}{' '}
            {total.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={statusVariants[row.original.status]}>
          {statusLabels[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (lots.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <p className="text-center text-muted-foreground">
          No se encontraron lotes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop: Tabla */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={lots} />
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-4 md:hidden">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} onEdit={onEdit} />
        ))}
      </div>

      {/* Pagination */}
      <DataTablePagination
        meta={meta}
        onPageChange={onPageChange}
      />
    </div>
  );
}
