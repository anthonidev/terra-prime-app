import { apiClient } from '@/shared/lib/api-client';
import type {
  GetCollectorStatisticsParams,
  GetCollectorStatisticsResponse,
  GetClientsParams,
  GetClientsResponse,
  Ubigeo,
  ActiveCollector,
  GetClientSalesResponse,
  GetSaleDetailResponse,
} from '../types';

export const getCollectorStatistics = async (
  params: GetCollectorStatisticsParams
): Promise<GetCollectorStatisticsResponse> => {
  const { data } = await apiClient.get<GetCollectorStatisticsResponse>(
    '/api/collections/collectors/statistics',
    { params }
  );
  return data;
};

// Clients Admin Queries

export const getClients = async (params: GetClientsParams): Promise<GetClientsResponse> => {
  const { data } = await apiClient.get<GetClientsResponse>('/api/collections/clients/list', {
    params,
  });
  return data;
};

export const getDepartments = async (): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>('/api/collections/ubigeo/departamentos');
  return data;
};

export const getProvinces = async (departmentId: number): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>(
    `/api/collections/ubigeo/provincias/${departmentId}`
  );
  return data;
};

export const getDistricts = async (provinceId: number): Promise<Ubigeo[]> => {
  const { data } = await apiClient.get<Ubigeo[]>(`/api/collections/ubigeo/distritos/${provinceId}`);
  return data;
};

export const getActiveCollectors = async (): Promise<ActiveCollector[]> => {
  const { data } = await apiClient.get<ActiveCollector[]>('/api/collections/collectors/all');
  return data;
};

export const getClientSales = async (clientId: string): Promise<GetClientSalesResponse> => {
  const { data } = await apiClient.get<GetClientSalesResponse>(
    `/api/collections/sales/list-by-client/${clientId}`
  );
  return data;
};

export const getSaleDetail = async (saleId: string): Promise<GetSaleDetailResponse> => {
  const { data } = await apiClient.get<GetSaleDetailResponse>(
    `/api/collections/clients/sales/${saleId}`
  );
  return data;
};
