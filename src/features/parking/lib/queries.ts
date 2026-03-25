import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse, Parking, ParkingsQueryParams } from '../types';

export async function getParkings(
  params: ParkingsQueryParams = {}
): Promise<PaginatedResponse<Parking>> {
  const response = await apiClient.get<PaginatedResponse<Parking>>('/api/parkings', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.order && { order: params.order }),
      ...(params.term && { term: params.term }),
      ...(params.projectId && { projectId: params.projectId }),
      ...(params.status && { status: params.status }),
      ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
      ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
      ...(params.hasPagination !== undefined && { hasPagination: params.hasPagination }),
    },
  });
  return response.data;
}

export async function getParking(id: string): Promise<Parking> {
  const response = await apiClient.get<Parking>(`/api/parkings/${id}`);
  return response.data;
}
