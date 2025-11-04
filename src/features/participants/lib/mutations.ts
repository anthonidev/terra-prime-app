import { apiClient } from '@/shared/lib/api-client';
import type { Participant, CreateParticipantInput, UpdateParticipantInput } from '../types';

export async function createParticipant(data: CreateParticipantInput): Promise<Participant> {
  const response = await apiClient.post<Participant>('/api/participants', data);
  return response.data;
}

export async function updateParticipant(
  id: string,
  data: UpdateParticipantInput
): Promise<Participant> {
  const response = await apiClient.patch<Participant>(`/api/participants/${id}`, data);
  return response.data;
}
