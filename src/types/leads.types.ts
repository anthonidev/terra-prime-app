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

// Ubigeo
export interface UbigeoItem {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  children?: UbigeoItem[];
}

export interface UbigeoResponse {
  success: boolean;
  data: UbigeoItem[];
}

// Leads
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  phone2?: string;
  age?: number;
  ubigeo?: Ubigeo;
  source?: LeadSource;
  visits: LeadVisit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isInOffice: boolean;
  fullName: string;
}

export interface LeadSource {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ubigeo {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  children?: Ubigeo[];
}

export interface LeadVisit {
  id: string;
  arrivalTime: string;
  departureTime?: string;
  liner?: any; // Puede detallarse más si es necesario
  lead: Lead;
  createdAt: string;
  updatedAt: string;
}

// DTOs para las peticiones

export interface FindLeadByDocumentDto {
  documentType: DocumentType;
  document: string;
}

export interface CreateUpdateLeadDto {
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  email?: string;
  phone?: string;
  phone2?: string;
  age?: number;
  sourceId?: string;
  ubigeoId?: number;
  observations?: string;
  isNewLead?: boolean;
}

// Respuestas

export interface FindLeadResponse {
  success: boolean;
  message: string;
  data: Lead | null;
}

export interface CreateUpdateLeadResponse {
  success: boolean;
  message: string;
  data: Lead | null;
}
