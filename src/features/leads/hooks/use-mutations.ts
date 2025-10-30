'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createLeadSource, updateLeadSource } from '../lib/mutations';

export function useCreateLeadSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeadSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast.success('Fuente de lead creada exitosamente');
    },
    onError: (error) => {
      console.error('Error creating lead source:', error);
      toast.error('Error al crear la fuente de lead');
    },
  });
}

export function useUpdateLeadSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateLeadSource>[1] }) =>
      updateLeadSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast.success('Fuente de lead actualizada exitosamente');
    },
    onError: (error) => {
      console.error('Error updating lead source:', error);
      toast.error('Error al actualizar la fuente de lead');
    },
  });
}
