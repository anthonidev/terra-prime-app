'use client';

import { PageHeader } from '@/shared/components/common/page-header';

import { useProjects } from '../../hooks/use-projects';
import { ProjectCard } from '../cards/project-card';
import { ProjectsSkeleton } from '../skeletons/projects-skeleton';

export function ProjectsContainer() {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los proyectos</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  const { projects, total } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Proyectos"
        description="Gestiona los proyectos inmobiliarios y sus lotes"
      />

      {/* Stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total de proyectos: <span className="font-medium text-foreground">{total}</span>
        </p>
      </div>

      {/* Grid de proyectos */}
      {projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px] rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground">No hay proyectos disponibles</p>
            <p className="text-sm text-muted-foreground mt-2">
              Los proyectos aparecerán aquí cuando sean creados
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
