export interface LeadSource {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface LeadSourcesResponse {
  success: boolean;
  data: LeadSource[];
  meta: PaginatedMeta;
}

export interface GetLeadSourcesParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
}

export interface ActiveLeadSourcesResponse {
  success: boolean;
  data: LeadSource[];
}

export interface CreateLeadSourceDto {
  name: string;
  isActive?: boolean;
}

export interface CreateLeadSourceResponse {
  success: boolean;
  message: string;
  data: LeadSource;
}

export interface UpdateLeadSourceDto {
  name?: string;
  isActive?: boolean;
}

export interface UpdateLeadSourceResponse {
  success: boolean;
  message: string;
  data: LeadSource;
}

export enum DocumentType {
  DNI = "DNI",
  CE = "CE",
  RUC = "RUC",
}

// Interfaces para Liners
export interface Liner {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface LinersResponse {
  success: boolean;
  data: Liner[];
  meta: PaginatedMeta;
}

export interface ActiveLinersResponse {
  success: boolean;
  data: Liner[];
}

export interface CreateLinerResponse {
  success: boolean;
  message: string;
  data: Liner;
}

export interface UpdateLinerResponse {
  success: boolean;
  message: string;
  data: Liner;
}

export interface GetLinersParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
}

export interface CreateLinerDto {
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  isActive?: boolean;
}

export interface UpdateLinerDto {
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: DocumentType;
  isActive?: boolean;
}
