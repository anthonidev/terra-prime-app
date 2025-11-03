'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignParticipants } from '../lib/mutations';
import type { AssignParticipantsInput } from '../types';

export function useAssignParticipants(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, data }: { visitId: string; data: AssignParticipantsInput }) =>
      assignParticipants(visitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      toast.success('Participantes asignados correctamente');
    },
    onError: (error) => {
      toast.error('Error al asignar participantes');
      console.error('Error assigning participants:', error);
    },
  });
}
