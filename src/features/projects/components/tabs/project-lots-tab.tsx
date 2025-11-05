'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Grid3x3, Package, Plus } from 'lucide-react';

import { LotsFilters } from '../filters/lots-filters';
import { LotsTable } from '../tables/lots-table';
import type { Lot, LotStatus, PaginatedResponse, ProjectDetail } from '../../types';

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

  const hasStagesAndBlocks = project.stages.some((stage) => stage.blocks.length > 0);
  const totalLots = lotsData?.meta.totalItems || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Lotes del Proyecto</h2>
            <p className="text-sm text-muted-foreground">
              {totalLots} {totalLots === 1 ? 'lote' : 'lotes'} {totalLots === 1 ? 'registrado' : 'registrados'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onCreateLot}
          disabled={!canCreateLot}
          title={!canCreateLot ? 'Debes crear etapas y manzanas primero' : ''}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo lote
        </Button>
      </div>

      {/* Filtros */}
      {hasStagesAndBlocks && (
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
      )}

      {/* Contenido */}
      {lotsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : lotsData && lotsData.items.length > 0 ? (
        <LotsTable
          lots={lotsData.items}
          meta={lotsData.meta}
          onEdit={onEditLot}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed bg-muted/20">
          {hasStagesAndBlocks ? (
            <>
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No se encontraron lotes</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                No hay lotes que coincidan con los filtros seleccionados. Intenta cambiar los filtros o crea un nuevo lote.
              </p>
              <Button onClick={onCreateLot} disabled={!canCreateLot}>
                <Plus className="mr-2 h-4 w-4" />
                Crear nuevo lote
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Grid3x3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Crea etapas y manzanas primero</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Para poder crear lotes, primero debes crear al menos una etapa y una manzana en el proyecto.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
