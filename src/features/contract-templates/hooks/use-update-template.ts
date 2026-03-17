'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContractTemplate } from '../lib/mutations';
import type { UpdateTemplateInput } from '../types';

export function useUpdateTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTemplateInput) => updateContractTemplate(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      queryClient.invalidateQueries({ queryKey: ['contract-template', id] });
    },
  });
}
