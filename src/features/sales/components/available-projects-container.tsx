'use client';

import { PageHeader } from '@/shared/components/common/page-header';
import { useActiveProjects } from '../hooks/use-active-projects';
import { AvailableProjectCard } from './available-project-card';

export function AvailableProjectsContainer() {
  const { data: projects, isLoading } = useActiveProjects();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lotes Disponibles"
          description="Selecciona un proyecto para ver los lotes disponibles"
        />
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <p className="text-center text-muted-foreground">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lotes Disponibles"
          description="Selecciona un proyecto para ver los lotes disponibles"
        />
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <p className="text-center text-muted-foreground">
            No hay proyectos activos disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lotes Disponibles"
        description="Selecciona un proyecto para ver los lotes disponibles"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <AvailableProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
