'use client';

import { useQuery } from '@tanstack/react-query';
import { getContractTemplates } from '../lib/queries';
import type { TemplatesQueryParams } from '../types';

export function useContractTemplates(params: TemplatesQueryParams) {
  return useQuery({
    queryKey: ['contract-templates', params],
    queryFn: () => getContractTemplates(params),
    staleTime: 2 * 60 * 1000,
  });
}
