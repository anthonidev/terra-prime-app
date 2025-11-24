'use client';

import { Button } from '@/components/ui/button';
import { EmptyContainer } from '@/shared/components/common/empty-container';
import { PageHeader } from '@/shared/components/common/page-header';
import { useProjects } from '../../hooks/use-projects';
import { ProjectCard } from '../cards/project-card';
import { ProjectsSkeleton } from '../skeletons/projects-skeleton';
import { useRouter } from 'next/navigation';
import { Folder, Plus } from 'lucide-react';

export function ProjectsContainer() {
  const { push } = useRouter();
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los proyectos</p>
          <p className="text-muted-foreground mt-2 text-sm">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  const { projects, total } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Proyectos" description={`Total de proyectos: ${total}`} icon={Folder}>
        <Button onClick={() => push('/proyectos/nuevo')}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Proyecto
        </Button>
      </PageHeader>

      {/* Grid de proyectos */}
      {projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyContainer
          title="No hay proyectos aún"
          description="Crea tu primer proyecto para comenzar."
        >
          <Button onClick={() => push('/proyectos/nuevo')}>Crear Proyecto</Button>
        </EmptyContainer>
      )}
    </div>
  );
}
