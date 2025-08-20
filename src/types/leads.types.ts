import { Meta } from '@infrastructure/types/pagination.types';

export interface LeadSource {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadSourcesResponse {
  success: boolean;
  data: LeadSource[];
  meta: Meta;
}
export interface GetLeadSourcesParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
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
  DNI = 'DNI',
  CE = 'CE',
  RUC = 'RUC'
}
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

export interface LinersResponse {
  success: boolean;
  data: Liner[];
  meta: Meta;
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
  order?: 'ASC' | 'DESC';
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
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  document: string;
  documentType: DocumentType;
  phone: string | null;
  phone2: string | null;
  reportPdfUrl: string | null;
  age: number | null;
  ubigeo?: Ubigeo;
  source?: LeadSource;
  visits: LeadVisit[];
  isActive: boolean;
  departmentId: number | null;
  provinceId: number | null;
  createdAt: string;
  updatedAt: string;
  isInOffice: boolean;
  fullName: string;
  interestProjects?: string[];
  companionFullName?: string | null;
  companionDni?: string | null;
  companionRelationship?: string | null;
  metadata?: Record<string, string> | null;
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
  liner?: Liner;
  lead: Lead;
  createdAt: string;
  updatedAt: string;
}
export interface FindLeadByDocumentDto {
  documentType: DocumentType;
  document: string;
}

export enum EstadoCivil {
  Soltero = 'Soltero',
  Casado = 'Casado',
  Divorciado = 'Divorciado',
  Conviviente = 'Conviviente',
  Viudo = 'Viudo'
}

export interface LeadMetadata {
  estadoCivil: EstadoCivil;
  tieneTarjetasCredito: boolean;
  cantidadTarjetasCredito: number;
  tieneTarjetasDebito: boolean;
  cantidadTarjetasDebito: number;
  cantidadHijos: number;
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
  interestProjects?: string[];
  companionFullName?: string;
  companionDni?: string;
  companionRelationship?: string;
  metadata?: LeadMetadata;
}
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
export interface PaginatedLeadsResponse {
  success: boolean;
  data: Lead[];
  meta: Meta;
}
export interface GetLeadsParams {
  search?: string;
  isInOffice?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}
export interface RegisterDepartureResponse {
  success: boolean;
  message: string;
  data: Lead | null;
}
export interface LeadDetailResponse {
  success: boolean;
  data: Lead;
}
