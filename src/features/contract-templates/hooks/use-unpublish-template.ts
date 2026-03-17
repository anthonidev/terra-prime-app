'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unpublishTemplate } from '../lib/mutations';

export function useUnpublishTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      queryClient.invalidateQueries({ queryKey: ['contract-template'] });
      toast.success('Plantilla despublicada exitosamente');
    },
    onError: () => {
      toast.error('Error al despublicar la plantilla');
    },
  });
}
