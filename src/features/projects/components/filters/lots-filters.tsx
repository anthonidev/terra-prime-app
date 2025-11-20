'use client';

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

import type { Stage, Block, LotStatus } from '../../types';

interface LotsFiltersProps {
  stages: Stage[];
  blocks: Block[];
  selectedStageId: string;
  selectedBlockId: string;
  status: LotStatus | 'all';
  search: string;
  onStageChange: (stageId: string) => void;
  onBlockChange: (blockId: string) => void;
  onStatusChange: (status: LotStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
}

export function LotsFilters({
  stages,
  blocks,
  selectedStageId,
  selectedBlockId,
  status,
  search,
  onStageChange,
  onBlockChange,
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
}: LotsFiltersProps) {
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
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar lote por nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Stage Filter */}
        <Select value={selectedStageId} onValueChange={onStageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las etapas</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Block Filter */}
        <Select value={selectedBlockId} onValueChange={onBlockChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las manzanas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las manzanas</SelectItem>
            {blocks.map((block) => (
              <SelectItem key={block.id} value={block.id}>
                Manzana {block.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as LotStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Separado">Separado</SelectItem>
            <SelectItem value="Vendido">Vendido</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
