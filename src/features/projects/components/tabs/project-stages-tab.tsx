'use client';

import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import type { Block, ProjectDetail, Stage } from '../../types';
import { StageCard } from '../cards/stage-card';

interface ProjectStagesTabProps {
  project: ProjectDetail;
  onCreateStage: () => void;
  onEditStage: (stage: Stage) => void;
  onCreateBlock: (stage: Stage) => void;
  onEditBlock: (stage: Stage, block: Block) => void;
}

export function ProjectStagesTab({
  project,
  onCreateStage,
  onEditStage,
  onCreateBlock,
  onEditBlock,
}: ProjectStagesTabProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Layers className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Etapas del Proyecto</h2>
            <p className="text-muted-foreground text-sm">
              {project.stages.length} {project.stages.length === 1 ? 'etapa' : 'etapas'} registradas
            </p>
          </div>
        </div>
        <Button size="sm" onClick={onCreateStage}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva etapa
        </Button>
      </div>

      {/* Contenido */}
      {project.stages.length > 0 ? (
        <div className="space-y-4">
          {project.stages.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              onEdit={() => onEditStage(stage)}
              onCreateBlock={() => onCreateBlock(stage)}
              onEditBlock={(block) => onEditBlock(stage, block)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
          <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Layers className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No hay etapas creadas</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-center text-sm">
            Comienza creando la primera etapa de tu proyecto para organizar las manzanas y lotes
          </p>
          <Button onClick={onCreateStage}>
            <Plus className="mr-2 h-4 w-4" />
            Crear primera etapa
          </Button>
        </div>
      )}
    </div>
  );
}
