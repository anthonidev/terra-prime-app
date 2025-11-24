'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Grid3x3, Layers, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { ProjectSummary } from '../../types';

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

  return (
    <Link href={`/proyectos/detalle/${project.id}`}>
      <Card className="group h-full cursor-pointer overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            {/* Logo/Avatar más compacto */}
            <Avatar className="h-10 w-10 rounded-lg border">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="bg-primary/5 text-primary rounded-lg text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Estado y Moneda */}
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={project.isActive ? 'default' : 'secondary'}
                className="h-5 px-1.5 text-[10px] font-medium"
              >
                {project.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
              <Badge variant="outline" className="h-5 px-1.5 font-mono text-[10px] font-medium">
                {project.currency}
              </Badge>
            </div>
          </div>

          {/* Nombre del proyecto */}
          <div className="pt-3">
            <h3 className="group-hover:text-primary line-clamp-1 text-base font-bold tracking-tight transition-colors">
              {project.name}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4">
          {/* Estadísticas principales más compactas */}
          <div className="grid grid-cols-2 gap-2">
            {/* Etapas */}
            <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
              <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded">
                <Layers className="text-primary h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[9px] font-medium tracking-wide uppercase">
                  Etapas
                </p>
                <p className="text-sm font-bold tabular-nums">{project.stageCount}</p>
              </div>
            </div>

            {/* Manzanas */}
            <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
              <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded">
                <Grid3x3 className="text-primary h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[9px] font-medium tracking-wide uppercase">
                  Manzanas
                </p>
                <p className="text-sm font-bold tabular-nums">{project.blockCount}</p>
              </div>
            </div>

            {/* Lotes */}
            <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
              <div className="bg-info/10 flex h-7 w-7 items-center justify-center rounded">
                <Package className="text-info h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[9px] font-medium tracking-wide uppercase">
                  Lotes
                </p>
                <p className="text-sm font-bold tabular-nums">{project.lotCount}</p>
              </div>
            </div>

            {/* Disponibles */}
            <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
              <div className="bg-success/10 flex h-7 w-7 items-center justify-center rounded">
                <TrendingUp className="text-success h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[9px] font-medium tracking-wide uppercase">
                  Disponibles
                </p>
                <p className="text-success text-sm font-bold tabular-nums">
                  {project.activeLotCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
