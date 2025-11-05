'use client';

import { UserCircle, AlertCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { useVendorLeads } from '../../hooks/use-vendor-leads';
import { VendorLeadsTable } from '../tables/vendor-leads-table';
import { VendorLeadsSkeleton } from '../skeletons/vendor-leads-skeleton';

export function VendorLeadsContainer() {
  const { data, isLoading, isError, error } = useVendorLeads();

  if (isLoading) {
    return <VendorLeadsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Prospectos</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus leads asignados</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Error al cargar prospectos</p>
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

  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis Prospectos</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus leads asignados</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No tienes prospectos asignados</p>
                <p className="text-xs text-muted-foreground">
                  Aún no se te han asignado prospectos. Contacta con tu supervisor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLeads = data.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Prospectos</h1>
          <p className="text-sm text-muted-foreground">
            {totalLeads} {totalLeads === 1 ? 'prospecto asignado' : 'prospectos asignados'}
          </p>
        </div>
      </div>

      <VendorLeadsTable leads={data} />
    </div>
  );
}
