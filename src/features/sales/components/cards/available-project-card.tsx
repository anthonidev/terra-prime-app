'use client';

import Link from 'next/link';
import { Building2, ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
      <Card className="group h-full transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Logo/Avatar */}
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm font-semibold">
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
            <h3 className="text-base font-bold group-hover:text-primary transition-colors line-clamp-1">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Código: {project.projectCode}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
            <Building2 className="h-3.5 w-3.5" />
            <span>Ver lotes disponibles</span>
            <ChevronRight className="h-3.5 w-3.5 ml-auto" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
