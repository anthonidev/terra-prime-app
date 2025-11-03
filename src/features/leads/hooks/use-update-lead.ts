'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateLead } from '../lib/mutations';
import type { UpdateLeadInput } from '../types';

export function useUpdateLead(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLeadInput) => updateLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead actualizado correctamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el lead');
      console.error('Error updating lead:', error);
    },
  });
}
