'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDayLeads } from '../hooks/use-day-leads';
import { LeadsAssignmentTable } from './leads-assignment-table';
import { Skeleton } from '@/components/ui/skeleton';

export function LeadsAssignmentContainer() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isError, error } = useDayLeads(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Error al cargar los leads
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No hay leads del día</h3>
          <p className="text-sm text-muted-foreground mt-2">
            No se encontraron leads para asignar en el día de hoy.
          </p>
        </div>
      </div>
    );
  }

  const { items, meta } = data;
  const canGoPrevious = page > 1;
  const canGoNext = page < meta.totalPages;

  return (
    <div className="space-y-4">
      <LeadsAssignmentTable leads={items} />

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * limit + 1} a{' '}
            {Math.min(page * limit, meta.totalItems)} de {meta.totalItems} leads
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm">
              Página {page} de {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
