'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createContractTemplate } from '../lib/mutations';

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createContractTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      toast.success('Plantilla creada exitosamente');
      router.push(`/contratos/plantillas/editar/${data.id}`);
    },
    onError: () => {
      toast.error('Error al crear la plantilla');
    },
  });
}
