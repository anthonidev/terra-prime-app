"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/lib/actions/projects/projectActions";
import { ProjectListItemDto } from "@/types/project.types";
import { Building2, Calendar, ChevronRight, Layers, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);
    };
  
    if (loading) {
      return (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Proyectos</h1>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-28 bg-gray-100">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
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
        <div className="container mx-auto py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
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
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              Total: {totalProjects} {totalProjects === 1 ? 'proyecto' : 'proyectos'}
            </Badge>
            <Link href="/proyectos/nuevo">
              <Button size="sm">
                Crear nuevo proyecto
              </Button>
            </Link>
          </div>
        </div>
  
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No hay proyectos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link href={`/proyectos/detalle/${project.id}`} key={project.id} className="group">
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge 
                        variant={project.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {project.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.currency === 'PEN' ? 'Soles (S/)' : 'Dólares ($)'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-3 mb-3">
                      {project.logo ? (
                        <div className="h-12 w-12 flex items-center justify-center p-1 rounded bg-gray-50">
                          <img 
                            src={project.logo} 
                            alt={`Logo de ${project.name}`} 
                            className="max-h-10 max-w-10 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center rounded bg-gray-50">
                          <Building2 className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{project.stageCount} Etapas</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Layers className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{project.blockCount} Manzanas</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm border-t pt-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs text-gray-500 mr-1">Lotes:</span>
                          <span className="font-medium text-gray-700">{project.activeLotCount}</span>
                          <span className="text-xs text-gray-400">/{project.lotCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-sm">
                      Ver detalles
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }