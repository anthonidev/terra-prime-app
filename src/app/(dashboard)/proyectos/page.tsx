'use client';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, ArrowUpDown, Plus, RefreshCw, Search } from 'lucide-react';
import EmptyProjectsState from '@/components/project/list/EmptyProjectsState';
import ProjectCard from '@/components/project/list/ProjectCard';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';
import { useProjects } from '@/hooks/project/useProjects';
export default function ProyectoPage() {
  const {
    filteredProjects,
    totalProjects,
    loading,
    error,
    searchTerm,
    statusFilter,
    sortOrder,
    setSearchTerm,
    setStatusFilter,
    toggleSortOrder,
    fetchProjects,
    formatDate
  } = useProjects();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  if (loading) {
    return <ProjectsSkeleton />;
  }
  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
          <AlertTriangle className="text-destructive mb-4 h-12 w-12" />
          <h3 className="text-destructive mb-2 text-lg font-semibold">
            No se pudieron cargar los proyectos
          </h3>
          <p className="text-destructive/80 mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchProjects()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
        <p className="text-muted-foreground">Gestiona todos los proyectos inmobiliarios</p>
      </div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className="whitespace-nowrap"
            >
              Activos
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
              className="whitespace-nowrap"
            >
              Inactivos
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button variant="outline" size="sm" onClick={toggleSortOrder} className="gap-1">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
          </Button>
          <Link href="/proyectos/nuevo">
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>
      </div>
      {}
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="outline" className="px-3 py-1 text-sm">
          {filteredProjects.length} de {totalProjects}{' '}
          {totalProjects === 1 ? 'proyecto' : 'proyectos'}
        </Badge>
      </div>
      <Separator className="mb-6" />
      {filteredProjects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                formatDate={formatDate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
