import { apiClient } from '@/shared/lib/api-client';
import type { GetClientsParams, GetClientsResponse, Ubigeo } from '../types';

export const getClients = async (params: GetClientsParams): Promise<GetClientsResponse> => {
  const { data } = await apiClient.get<GetClientsResponse>('/api/clients', { params });
  return data;
};

export const getDepartments = async (): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>('/api/ubigeo/departamentos');
  return data;
};

export const getProvinces = async (departmentId: number): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>(`/api/ubigeo/provincias/${departmentId}`);
  return data;
};

export const getDistricts = async (provinceId: number): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>(`/api/ubigeo/distritos/${provinceId}`);
  return data;
};
