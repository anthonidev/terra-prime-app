'use client';

import { useVendors } from '../hooks/use-vendors';
import { VendorsTable } from './vendors-table';
import { VendorsSkeleton } from './vendors-skeleton';

export function VendorsContainer() {
  const { data, isLoading, isError, error } = useVendors();

  if (isLoading) {
    return <VendorsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Error al cargar vendedores
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
          <h3 className="text-lg font-semibold">No hay vendedores registrados</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Aún no se han registrado vendedores en el sistema.
          </p>
        </div>
      </div>
    );
  }

  return <VendorsTable vendors={data} />;
}
