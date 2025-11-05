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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
            <p className="text-sm text-muted-foreground">Gestiona el equipo de ventas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Error al cargar vendedores</p>
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
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
            <p className="text-sm text-muted-foreground">Gestiona el equipo de ventas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No hay vendedores registrados</p>
                <p className="text-xs text-muted-foreground">
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
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendedores</h1>
          <p className="text-sm text-muted-foreground">
            {totalVendors} {totalVendors === 1 ? 'vendedor registrado' : 'vendedores registrados'}
          </p>
        </div>
      </div>

      <VendorsTable vendors={data} />
    </div>
  );
}
