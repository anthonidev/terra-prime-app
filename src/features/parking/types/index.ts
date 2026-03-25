import type { PaginatedResponse, PaginationMeta } from '@/shared/types/pagination';

export type { PaginatedResponse, PaginationMeta };

export type ParkingStatus = 'Activo' | 'Inactivo' | 'Vendido' | 'Separado';

export interface Parking {
  id: string;
  name: string;
  area: string;
  price: string;
  status: ParkingStatus;
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingsQueryParams {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  term?: string;
  projectId?: string;
  status?: ParkingStatus;
  minPrice?: number;
  maxPrice?: number;
  hasPagination?: boolean;
}

export interface CreateParkingInput {
  name: string;
  area: number;
  price: number;
  projectId: string;
  status?: ParkingStatus;
}

export interface UpdateParkingInput {
  name?: string;
  area?: number;
  price?: number;
  status?: ParkingStatus;
}
