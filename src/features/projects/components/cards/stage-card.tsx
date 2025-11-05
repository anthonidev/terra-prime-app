'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit, Plus } from 'lucide-react';
import type { Block, Stage } from '../../types';
import { BlockCard } from './block-card';

interface StageCardProps {
  stage: Stage;
  onEdit: () => void;
  onCreateBlock: () => void;
  onEditBlock: (block: Block) => void;
}

export function StageCard({
  stage,
  onEdit,
  onCreateBlock,
  onEditBlock,
}: StageCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          {/* Título y estado */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h3 className="text-lg font-bold tracking-tight truncate">
              {stage.name}
            </h3>
            <Badge
              variant={stage.isActive ? 'default' : 'secondary'}
              className="text-xs shrink-0"
            >
              {stage.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateBlock}
              className="h-8"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Manzana
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {stage.blocks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stage.blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onEdit={() => onEditBlock(block)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              No hay manzanas en esta etapa
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateBlock}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Añadir primera manzana
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
