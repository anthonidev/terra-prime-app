'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteContractTemplate } from '../lib/mutations';

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteContractTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      toast.success(data.message || 'Plantilla eliminada exitosamente');
      router.push('/contratos/plantillas');
    },
    onError: () => {
      toast.error('Error al eliminar la plantilla');
    },
  });
}
