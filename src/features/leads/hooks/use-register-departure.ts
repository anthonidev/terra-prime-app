'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerDeparture } from '../lib/mutations';

export function useRegisterDeparture(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => registerDeparture(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Hora de salida registrada correctamente');
    },
    onError: (error) => {
      toast.error('Error al registrar la hora de salida');
      console.error('Error registering departure:', error);
    },
  });
}
