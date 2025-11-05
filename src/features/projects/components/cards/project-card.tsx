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
      <Card className="group h-full transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {/* Logo/Avatar más compacto */}
            <Avatar className="h-12 w-12 rounded-lg ring-1 ring-border group-hover:ring-primary/50 transition-all duration-300">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="rounded-lg  from-primary/20 to-primary/5 text-primary text-base font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Estado y Moneda */}
            <div className="flex flex-col gap-1.5 items-end">
              <Badge
                variant={project.isActive ? 'default' : 'secondary'}
                className="text-xs transition-all duration-300 group-hover:scale-105"
              >
                {project.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-xs transition-all duration-300 group-hover:border-primary/50"
              >
                {project.currency}
              </Badge>
            </div>
          </div>

          {/* Nombre del proyecto */}
          <div className="pt-2">
            <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {project.name}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Estadísticas principales más compactas */}
          <div className="grid grid-cols-2 gap-2">
            {/* Etapas */}
            <div className="group/stat flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
              <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center group-hover/stat:bg-accent/30 transition-colors duration-300">
                <Layers className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Etapas</p>
                <p className="text-base font-bold tabular-nums">{project.stageCount}</p>
              </div>
            </div>

            {/* Manzanas */}
            <div className="group/stat flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center group-hover/stat:bg-primary/30 transition-colors duration-300">
                <Grid3x3 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Manzanas</p>
                <p className="text-base font-bold tabular-nums">{project.blockCount}</p>
              </div>
            </div>

            {/* Lotes */}
            <div className="group/stat flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
              <div className=" w-8 h-8 rounded bg-info/20 flex items-center justify-center group-hover/stat:bg-info/30 transition-colors duration-300">
                <Package className="h-4 w-4 text-info" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Lotes</p>
                <p className="text-base font-bold tabular-nums">{project.lotCount}</p>
              </div>
            </div>

            {/* Disponibles */}
            <div className="group/stat flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-300">
              <div className=" w-8 h-8 rounded bg-success/20 flex items-center justify-center group-hover/stat:bg-success/30 transition-colors duration-300">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Disponibles</p>
                <p className="text-base font-bold text-success tabular-nums">
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
