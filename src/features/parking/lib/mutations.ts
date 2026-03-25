import { apiClient } from '@/shared/lib/api-client';
import type { CreateParkingInput, Parking, UpdateParkingInput } from '../types';

export async function createParking(data: CreateParkingInput): Promise<Parking> {
  const response = await apiClient.post<Parking>('/api/parkings', data);
  return response.data;
}

export async function updateParking(id: string, data: UpdateParkingInput): Promise<Parking> {
  const response = await apiClient.patch<Parking>(`/api/parkings/${id}`, data);
  return response.data;
}

export async function deleteParking(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/api/parkings/${id}`);
  return response.data;
}
