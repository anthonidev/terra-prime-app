'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit, Layers, Plus } from 'lucide-react';
import type { Block, Stage } from '../../types';
import { BlockCard } from './block-card';

interface StageCardProps {
  stage: Stage;
  onEdit: () => void;
  onCreateBlock: () => void;
  onEditBlock: (block: Block) => void;
}

export function StageCard({ stage, onEdit, onCreateBlock, onEditBlock }: StageCardProps) {
  return (
    <Card className="h-full overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="bg-muted/30 border-b p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Título y estado */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <Layers className="text-primary h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold tracking-tight">{stage.name}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={stage.isActive ? 'default' : 'secondary'}
                  className="h-5 px-1.5 text-[10px] font-medium"
                >
                  {stage.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {stage.blocks.length} {stage.blocks.length === 1 ? 'manzana' : 'manzanas'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCreateBlock}
              className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
              title="Nueva manzana"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
              title="Editar etapa"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {stage.blocks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stage.blocks.map((block) => (
              <BlockCard key={block.id} block={block} onEdit={() => onEditBlock(block)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-muted/50 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Plus className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-muted-foreground mb-3 text-xs">No hay manzanas en esta etapa</p>
            <Button size="sm" variant="outline" onClick={onCreateBlock} className="h-8 text-xs">
              <Plus className="mr-1.5 h-3 w-3" />
              Añadir manzana
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
