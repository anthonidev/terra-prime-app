'use client';

import { Plus } from 'lucide-react';

import { PageHeader } from '@/shared/components/common/page-header';
import { Button } from '@/components/ui/button';

import { useParticipantsContainer } from '../hooks/use-participants-container';
import { ParticipantsFilters } from './participants-filters';
import { ParticipantsTable } from './participants-table';
import { ParticipantFormDialog } from './participant-form-dialog';
import { ParticipantsSkeleton } from './participants-skeleton';

export function ParticipantsContainer() {
  const {
    filters,
    data,
    isLoading,
    isError,
    isDialogOpen,
    selectedParticipant,
    handleFiltersChange,
    handlePageChange,
    handleCreateParticipant,
    handleEditParticipant,
    handleDialogChange,
  } = useParticipantsContainer();

  if (isLoading) {
    return <ParticipantsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los participantes</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de participantes"
        description="Administra los participantes involucrados en el proceso de ventas"
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total de participantes: {data.meta.totalItems}
        </p>
        <Button onClick={handleCreateParticipant}>
          <Plus className="mr-2 h-4 w-4" />
          Crear participante
        </Button>
      </div>

      {/* Filters */}
      <ParticipantsFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Table */}
      <ParticipantsTable
        participants={data.items}
        meta={data.meta}
        onPageChange={handlePageChange}
        onEditParticipant={handleEditParticipant}
      />

      {/* Create/Edit Dialog */}
      <ParticipantFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        participant={selectedParticipant}
      />
    </div>
  );
}
