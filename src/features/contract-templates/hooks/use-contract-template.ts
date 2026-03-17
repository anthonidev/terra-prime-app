'use client';

import { useQuery } from '@tanstack/react-query';
import { getContractTemplate } from '../lib/queries';

export function useContractTemplate(id: string) {
  return useQuery({
    queryKey: ['contract-template', id],
    queryFn: () => getContractTemplate(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
