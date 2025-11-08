import { apiClient } from '@/shared/lib/api-client';
import type {
  Participant,
  PaginatedResponse,
  ParticipantsQueryParams,
} from '../types';

export async function getParticipants(
  params: ParticipantsQueryParams = {}
): Promise<PaginatedResponse<Participant>> {
  const response = await apiClient.get<PaginatedResponse<Participant>>('/api/participants', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.search && { search: params.search }),
      ...(params.type && { type: params.type }),
    },
  });
  return response.data;
}

export async function getActiveParticipants(): Promise<Participant[]> {
  const response = await apiClient.get<Participant[]>('/api/participants/all/actives');
  return response.data;
}
