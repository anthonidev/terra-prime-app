'use client';

import { Building2, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useActiveProjects } from '../hooks/use-active-projects';
import { AvailableProjectCard } from './available-project-card';

export function AvailableProjectsContainer() {
  const { data: projects, isLoading } = useActiveProjects();

  const totalProjects = projects?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
            <p className="text-sm text-muted-foreground">
              Selecciona un proyecto para ver los lotes disponibles
            </p>
          </div>
        </div>

        {/* Loading State */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Cargando proyectos...</span>
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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
            <p className="text-sm text-muted-foreground">
              Selecciona un proyecto para ver los lotes disponibles
            </p>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No hay proyectos disponibles</p>
                <p className="text-xs text-muted-foreground">
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
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lotes Disponibles</h1>
          <p className="text-sm text-muted-foreground">
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
