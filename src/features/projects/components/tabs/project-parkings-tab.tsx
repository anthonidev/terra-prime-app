'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Car, Plus } from 'lucide-react';

import { ParkingsFilters } from '@/features/parking/components/filters/parkings-filters';
import { ParkingsTable } from '@/features/parking/components/tables/parkings-table';
import type { Parking, ParkingStatus, PaginatedResponse } from '@/features/parking/types';

interface ProjectParkingsTabProps {
  currency: 'PEN' | 'USD';
  parkingsData?: PaginatedResponse<Parking>;
  parkingsLoading: boolean;
  filters: {
    search: string;
    status: ParkingStatus | 'all';
  };
  onStatusChange: (status: ParkingStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onPageChange: (page: number) => void;
  onCreateParking: () => void;
  onEditParking: (parking: Parking) => void;
}

export function ProjectParkingsTab({
  currency,
  parkingsData,
  parkingsLoading,
  filters,
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
  onPageChange,
  onCreateParking,
  onEditParking,
}: ProjectParkingsTabProps) {
  const totalParkings = parkingsData?.meta.totalItems || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Car className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Cocheras del Proyecto</h2>
            <p className="text-muted-foreground text-sm">
              {totalParkings} {totalParkings === 1 ? 'cochera' : 'cocheras'}{' '}
              {totalParkings === 1 ? 'registrada' : 'registradas'}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={onCreateParking}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva cochera
        </Button>
      </div>

      {/* Filtros */}
      <ParkingsFilters
        status={filters.status}
        search={filters.search}
        onStatusChange={onStatusChange}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />

      {/* Contenido */}
      {parkingsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : parkingsData && parkingsData.items.length > 0 ? (
        <ParkingsTable
          parkings={parkingsData.items}
          meta={parkingsData.meta}
          currency={currency}
          onEdit={onEditParking}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
          <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No se encontraron cocheras</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-center text-sm">
            No hay cocheras que coincidan con los filtros seleccionados. Intenta cambiar los filtros
            o crea una nueva cochera.
          </p>
          <Button onClick={onCreateParking}>
            <Plus className="mr-2 h-4 w-4" />
            Crear nueva cochera
          </Button>
        </div>
      )}
    </div>
  );
}
