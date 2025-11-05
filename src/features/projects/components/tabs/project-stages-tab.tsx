'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Block, ProjectDetail, Stage } from '../../types';

import { Edit, Plus } from 'lucide-react';

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
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Etapas</h2>
        <Button size="sm" onClick={onCreateStage}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva etapa
        </Button>
      </div>

      {project.stages.length > 0 ? (
        <div className="space-y-4">
          {project.stages.map((stage) => (
            <div key={stage.id} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{stage.name}</h3>
                  <Badge variant={stage.isActive ? 'default' : 'secondary'} className="text-xs">
                    {stage.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateBlock(stage)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Añadir manzana
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditStage(stage)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {stage.blocks.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {stage.blocks.map((block) => (
                    <div key={block.id} className="rounded-md border bg-muted/50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Manzana {block.name}</h4>
                        <Badge variant={block.isActive ? 'default' : 'secondary'} className="text-xs">
                          {block.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Total lotes: {block.lotCount}</p>
                        <p className="text-green-600">Activos: {block.activeLots}</p>
                        <p className="text-blue-600">Separados: {block.reservedLots}</p>
                        <p className="text-orange-600">Vendidos: {block.soldLots}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => onEditBlock(stage, block)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Editar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay manzanas en esta etapa
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No hay etapas creadas</p>
      )}
    </div>
  );
}
