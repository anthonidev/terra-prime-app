'use client';

import { motion } from 'framer-motion';
import { Building2, Layers, Grid3x3, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface Project {
  id: string;
  name: string;
  currency: string;
}

interface Stage {
  id: string;
  name: string;
}

interface Block {
  id: string;
  name: string;
}

interface LotSelectionFiltersProps {
  // Projects
  projectId: string;
  projects: Project[] | undefined;
  isLoadingProjects: boolean;
  onProjectChange: (value: string) => void;

  // Stages
  stageId: string;
  stages: Stage[] | undefined;
  isLoadingStages: boolean;
  onStageChange: (value: string) => void;

  // Blocks
  blockId: string;
  blocks: Block[] | undefined;
  isLoadingBlocks: boolean;
  onBlockChange: (value: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function LotSelectionFilters({
  projectId,
  projects,
  isLoadingProjects,
  onProjectChange,
  stageId,
  stages,
  isLoadingStages,
  onStageChange,
  blockId,
  blocks,
  isLoadingBlocks,
  onBlockChange,
}: LotSelectionFiltersProps) {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Selección de Proyecto y Lote</CardTitle>
              <CardDescription>
                Filtre por proyecto, etapa y manzana para ver los lotes disponibles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Project Selection */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="project" className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4 text-primary" />
                Proyecto
              </Label>
              {isLoadingProjects ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={projectId} onValueChange={onProjectChange}>
                  <SelectTrigger
                    id="project"
                    className={cn(
                      'transition-all',
                      projectId && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <SelectValue placeholder="Seleccione un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>

            {/* Stage Selection */}
            <motion.div
              variants={itemVariants}
              className={cn('space-y-2', !projectId && 'opacity-50 pointer-events-none')}
            >
              <Label htmlFor="stage" className="flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4 text-primary" />
                Etapa
                {projectId && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </Label>
              {isLoadingStages ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={stageId} onValueChange={onStageChange} disabled={!projectId}>
                  <SelectTrigger
                    id="stage"
                    className={cn(
                      'transition-all',
                      stageId && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <SelectValue placeholder="Seleccione una etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages?.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                          {stage.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>

            {/* Block Selection */}
            <motion.div
              variants={itemVariants}
              className={cn('space-y-2', !stageId && 'opacity-50 pointer-events-none')}
            >
              <Label htmlFor="block" className="flex items-center gap-2 text-sm font-medium">
                <Grid3x3 className="h-4 w-4 text-primary" />
                Manzana
                {stageId && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </Label>
              {isLoadingBlocks ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={blockId} onValueChange={onBlockChange} disabled={!stageId}>
                  <SelectTrigger
                    id="block"
                    className={cn(
                      'transition-all',
                      blockId && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <SelectValue placeholder="Seleccione una manzana" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks?.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        <div className="flex items-center gap-2">
                          <Grid3x3 className="h-3.5 w-3.5 text-muted-foreground" />
                          {block.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
