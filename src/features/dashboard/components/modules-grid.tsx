"use client";

import { useMenu } from "@/features/layout/hooks/use-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Folder } from "lucide-react";
import { ModuleCard } from "./module-card";
import type { MenuItem } from "@/features/layout/types/menu.types";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardContent className="p-6">
              <div className="mb-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
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
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Error al cargar los módulos</h3>
              <p className="text-sm text-muted-foreground">
                No se pudieron cargar los módulos disponibles. Por favor, intenta nuevamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allModules = data?.views || [];

  // Obtener todas las vistas navegables aplanadas
  const navigableViews = getAllNavigableViews(allModules);

  if (navigableViews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Folder className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No hay vistas disponibles</h3>
          <p className="mb-1 text-muted-foreground">
            No tienes vistas asignadas en este momento.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Contacta con tu administrador para obtener acceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Vistas disponibles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona una vista para acceder
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{navigableViews.length}</div>
          <p className="text-xs text-muted-foreground">
            vista{navigableViews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {navigableViews.map(({ view, parentName, colorIndex }, index) => (
          <ModuleCard
            key={view.id}
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
