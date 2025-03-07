"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { TrendingUp, Users, RefreshCw } from "lucide-react";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { RoleCount } from "@/types/dashboard.types";
import { getRoleCounts } from "@/lib/actions/dashboard/chartActions";

export function RoleDistributionChart() {
  const [roleData, setRoleData] = useState<RoleCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRoleCounts();
      // Agregar colores a los datos
      const dataWithColors = data.map(role => ({
        ...role,
        fill: getRoleColor(role.code)
      }));
      setRoleData(dataWithColors);
    } catch (err) {
      console.error("Error fetching role counts:", err);
      setError("No se pudieron cargar los datos de roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  // Función para obtener colores basados en el rol
  const getRoleColor = (code: string) => {
    const colorMap: {[key: string]: string} = {
      'VEN': '#a855f7', // Morado
      'REC': '#3b82f6', // Azul
      'COB': '#22c55e', // Verde
      'GVE': '#f59e0b', // Ámbar
      'FIN': '#ec4899', // Rosa
      'SYS': '#06b6d4', // Cian
      'SCO': '#84cc16', // Lima
      'ADM': '#d946ef'  // Fucsia
    };
    
    return colorMap[code] || '#8b5cf6'; // Morado por defecto
  };

  // Calculamos el total de usuarios
  const totalUsers = roleData.reduce((sum, role) => sum + role.count, 0);
  
  // Ordenamos los datos para el gráfico (de mayor a menor)
  const sortedData = [...roleData].sort((a, b) => b.count - a.count);

  // Configuración del gráfico
  const chartConfig = {
    count: {
      label: "Usuarios",
      color: "hsl(var(--chart-1))",
    }
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Distribución de Roles
          </CardTitle>
          <CardDescription>
            {isLoading 
              ? "Cargando datos..." 
              : error 
                ? "Error al cargar datos" 
                : `${totalUsers} usuarios registrados`}
          </CardDescription>
        </div>
        {!isLoading && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchRoleData} 
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 py-0">
        <div className="h-[300px] w-full">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={sortedData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
                maxBarSize={24}
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                  content={
                    <ChartTooltipContent 
                      formatter={(value) => `${value} usuarios`} 
                    />
                  }
                />
                <Bar 
                  dataKey="count" 
                  radius={4}
                  barSize={22}
                >
                  {sortedData.map((entry) => (
                    <Bar 
                      key={`bar-${entry.code}`} 
                      dataKey="count"
                      fill={entry.fill}
                      name={entry.name}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-3 mt-0">
        <div className="flex gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Mostrando distribución del personal según su rol
        </div>
        <div className="leading-none text-muted-foreground">
          Total de {totalUsers} usuarios en el sistema
        </div>
      </CardFooter>
    </Card>
  );
}