import type { PaginationMeta } from '@/shared/types/pagination';

export interface ClientUbigeo {
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface Client {
  id: number;
  address: string | null;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  document: string;
  documentType: string;
  ubigeo: ClientUbigeo | null;
}

export interface GetClientsParams {
  term?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  departamentoId?: number;
  provinciaId?: number;
  distritoId?: number;
}

export interface GetClientsResponse {
  items: Client[];
  meta: PaginationMeta;
}

export interface Ubigeo {
  id: number;
  name: string;
}
