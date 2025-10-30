'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { LotsFilters } from './lots-filters';
import { LotsTable } from './lots-table';
import type { Lot, LotStatus, PaginatedResponse, ProjectDetail } from '../types';
import { Plus } from 'lucide-react';

interface ProjectLotsTabProps {
  project: ProjectDetail;
  lotsData?: PaginatedResponse<Lot>;
  lotsLoading: boolean;
  filters: {
    search: string;
    stageId: string;
    blockId: string;
    status: LotStatus | 'all';
  };
  onStageChange: (stageId: string) => void;
  onBlockChange: (blockId: string) => void;
  onStatusChange: (status: LotStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onPageChange: (page: number) => void;
  onCreateLot: () => void;
  onEditLot: (lot: Lot) => void;
  canCreateLot: boolean;
}

export function ProjectLotsTab({
  project,
  lotsData,
  lotsLoading,
  filters,
  onStageChange,
  onBlockChange,
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
  onPageChange,
  onCreateLot,
  onEditLot,
  canCreateLot,
}: ProjectLotsTabProps) {
  const blocks = project.stages.flatMap((stage) =>
    stage.blocks.map((block) => ({ ...block, stageName: stage.name }))
  );

  return (
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lotes</h2>
        <Button
          size="sm"
          onClick={onCreateLot}
          disabled={!canCreateLot}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo lote
        </Button>
      </div>

      <div className="mb-6">
        <LotsFilters
          stages={project.stages}
          blocks={blocks}
          selectedStageId={filters.stageId}
          selectedBlockId={filters.blockId}
          status={filters.status}
          search={filters.search}
          onStageChange={onStageChange}
          onBlockChange={onBlockChange}
          onStatusChange={onStatusChange}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />
      </div>

      {lotsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : lotsData && lotsData.items.length > 0 ? (
        <LotsTable lots={lotsData.items} meta={lotsData.meta} onEdit={onEditLot} onPageChange={onPageChange} />
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {project.stages.some((stage) => stage.blocks.length > 0)
            ? 'No hay lotes que coincidan con los filtros'
            : 'Primero debes crear etapas y manzanas'}
        </p>
      )}
    </div>
  );
}
