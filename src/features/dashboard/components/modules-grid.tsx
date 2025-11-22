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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-muted/20 h-[200px] overflow-hidden border-none">
            <CardContent className="p-6">
              <div className="mb-6 flex justify-between">
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-6 w-6" />
          </div>
          <h3 className="text-destructive text-lg font-semibold">Error al cargar los módulos</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            No se pudieron cargar los módulos disponibles. Por favor, intenta nuevamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const allModules = data?.views || [];
  const navigableViews = getAllNavigableViews(allModules);

  if (navigableViews.length === 0) {
    return (
      <Card className="bg-muted/10 border-dashed">
        <CardContent className="py-16 text-center">
          <div className="bg-muted/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Folder className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-medium">No hay vistas disponibles</h3>
          <p className="text-muted-foreground mx-auto mb-4 max-w-md">
            No tienes vistas asignadas en este momento.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Contacta con tu administrador para obtener acceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {navigableViews.map(({ view, parentName }, index) => (
          <ModuleCard key={view.url} module={view} parentName={parentName} index={index} />
        ))}
      </div>
    </div>
  );
}
