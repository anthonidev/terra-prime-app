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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Etapas del Proyecto</h2>
            <p className="text-sm text-muted-foreground">
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
        <div className="flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay etapas creadas</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
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
