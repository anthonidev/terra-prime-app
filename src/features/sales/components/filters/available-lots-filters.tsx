'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useProjectStages } from '../../hooks/use-project-stages';
import { useStageBlocks } from '../../hooks/use-stage-blocks';

interface AvailableLotsFiltersProps {
  projectId: string;
  term: string;
  stageId: string;
  blockId: string;
  order: 'ASC' | 'DESC';
  onTermChange: (term: string) => void;
  onStageIdChange: (stageId: string) => void;
  onBlockIdChange: (blockId: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function AvailableLotsFilters({
  projectId,
  term,
  stageId,
  blockId,
  order,
  onTermChange,
  onStageIdChange,
  onBlockIdChange,
  onOrderChange,
  onSearchSubmit,
}: AvailableLotsFiltersProps) {
  const { data: stages, isLoading: isLoadingStages } = useProjectStages(projectId);
  const { data: blocks, isLoading: isLoadingBlocks } = useStageBlocks(stageId);

  // Reset block when stage changes
  useEffect(() => {
    if (stageId && blockId) {
      const blockExists = blocks?.some((block) => block.id === blockId);
      if (!blockExists) {
        onBlockIdChange('all');
      }
    }
  }, [stageId, blocks, blockId, onBlockIdChange]);

  return (
    <div className="space-y-3">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar lote por nombre..."
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button type="submit" size="sm">
          <Search className="mr-2 h-3.5 w-3.5" />
          Buscar
        </Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-2 sm:grid-cols-3">
        {/* Stage Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Etapa</label>
          <Select value={stageId} onValueChange={onStageIdChange} disabled={isLoadingStages}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todas las etapas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etapas</SelectItem>
              {stages?.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Block Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Manzana</label>
          <Select
            value={blockId}
            onValueChange={onBlockIdChange}
            disabled={!stageId || stageId === 'all' || isLoadingBlocks}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todas las manzanas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las manzanas</SelectItem>
              {blocks?.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Orden</label>
          <Select value={order} onValueChange={(value) => onOrderChange(value as 'ASC' | 'DESC')}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Ascendente</SelectItem>
              <SelectItem value="DESC">Descendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
