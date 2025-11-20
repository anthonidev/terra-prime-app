'use client';

import { Briefcase, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Briefcase className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
            <p className="text-muted-foreground text-sm">Gestiona el equipo de ventas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="text-destructive h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-destructive text-sm font-medium">Error al cargar vendedores</p>
                <p className="text-muted-foreground text-xs">
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
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Briefcase className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
            <p className="text-muted-foreground text-sm">Gestiona el equipo de ventas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No hay vendedores registrados</p>
                <p className="text-muted-foreground text-xs">
                  Aún no se han registrado vendedores en el sistema
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVendors = data.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Briefcase className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
          <p className="text-muted-foreground text-sm">
            {totalVendors} {totalVendors === 1 ? 'vendedor registrado' : 'vendedores registrados'}
          </p>
        </div>
      </div>

      <VendorsTable vendors={data} />
    </div>
  );
}
