'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Grid3x3, Layers } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { LotCard } from '../cards/lot-card';
import type { Lot } from '../../types';
import type { PaginationMeta } from '@/shared/types/pagination';

interface AvailableLotsTableProps {
  lots: Lot[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function AvailableLotsTable({
  lots,
  meta,
  onPageChange,
}: AvailableLotsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const columns: ColumnDef<Lot>[] = [
    {
      accessorKey: 'name',
      header: 'Lote',
      cell: ({ row }) => (
        <span className="text-xs font-bold">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'stageName',
      header: 'Etapa',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          <Layers className="mr-1 h-3 w-3" />
          {row.original.stageName}
        </Badge>
      ),
    },
    {
      accessorKey: 'blockName',
      header: 'Manzana',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          <Grid3x3 className="mr-1 h-3 w-3" />
          {row.original.blockName}
        </Badge>
      ),
    },
    {
      accessorKey: 'area',
      header: 'Área',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.area} m²
        </span>
      ),
    },
    {
      accessorKey: 'lotPrice',
      header: 'P. Lote',
      cell: ({ row }) => (
        <span className="text-xs font-medium">
          {row.original.projectCurrency} {formatPrice(row.original.lotPrice)}
        </span>
      ),
    },
    {
      accessorKey: 'urbanizationPrice',
      header: 'P. Urbanización',
      cell: ({ row }) => (
        <span className="text-xs font-medium">
          {row.original.projectCurrency} {formatPrice(row.original.urbanizationPrice)}
        </span>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {row.original.projectCurrency} {formatPrice(row.original.totalPrice)}
        </span>
      ),
    },
  ];

  if (lots.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Grid3x3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No se encontraron lotes</p>
              <p className="text-xs text-muted-foreground">
                No hay lotes que coincidan con los filtros aplicados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="space-y-3">
          {lots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={lots} />
        </Card>
      )}

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
