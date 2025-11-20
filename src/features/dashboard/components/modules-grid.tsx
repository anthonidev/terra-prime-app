'use client';

import { useMenu } from '@/features/layout/hooks/use-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Folder } from 'lucide-react';
import { ModuleCard } from './module-card';
import type { MenuItem } from '@/features/layout/types/menu.types';

interface NavigableView {
  view: MenuItem;
  parentName?: string;
  colorIndex: number;
}

function getAllNavigableViews(items: MenuItem[]): NavigableView[] {
  const result: NavigableView[] = [];

  items.forEach((parent, index) => {
    if (parent.url && (!parent.children || parent.children.length === 0)) {
      result.push({
        view: parent,
        parentName: undefined, // No tiene padre
        colorIndex: index,
      });
    }

    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        // Solo incluir el hijo si tiene URL
        if (child.url) {
          result.push({
            view: child,
            parentName: parent.name,
            colorIndex: index,
          });
        }
      });
    }
  });

  return result;
}

export function ModulesGrid() {
  const { data, isLoading, isError } = useMenu();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <Skeleton className="mt-auto h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="text-destructive flex items-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Error al cargar los módulos</h3>
              <p className="text-muted-foreground text-sm">
                No se pudieron cargar los módulos disponibles. Por favor, intenta nuevamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allModules = data?.views || [];

  const navigableViews = getAllNavigableViews(allModules);

  if (navigableViews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <Folder className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No hay vistas disponibles</h3>
          <p className="text-muted-foreground mb-1">No tienes vistas asignadas en este momento.</p>
          <p className="text-muted-foreground/80 text-sm">
            Contacta con tu administrador para obtener acceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Acceso Rápido</h2>
          <p className="text-muted-foreground mt-1">
            Navega a las secciones más importantes del sistema.
          </p>
        </div>
        <div className="text-right">
          <div className="text-primary text-3xl font-extrabold">{navigableViews.length}</div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Módulo{navigableViews.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {navigableViews.map(({ view, parentName, colorIndex }, index) => (
          <ModuleCard
            key={view.url} // Use URL as key
            module={view}
            parentName={parentName}
            colorIndex={colorIndex}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
