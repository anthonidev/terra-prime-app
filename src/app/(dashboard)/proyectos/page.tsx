"use client";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowUpDown,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import EmptyProjectsState from "@/components/project/list/EmptyProjectsState";
import ProjectCard from "@/components/project/list/ProjectCard";
import ProjectsSkeleton from "@/components/project/list/ProjectsSkeleton";
import { useProjects } from "@/hooks/project/useProjects";
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
    formatDate,
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
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-6 mb-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">
            No se pudieron cargar los proyectos
          </h3>
          <p className="text-destructive/80 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => fetchProjects()}
            className="gap-2"
          >
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
        <p className="text-muted-foreground">
          Gestiona todos los proyectos inmobiliarios
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
              className="whitespace-nowrap"
            >
              Activos
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("inactive")}
              className="whitespace-nowrap"
            >
              Inactivos
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="gap-1"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === "desc" ? "Más recientes" : "Más antiguos"}
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
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="text-sm px-3 py-1">
          {filteredProjects.length} de {totalProjects}{" "}
          {totalProjects === 1 ? "proyecto" : "proyectos"}
        </Badge>
      </div>
      <Separator className="mb-6" />
      {filteredProjects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
