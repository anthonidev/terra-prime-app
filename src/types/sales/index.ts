export interface LeadsVendorItems {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  phone2?: string;
  age: number;
  createdAt: string;
  source: Source;
  ubigeo: Ubigeo;
}

export interface ProyectsActivesItems {
  id: string;
  name: string;
  currency: string;
  logo: string | null;
  logoPublicId: string | null;
  projectCode: string | null;
  createdAt: string;
}

export interface ProyectStagesItems {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProyectBlocksItems {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProyectLotsItems {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}
export interface VendorsActivesItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  photo: string;
  createdAt: string;
}

interface Source {
  id: number;
  name: string;
}

interface Ubigeo {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
}

export interface LeadsByDayItem {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  phone2?: string;
  age?: number;
  createdAt: string;
  source: Source;
  ubigeo: Ubigeo;
  vendor:
    | string
    | {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        document: string;
      }
    | null;
}

export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface LeadsByDayResponse {
  items: LeadsByDayItem[];
  meta: PaginatedMeta;
}

export type AllVendorsActivesResponse = VendorsActivesItem[];
export type ProyectsActivesResponse = ProyectsActivesItems[];
export type ProyectStagesResponse = ProyectStagesItems[];
export type ProyectBlocksResponse = ProyectBlocksItems[];
export type ProyectLotsResponse = ProyectLotsItems[];
export type LeadsVendorResponse = LeadsVendorItems[];

export interface AssignLeadsToVendorDto {
  leadsId: string[];
  vendorId: string;
}

export interface ProyectStagesDTO {
  id: string;
}

export interface ProyectBlocksDTO {
  id: string;
}

export interface ProyectLotsDTO {
  id: string;
}
