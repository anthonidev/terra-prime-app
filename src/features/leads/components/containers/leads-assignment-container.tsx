'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, UserPlus, Users } from 'lucide-react';
import { useDayLeads } from '../../hooks/use-day-leads';
import { LeadsAssignmentTable } from '../tables/leads-assignment-table';
import { Skeleton } from '@/components/ui/skeleton';

export function LeadsAssignmentContainer() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isError, error } = useDayLeads(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asignación de Leads</h1>
            <p className="text-sm text-muted-foreground">Asigna vendedores a los leads del día</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Error al cargar los leads</p>
                <p className="text-xs text-muted-foreground">
                  {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asignación de Leads</h1>
            <p className="text-sm text-muted-foreground">Asigna vendedores a los leads del día</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No hay leads del día</p>
                <p className="text-xs text-muted-foreground">
                  No se encontraron leads para asignar en el día de hoy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { items, meta } = data;
  const canGoPrevious = page > 1;
  const canGoNext = page < meta.totalPages;
  const totalLeads = meta.totalItems;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserPlus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asignación de Leads</h1>
          <p className="text-sm text-muted-foreground">
            {totalLeads} {totalLeads === 1 ? 'lead del día' : 'leads del día'}
          </p>
        </div>
      </div>

      <LeadsAssignmentTable leads={items} />

      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Mostrando {(page - 1) * limit + 1} a{' '}
            {Math.min(page * limit, meta.totalItems)} de {meta.totalItems}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!canGoPrevious}
              className="h-8"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Anterior
            </Button>
            <div className="text-xs">
              Página {page} de {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
              className="h-8"
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
