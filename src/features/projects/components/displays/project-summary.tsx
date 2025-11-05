'use client';

import { CheckCircle2, Building2, Package, Grid3X3, TrendingUp } from 'lucide-react';

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
      color: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-900',
      dotColor: 'bg-green-500'
    },
    INACTIVE: {
      label: 'Inactivos',
      color: 'bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-900',
      dotColor: 'bg-gray-500'
    },
    SOLD: {
      label: 'Vendidos',
      color: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-900',
      dotColor: 'bg-blue-500'
    },
    RESERVED: {
      label: 'Separados',
      color: 'bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-900',
      dotColor: 'bg-orange-500'
    },
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-green-900 dark:from-green-950 dark:to-emerald-950">
        <div className="relative flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              ¡Archivo validado correctamente!
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Los datos son válidos y están listos para crear el proyecto. Revisa el resumen a continuación.
            </p>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Información del Proyecto</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nombre del Proyecto
              </p>
              <p className="text-2xl font-bold">{data.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Moneda
              </p>
              <div>
                <Badge
                  variant="outline"
                  className="h-8 px-3 text-lg font-semibold"
                >
                  {data.currency}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Etapas</p>
                <p className="mt-2 text-3xl font-bold">{stages}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Manzanas</p>
                <p className="mt-2 text-3xl font-bold">{blocks}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 dark:bg-purple-500/20">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Lotes</p>
                <p className="mt-2 text-3xl font-bold">{totalLots}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-500/20">
                <Grid3X3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Distribución de Lotes por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status as keyof typeof statusConfig] || {
                label: status,
                color: 'bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-900',
                dotColor: 'bg-gray-500'
              };
              const percentage = ((count / totalLots) * 100).toFixed(1);

              return (
                <div
                  key={status}
                  className={`flex items-center justify-between rounded-lg border p-4 ${config.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${config.dotColor}`} />
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs opacity-75">{percentage}% del total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs opacity-75">lotes</p>
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
