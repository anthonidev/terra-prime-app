'use client';

import { CheckCircle2, Building2, Layers, Grid3x3, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { ValidatedExcelData } from '../../types';

interface ProjectSummaryProps {
  data: ValidatedExcelData;
}

export function ProjectSummary({ data }: ProjectSummaryProps) {
  // Calculate summary statistics
  const stages = new Set(data.lots.map((lot) => lot.stage)).size;
  const blocks = new Set(data.lots.map((lot) => `${lot.stage}-${lot.block}`)).size;
  const totalLots = data.lots.length;

  // Group lots by status
  const statusCounts = data.lots.reduce(
    (acc, lot) => {
      acc[lot.status] = (acc[lot.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusConfig = {
    ACTIVE: {
      label: 'Activos',
      bgClass: 'bg-success/10',
      borderClass: 'border-success/20',
      textClass: 'text-success',
      dotClass: 'bg-success',
    },
    INACTIVE: {
      label: 'Inactivos',
      bgClass: 'bg-muted',
      borderClass: 'border-muted-foreground/20',
      textClass: 'text-muted-foreground',
      dotClass: 'bg-muted-foreground',
    },
    SOLD: {
      label: 'Vendidos',
      bgClass: 'bg-primary/10',
      borderClass: 'border-primary/20',
      textClass: 'text-primary',
      dotClass: 'bg-primary',
    },
    RESERVED: {
      label: 'Separados',
      bgClass: 'bg-info/10',
      borderClass: 'border-info/20',
      textClass: 'text-info',
      dotClass: 'bg-info',
    },
  };

  return (
    <div className="space-y-4">
      {/* Success Banner */}
      <div className="bg-success/10 border-success/20 flex items-start gap-3 rounded-lg border p-3">
        <div className="bg-success/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <CheckCircle2 className="text-success h-4 w-4" />
        </div>
        <div>
          <h3 className="text-success text-sm font-semibold">¡Archivo validado correctamente!</h3>
          <p className="text-muted-foreground text-xs">
            La estructura es correcta. Resumen de datos a crear:
          </p>
        </div>
      </div>

      {/* Project Information */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">Información General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Nombre del Proyecto
              </p>
              <p className="text-lg font-bold tracking-tight">{data.name}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Moneda Configurada
              </p>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold">
                {data.currency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
              <Layers className="text-primary h-5 w-5" />
            </div>
            <p className="text-2xl font-bold tabular-nums">{stages}</p>
            <p className="text-muted-foreground text-xs font-medium">Etapas</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
              <Grid3x3 className="text-primary h-5 w-5" />
            </div>
            <p className="text-2xl font-bold tabular-nums">{blocks}</p>
            <p className="text-muted-foreground text-xs font-medium">Manzanas</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
              <Package className="text-primary h-5 w-5" />
            </div>
            <p className="text-2xl font-bold tabular-nums">{totalLots}</p>
            <p className="text-muted-foreground text-xs font-medium">Lotes Totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Distribución por Estado</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status as keyof typeof statusConfig] || {
                label: status,
                bgClass: 'bg-muted',
                borderClass: 'border-muted-foreground/20',
                textClass: 'text-muted-foreground',
                dotClass: 'bg-muted-foreground',
              };
              const percentage = ((count / totalLots) * 100).toFixed(1);

              return (
                <div
                  key={status}
                  className={`flex flex-col justify-between rounded-lg border p-3 ${config.bgClass} ${config.borderClass} bg-opacity-30`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${config.textClass}`}>{config.label}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
                  </div>
                  <div className="mt-2">
                    <p className={`text-xl font-bold tabular-nums ${config.textClass}`}>{count}</p>
                    <p className="text-muted-foreground text-[10px]">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
