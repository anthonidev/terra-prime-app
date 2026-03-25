'use client';

import { Edit } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { Parking, ParkingStatus } from '../../types';
import type { PaginationMeta } from '@/shared/types/pagination';
import { ParkingCard } from '../cards/parking-card';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface ParkingsTableProps {
  parkings: Parking[];
  meta: PaginationMeta;
  currency: 'PEN' | 'USD';
  onEdit: (parking: Parking) => void;
  onPageChange: (page: number) => void;
}

const statusVariants: Record<ParkingStatus, 'default' | 'secondary' | 'outline'> = {
  Activo: 'default',
  Separado: 'secondary',
  Vendido: 'outline',
  Inactivo: 'outline',
};

export function ParkingsTable({
  parkings,
  meta,
  currency,
  onEdit,
  onPageChange,
}: ParkingsTableProps) {
  const columns: ColumnDef<Parking>[] = [
    {
      accessorKey: 'name',
      header: 'Cochera',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'area',
      header: 'Área (m²)',
      cell: ({ row }) => (
        <span className="font-mono">{parseFloat(row.original.area).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => (
        <span className="text-primary font-mono text-sm font-semibold">
          {formatCurrency(parseFloat(row.original.price), currency)}
        </span>
      ),
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
      cell: ({ row }) =>
        row.original.status === 'Activo' ? (
          <Button size="sm" variant="ghost" onClick={() => onEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : null,
    },
  ];

  if (parkings.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 shadow-sm">
        <p className="text-muted-foreground text-center">No se encontraron cocheras</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop: Tabla */}
      <div className="bg-card hidden rounded-lg border shadow-sm md:block">
        <DataTable columns={columns} data={parkings} />
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-4 md:hidden">
        {parkings.map((parking) => (
          <ParkingCard key={parking.id} parking={parking} currency={currency} onEdit={onEdit} />
        ))}
      </div>

      {/* Pagination */}
      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
