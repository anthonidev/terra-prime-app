'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPin } from '../lib/mutations';
import { toast } from 'sonner';

export function useCreatePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-pin'] });
      toast.success('PIN generado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al generar el PIN');
      console.error('Error creating PIN:', error);
    },
  });
}
