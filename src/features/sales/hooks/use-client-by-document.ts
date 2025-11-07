'use client';

import { useQuery } from '@tanstack/react-query';
import { getClientByDocument } from '../lib/queries';
import { SALES_QUERY_KEYS } from '../constants';

export function useClientByDocument(document: string) {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.clientByDocument(document),
    queryFn: () => getClientByDocument(document),
    enabled: !!document && document.length >= 8, // Only fetch when document has minimum length
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
