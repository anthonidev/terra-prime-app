'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { registerLead, findLeadByDocument } from '../lib/mutations';

export function useRegisterLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerLead,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'Lead registrado correctamente');
        // Invalidar caché de leads para refrescar la lista
        queryClient.invalidateQueries({ queryKey: ['leads'] });
      } else {
        toast.error(response.message || 'Error al registrar lead');
      }
    },
    onError: (error: Error) => {
      console.error('Error registering lead:', error);
      let message = 'Error al registrar lead';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
    },
  });
}

export function useFindLeadByDocument() {
  return useMutation({
    mutationFn: findLeadByDocument,
    onError: (error: Error) => {
      console.error('Error finding lead:', error);
      if (!(error instanceof AxiosError) || error.response?.status !== 404) {
        toast.error('Error al buscar lead');
      }
    },
  });
}
