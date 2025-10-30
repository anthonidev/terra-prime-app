'use client';

import Link from 'next/link';
import { Building2, Layers, Grid3x3, Package, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { ProjectSummary } from '../types';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const initials = project.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activePercentage =
    project.lotCount > 0
      ? Math.round((project.activeLotCount / project.lotCount) * 100)
      : 0;

  return (
    <Link href={`/proyectos/detalle/${project.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Logo/Avatar */}
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Estado y Moneda */}
            <div className="flex flex-col gap-2 items-end">
              <Badge variant={project.isActive ? 'default' : 'secondary'}>
                {project.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
              <Badge variant="outline" className="font-mono">
                {project.currency}
              </Badge>
            </div>
          </div>

          {/* Nombre del proyecto */}
          <div className="pt-3">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Etapas</p>
                <p className="font-semibold">{project.stageCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Grid3x3 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Manzanas</p>
                <p className="font-semibold">{project.blockCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Lotes</p>
                <p className="font-semibold">{project.lotCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Activos</p>
                <p className="font-semibold text-green-600">
                  {project.activeLotCount}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Disponibilidad</span>
              <span className="font-medium">{activePercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
