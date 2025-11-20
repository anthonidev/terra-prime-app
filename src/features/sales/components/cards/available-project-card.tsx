'use client';

import { Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Project } from '../../types';

interface AvailableProjectCardProps {
  project: Project;
}

export function AvailableProjectCard({ project }: AvailableProjectCardProps) {
  const initials = project.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/proyectos/lotes-disponibles/${project.id}`} className="block h-full">
      <Card className="group h-full cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Logo/Avatar */}
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Moneda */}
            <Badge variant="outline" className="font-mono text-xs">
              {project.currency}
            </Badge>
          </div>

          {/* Nombre del proyecto */}
          <div className="pt-2">
            <h3 className="group-hover:text-primary line-clamp-1 text-base font-bold transition-colors">
              {project.name}
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">Código: {project.projectCode}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="text-muted-foreground group-hover:text-primary flex items-center justify-center gap-2 text-sm transition-colors">
            <Building2 className="h-3.5 w-3.5" />
            <span>Ver lotes disponibles</span>
            <ChevronRight className="ml-auto h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
