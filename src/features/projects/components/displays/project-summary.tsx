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
      <Card className="border-success/50 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-success/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <CheckCircle2 className="text-success h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-success mb-1 font-semibold">¡Archivo validado correctamente!</h3>
              <p className="text-muted-foreground text-sm">
                Los datos son válidos y están listos para crear el proyecto. Revisa el resumen a
                continuación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded">
              <Building2 className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">Información del Proyecto</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Nombre del Proyecto
              </p>
              <p className="text-xl font-bold">{data.name}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Moneda
              </p>
              <Badge variant="outline" className="h-7 px-3 font-mono text-base font-bold">
                {data.currency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="hover:border-accent/50 transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Etapas</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{stages}</p>
              </div>
              <div className="bg-accent/20 flex h-10 w-10 items-center justify-center rounded-lg">
                <Layers className="text-accent h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Manzanas</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{blocks}</p>
              </div>
              <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
                <Grid3x3 className="text-primary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-success/50 transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Lotes</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{totalLots}</p>
              </div>
              <div className="bg-success/20 flex h-10 w-10 items-center justify-center rounded-lg">
                <Package className="text-success h-5 w-5" />
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
                dotClass: 'bg-muted-foreground',
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
                      <p className={`text-sm font-semibold ${config.textClass}`}>{config.label}</p>
                      <p className="text-muted-foreground text-xs">{percentage}% del total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold tabular-nums ${config.textClass}`}>{count}</p>
                    <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
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
