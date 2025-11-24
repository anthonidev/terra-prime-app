'use client';

import { useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Buscar lote por nombre..."
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            className="focus-visible:ring-primary/30 h-9 pl-9 text-sm transition-all"
          />
        </div>
        <Button type="submit" size="sm" className="h-9 px-4 shadow-sm">
          <Search className="mr-2 h-3.5 w-3.5" />
          Buscar
        </Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Stage Filter */}
        <div className="space-y-1.5">
          <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <Filter className="h-3.5 w-3.5" />
            Etapa
          </label>
          <Select value={stageId} onValueChange={onStageIdChange} disabled={isLoadingStages}>
            <SelectTrigger className="focus:ring-primary/30 h-9 text-sm transition-all">
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
        <div className="space-y-1.5">
          <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <Filter className="h-3.5 w-3.5" />
            Manzana
          </label>
          <Select
            value={blockId}
            onValueChange={onBlockIdChange}
            disabled={!stageId || stageId === 'all' || isLoadingBlocks}
          >
            <SelectTrigger className="focus:ring-primary/30 h-9 text-sm transition-all">
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
        <div className="space-y-1.5">
          <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Orden
          </label>
          <Select value={order} onValueChange={(value) => onOrderChange(value as 'ASC' | 'DESC')}>
            <SelectTrigger className="focus:ring-primary/30 h-9 text-sm transition-all">
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
