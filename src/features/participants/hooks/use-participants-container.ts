import { useCallback, useState } from 'react';

import { useParticipants } from './use-participants';
import type { Participant, ParticipantsQueryParams } from '../types';

const DEFAULT_FILTERS: ParticipantsQueryParams = {
  page: 1,
  limit: 20,
};

export function useParticipantsContainer() {
  const [filters, setFilters] = useState<ParticipantsQueryParams>(DEFAULT_FILTERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const { data, isLoading, isError } = useParticipants(filters);

  const handleFiltersChange = useCallback((newFilters: ParticipantsQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateParticipant = useCallback(() => {
    setSelectedParticipant(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditParticipant = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDialogOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedParticipant(null);
    }
  }, []);

  return {
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
  };
}
