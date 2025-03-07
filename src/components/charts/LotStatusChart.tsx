"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLotStatusCounts } from "@/lib/actions/dashboard/chartActions";
import { getProjects } from "@/lib/actions/projects/projectActions";
import { ProjectListItemDto } from "@/types/project.types";
import { LotStatusCount } from "@/types/dashboard.types";

export function LotStatusChart() {
  const [statusData, setStatusData] = useState<LotStatusCount[]>([]);
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const projectsData = await getProjects();
      setProjects(projectsData.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Obtener los datos de estados de lotes
  const fetchStatusData = async (projectId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLotStatusCounts(projectId);
      
      // Filtrar solo estados con conteo > 0 y añadir colores
      const filteredData = data
        .filter(status => status.count > 0)
        .map(status => ({
          ...status,
          fill: getStatusColor(status.status)
        }));
      
      setStatusData(filteredData);
    } catch (err) {
      console.error("Error fetching lot status counts:", err);
      setError("No se pudieron cargar los datos de estados de lotes");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchProjects();
    fetchStatusData();
  }, []);

  // Actualizar datos cuando cambia el proyecto seleccionado
  useEffect(() => {
    fetchStatusData(selectedProjectId || undefined);
  }, [selectedProjectId]);

  // Asignar colores según el estado
  const getStatusColor = (status: string) => {
    const colorMap: {[key: string]: string} = {
      'Activo': '#22c55e',    // Verde
      'Vendido': '#a855f7',   // Morado
      'Separado': '#3b82f6',  // Azul
      'Inactivo': '#6b7280',  // Gris
    };
    
    return colorMap[status] || '#8b5cf6';
  };

  // Calcular total de lotes
  const totalLots = statusData.reduce((sum, status) => sum + status.count, 0);

  // Configuración del gráfico
  const chartConfig: ChartConfig = {
    count: {
      label: "Lotes",
    },
    Activo: {
      label: "Activo",
      color: "hsl(142, 71%, 45%)",  // Verde
    },
    Vendido: {
      label: "Vendido",
      color: "hsl(270, 91%, 65%)",  // Morado
    },
    Separado: {
      label: "Separado",
      color: "hsl(217, 91%, 60%)",  // Azul
    },
    Inactivo: {
      label: "Inactivo",
      color: "hsl(220, 9%, 46%)",   // Gris
    }
  };

  // Preparar datos para el gráfico
  const chartData = statusData.map(item => ({
    status: item.status,
    count: item.count,
    fill: item.fill
  }));

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value === "all" ? null : value);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Estados de Lotes
          </CardTitle>
          <CardDescription>
            {isLoading 
              ? "Cargando datos..." 
              : error 
                ? "Error al cargar datos" 
                : `${totalLots} lotes en total`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedProjectId || "all"}
            onValueChange={handleProjectChange}
            disabled={isLoadingProjects}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los proyectos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!isLoading && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fetchStatusData(selectedProjectId || undefined)} 
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-0">
        <div className="h-[220px] w-full">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No hay datos disponibles
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto h-full"
            >
              <PieChart 
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <Pie 
                  data={chartData} 
                  dataKey="count" 
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    status,
                    count
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={getStatusColor(status)}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="medium"
                      >
                        {`${status}: ${count}`}
                      </text>
                    );
                  }}
                />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-3 mt-0">
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {chartData.map(item => (
            <div key={item.status} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs">{item.status}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}