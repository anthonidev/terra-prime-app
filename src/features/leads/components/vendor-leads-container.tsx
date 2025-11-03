'use client';

import { useVendorLeads } from '../hooks/use-vendor-leads';
import { VendorLeadsTable } from './vendor-leads-table';
import { VendorLeadsSkeleton } from './vendor-leads-skeleton';

export function VendorLeadsContainer() {
  const { data, isLoading, isError, error } = useVendorLeads();

  if (isLoading) {
    return <VendorLeadsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Error al cargar tus prospectos
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No tienes prospectos asignados</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Aún no se te han asignado prospectos. Contacta con tu supervisor.
          </p>
        </div>
      </div>
    );
  }

  return <VendorLeadsTable leads={data} />;
}
