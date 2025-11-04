'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateParticipant } from '../lib/mutations';
import { toast } from 'sonner';
import type { UpdateParticipantInput } from '../types';

export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParticipantInput }) =>
      updateParticipant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participante actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el participante');
      console.error('Error updating participant:', error);
    },
  });
}
