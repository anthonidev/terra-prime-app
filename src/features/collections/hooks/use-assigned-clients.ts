import { useQuery } from '@tanstack/react-query';
import { getAssignedClients } from '../lib/queries';
import type { GetAssignedClientsParams } from '../types';

export function useAssignedClients(params: GetAssignedClientsParams) {
  return useQuery({
    queryKey: ['assigned-clients', params],
    queryFn: () => getAssignedClients(params),
  });
}
