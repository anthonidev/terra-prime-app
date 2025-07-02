import React from 'react';
import { Button } from '@components/ui/button';
import { Plus, Edit } from 'lucide-react';
import { StageDetailDto } from '@infrastructure/types/projects/project.types';

interface StageActionsProps {
  onCreateClick: () => void;
  onEditClick?: (stage: StageDetailDto) => void;
  stage?: StageDetailDto;
  variant?: 'default' | 'minimal';
}

export default function StageActions({
  onCreateClick,
  onEditClick,
  stage,
  variant = 'default'
}: StageActionsProps) {
  if (variant === 'minimal' && stage && onEditClick) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEditClick(stage)}
        title="Editar etapa"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onCreateClick}>
      <Plus className="h-4 w-4" />
      <span>Nueva Etapa</span>
    </Button>
  );
}
