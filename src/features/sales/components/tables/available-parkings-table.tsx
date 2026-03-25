'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Car } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { AvailableParkingCard } from '../cards/available-parking-card';
import type { AvailableParking } from '../../types';
import type { PaginationMeta } from '@/shared/types/pagination';

interface AvailableParkingsTableProps {
  parkings: AvailableParking[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function AvailableParkingsTable({
  parkings,
  meta,
  onPageChange,
}: AvailableParkingsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const columns: ColumnDef<AvailableParking>[] = [
    {
      accessorKey: 'name',
      header: 'Cochera',
      cell: ({ row }) => <span className="text-xs font-bold">{row.original.name}</span>,
    },
    {
      accessorKey: 'area',
      header: 'Área',
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.area} m²</span>,
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => (
        <span className="text-primary text-xs font-bold">
          {row.original.projectCurrency} {formatPrice(row.original.price)}
        </span>
      ),
    },
  ];

  if (parkings.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
              <Car className="text-muted-foreground h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No se encontraron cocheras</p>
              <p className="text-muted-foreground text-xs">
                No hay cocheras que coincidan con los filtros aplicados
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
          {parkings.map((parking) => (
            <AvailableParkingCard key={parking.id} parking={parking} />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={parkings} />
      )}

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
