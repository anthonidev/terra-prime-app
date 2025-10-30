'use client';

import Link from 'next/link';
import { Building2, ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import type { Project } from '../types';

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
    <Card className="group h-full transition-all hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Logo/Avatar */}
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={project.logo || undefined} alt={project.name} />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Moneda */}
          <Badge variant="outline" className="font-mono">
            {project.currency}
          </Badge>
        </div>

        {/* Nombre del proyecto */}
        <div className="pt-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Código: {project.projectCode}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <Link href={`/proyectos/lotes-disponibles/${project.id}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Building2 className="mr-2 h-4 w-4" />
            Ver lotes disponibles
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
