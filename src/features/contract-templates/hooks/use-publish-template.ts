'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { publishTemplate } from '../lib/mutations';

export function usePublishTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      queryClient.invalidateQueries({ queryKey: ['contract-template'] });
      toast.success('Plantilla publicada exitosamente');
    },
    onError: () => {
      toast.error('Error al publicar la plantilla');
    },
  });
}
