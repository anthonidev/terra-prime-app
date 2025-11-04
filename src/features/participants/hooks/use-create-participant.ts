'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createParticipant } from '../lib/mutations';
import { toast } from 'sonner';
import type { CreateParticipantInput } from '../types';

export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParticipantInput) => createParticipant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participante creado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear el participante');
      console.error('Error creating participant:', error);
    },
  });
}
