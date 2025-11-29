import { apiClient } from '@/shared/lib/api-client';
import type { AssignClientsPayload } from '../types';

export const assignClientsToCollector = async (payload: AssignClientsPayload): Promise<void> => {
  await apiClient.post('/api/collections/assign-clients-to-collector', payload);
};
