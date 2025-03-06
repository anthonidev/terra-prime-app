"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getProjects } from "@/lib/actions/projects/projectActions";
import { ProjectListItemDto } from "@/types/project.types";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  ChevronRight,
  Layers,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
export default function ProyectoPage() {
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data.projects);
      setTotalProjects(data.total);
      setError(null);
    } catch (err) {
      setError("Error al cargar los proyectos. Intente nuevamente.");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-2 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 mb-6">
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => fetchProjects()}
          >
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
      <div className="flex justify-between items-center mb-6">
        <Badge variant="outline" className="text-sm px-3 py-1">
          Total: {totalProjects}{" "}
          {totalProjects === 1 ? "proyecto" : "proyectos"}
        </Badge>
        <Link href="/proyectos/nuevo">
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>
      <Separator className="mb-6" />
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">
            No hay proyectos disponibles.
          </p>
          <Link href="/proyectos/nuevo">
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Crear un proyecto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/proyectos/detalle/${project.id}`}
                className="block h-full"
              >
                <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-primary/50 overflow-hidden">
                  {}
                  <div
                    className={`h-2 w-full ${
                      project.isActive ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg line-clamp-1">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant={project.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {project.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.currency === "PEN"
                        ? "Soles (S/)"
                        : "Dólares ($)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      {project.logo ? (
                        <div className="h-12 w-12 flex items-center justify-center p-1 rounded bg-secondary/50">
                          <Image
                            width={40}
                            height={40}
                            src={project.logo}
                            alt={`Logo de ${project.name}`}
                            className="max-h-10 max-w-10 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center rounded bg-secondary/50">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{project.stageCount} Etapas</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Layers className="h-4 w-4 mr-1" />
                          <span>{project.blockCount} Manzanas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-3">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs text-muted-foreground mr-1">
                            Lotes:
                          </span>
                          <span className="font-medium">
                            {project.activeLotCount}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            /{project.lotCount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-sm hover:text-primary"
                    >
                      Ver detalles
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
