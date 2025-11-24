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
      <Card className="group h-full cursor-pointer border-none shadow-sm transition-all hover:scale-[1.01] hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Logo/Avatar */}
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={project.logo || undefined} alt={project.name} />
                <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Nombre del proyecto */}
              <div>
                <h3 className="group-hover:text-primary line-clamp-1 text-sm font-bold tracking-tight transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className="bg-background h-5 px-1.5 font-mono text-[10px] font-medium"
                  >
                    {project.currency}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 mt-2 flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium transition-all">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3" />
              <span>Ver lotes</span>
            </div>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
