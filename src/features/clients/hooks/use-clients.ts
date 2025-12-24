import { useQuery } from '@tanstack/react-query';
import { getClients } from '../lib/queries';
import type { GetClientsParams } from '../types';

export function useClients(params: GetClientsParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => getClients(params),
    staleTime: 2 * 60 * 1000,
  });
}
