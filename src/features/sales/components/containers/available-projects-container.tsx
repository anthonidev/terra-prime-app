'use client';

import { Building2, Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useActiveProjects } from '../../hooks/use-active-projects';
import { AvailableProjectCard } from '../cards/available-project-card';

export function AvailableProjectsContainer() {
  const { data: projects, isLoading } = useActiveProjects();

  const totalProjects = projects?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Building2 className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
            <p className="text-muted-foreground text-sm">
              Selecciona un proyecto para ver los lotes disponibles
            </p>
          </div>
        </div>

        {/* Loading State */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">Cargando proyectos...</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-48 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Building2 className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
            <p className="text-muted-foreground text-sm">
              Selecciona un proyecto para ver los lotes disponibles
            </p>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
                <Building2 className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No hay proyectos disponibles</p>
                <p className="text-muted-foreground text-xs">
                  No hay proyectos activos con lotes disponibles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Building2 className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
          <p className="text-muted-foreground text-sm">
            {totalProjects} {totalProjects === 1 ? 'proyecto disponible' : 'proyectos disponibles'}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <AvailableProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
