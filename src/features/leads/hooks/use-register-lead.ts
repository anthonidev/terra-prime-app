'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    onError: (error: any) => {
      console.error('Error registering lead:', error);
      toast.error(error?.response?.data?.message || 'Error al registrar lead');
    },
  });
}

export function useFindLeadByDocument() {
  return useMutation({
    mutationFn: findLeadByDocument,
    onError: (error: any) => {
      console.error('Error finding lead:', error);
      if (error?.response?.status !== 404) {
        toast.error('Error al buscar lead');
      }
    },
  });
}
