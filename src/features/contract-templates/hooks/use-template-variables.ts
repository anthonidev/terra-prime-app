'use client';

import { useQuery } from '@tanstack/react-query';
import { getTemplateVariables } from '../lib/queries';

export function useTemplateVariables(category?: string) {
  return useQuery({
    queryKey: ['template-variables', category],
    queryFn: () => getTemplateVariables(category),
    staleTime: 10 * 60 * 1000,
  });
}
