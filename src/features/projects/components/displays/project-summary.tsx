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
  const statusCounts = data.lots.reduce((acc, lot) => {
    acc[lot.status] = (acc[lot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusConfig = {
    ACTIVE: {
      label: 'Activos',
      bgClass: 'bg-success/10',
      borderClass: 'border-success/20',
      textClass: 'text-success',
      dotClass: 'bg-success'
    },
    INACTIVE: {
      label: 'Inactivos',
      bgClass: 'bg-muted',
      borderClass: 'border-muted-foreground/20',
      textClass: 'text-muted-foreground',
      dotClass: 'bg-muted-foreground'
    },
    SOLD: {
      label: 'Vendidos',
      bgClass: 'bg-primary/10',
      borderClass: 'border-primary/20',
      textClass: 'text-primary',
      dotClass: 'bg-primary'
    },
    RESERVED: {
      label: 'Separados',
      bgClass: 'bg-info/10',
      borderClass: 'border-info/20',
      textClass: 'text-info',
      dotClass: 'bg-info'
    },
  };

  return (
    <div className="space-y-4">
      {/* Success Banner */}
      <Card className="border-success/50 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-success mb-1">
                ¡Archivo validado correctamente!
              </h3>
              <p className="text-sm text-muted-foreground">
                Los datos son válidos y están listos para crear el proyecto. Revisa el resumen a continuación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Información del Proyecto</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Nombre del Proyecto
              </p>
              <p className="text-xl font-bold">{data.name}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Moneda
              </p>
              <Badge variant="outline" className="h-7 px-3 text-base font-mono font-bold">
                {data.currency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-md hover:border-accent/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Etapas</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{stages}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Layers className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Manzanas</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{blocks}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Grid3x3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-success/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Lotes</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{totalLots}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Distribución de Lotes por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status as keyof typeof statusConfig] || {
                label: status,
                bgClass: 'bg-muted',
                borderClass: 'border-muted-foreground/20',
                textClass: 'text-muted-foreground',
                dotClass: 'bg-muted-foreground'
              };
              const percentage = ((count / totalLots) * 100).toFixed(1);

              return (
                <div
                  key={status}
                  className={`flex items-center justify-between rounded-lg border p-3 ${config.bgClass} ${config.borderClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
                    <div>
                      <p className={`text-sm font-semibold ${config.textClass}`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentage}% del total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold tabular-nums ${config.textClass}`}>
                      {count}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      lotes
                    </p>
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
