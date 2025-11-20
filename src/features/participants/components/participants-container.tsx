'use client';

import { Plus, Users } from 'lucide-react';

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los participantes</p>
          <p className="text-muted-foreground mt-2 text-sm">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  const totalParticipants = data.meta.totalItems;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Participantes</h1>
            <p className="text-muted-foreground text-sm">
              {totalParticipants}{' '}
              {totalParticipants === 1 ? 'participante registrado' : 'participantes registrados'}
            </p>
          </div>
        </div>
        <Button onClick={handleCreateParticipant} size="sm">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Crear
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
