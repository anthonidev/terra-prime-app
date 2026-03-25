'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface Project {
  id: string;
  name: string;
  currency: string;
}

interface ParkingSelectionFiltersProps {
  projectId: string;
  projects: Project[] | undefined;
  isLoadingProjects: boolean;
  onProjectChange: (value: string) => void;
}

export function ParkingSelectionFilters({
  projectId,
  projects,
  isLoadingProjects,
  onProjectChange,
}: ParkingSelectionFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Selección de Proyecto</CardTitle>
              <CardDescription>
                Seleccione el proyecto para ver las cocheras disponibles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm space-y-2">
            <Label
              htmlFor="project-parking"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Building2 className="text-primary h-4 w-4" />
              Proyecto
            </Label>
            {isLoadingProjects ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={projectId} onValueChange={onProjectChange}>
                <SelectTrigger
                  id="project-parking"
                  className={cn(
                    'transition-all',
                    projectId && 'border-primary/50 bg-primary/5 focus:ring-primary/30'
                  )}
                >
                  <SelectValue placeholder="Seleccione un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="text-muted-foreground h-3.5 w-3.5" />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
