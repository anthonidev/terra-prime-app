'use client';

import { Building2, Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/shared/components/common/page-header';

import { useActiveProjects } from '../../hooks/use-active-projects';
import { AvailableProjectCard } from '../cards/available-project-card';

export function AvailableProjectsContainer() {
  const { data: projects, isLoading } = useActiveProjects();

  const totalProjects = projects?.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lotes Disponibles"
          description="Selecciona un proyecto para ver los lotes disponibles"
          icon={Building2}
        />

        {/* Loading State */}
        <Card className="border-none shadow-sm">
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
      <div className="space-y-6">
        <PageHeader
          title="Lotes Disponibles"
          description="Selecciona un proyecto para ver los lotes disponibles"
          icon={Building2}
        />

        {/* Empty State */}
        <Card className="border-none shadow-sm">
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
    <div className="space-y-6">
      <PageHeader
        title="Lotes Disponibles"
        description={`${totalProjects} ${totalProjects === 1 ? 'proyecto disponible' : 'proyectos disponibles'}`}
        icon={Building2}
      />

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <AvailableProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
