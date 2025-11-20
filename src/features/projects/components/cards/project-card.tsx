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
      <Card className="group hover:border-primary/50 h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {/* Logo/Avatar más compacto */}
            <Avatar className="ring-border group-hover:ring-primary/50 h-12 w-12 rounded-lg ring-1 transition-all duration-300">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="from-primary/20 to-primary/5 text-primary rounded-lg text-base font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Estado y Moneda */}
            <div className="flex flex-col items-end gap-1.5">
              <Badge
                variant={project.isActive ? 'default' : 'secondary'}
                className="text-xs transition-all duration-300 group-hover:scale-105"
              >
                {project.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
              <Badge
                variant="outline"
                className="group-hover:border-primary/50 font-mono text-xs transition-all duration-300"
              >
                {project.currency}
              </Badge>
            </div>
          </div>

          {/* Nombre del proyecto */}
          <div className="pt-2">
            <h3 className="group-hover:text-primary line-clamp-1 text-lg font-bold tracking-tight transition-colors duration-300">
              {project.name}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Estadísticas principales más compactas */}
          <div className="grid grid-cols-2 gap-2">
            {/* Etapas */}
            <div className="group/stat bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 transition-colors duration-300">
              <div className="bg-accent/20 group-hover/stat:bg-accent/30 flex h-8 w-8 items-center justify-center rounded transition-colors duration-300">
                <Layers className="text-accent h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Etapas
                </p>
                <p className="text-base font-bold tabular-nums">{project.stageCount}</p>
              </div>
            </div>

            {/* Manzanas */}
            <div className="group/stat bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 transition-colors duration-300">
              <div className="bg-primary/20 group-hover/stat:bg-primary/30 flex h-8 w-8 items-center justify-center rounded transition-colors duration-300">
                <Grid3x3 className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Manzanas
                </p>
                <p className="text-base font-bold tabular-nums">{project.blockCount}</p>
              </div>
            </div>

            {/* Lotes */}
            <div className="group/stat bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 transition-colors duration-300">
              <div className="bg-info/20 group-hover/stat:bg-info/30 flex h-8 w-8 items-center justify-center rounded transition-colors duration-300">
                <Package className="text-info h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Lotes
                </p>
                <p className="text-base font-bold tabular-nums">{project.lotCount}</p>
              </div>
            </div>

            {/* Disponibles */}
            <div className="group/stat bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 transition-colors duration-300">
              <div className="bg-success/20 group-hover/stat:bg-success/30 flex h-8 w-8 items-center justify-center rounded transition-colors duration-300">
                <TrendingUp className="text-success h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Disponibles
                </p>
                <p className="text-success text-base font-bold tabular-nums">
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
