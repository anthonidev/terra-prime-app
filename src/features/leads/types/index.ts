// Lead Source Types
export interface LeadSource {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadSourcesQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  search?: string;
  isActive?: boolean;
}

export interface CreateLeadSourceInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateLeadSourceInput {
  name?: string;
  isActive?: boolean;
}

export interface LeadSourceResponse {
  success: boolean;
  data: LeadSource;
  error?: string;
}

// Lead Types
export type DocumentType = 'DNI' | 'CE' | 'PASSPORT' | 'RUC';

export interface UbigeoItem {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  children?: UbigeoItem[];
}

export interface LeadVisit {
  id: string;
  arrivalTime: string;
  departureTime?: string;
  liner?: any;
  createdAt: string;
  updatedAt: string;
  reportPdfUrl: string | null;
}

export interface LeadMetadata {
  estadoCivil?: string;
  tieneTarjetasCredito?: boolean;
  cantidadTarjetasCredito?: number;
  tieneTarjetasDebito?: boolean;
  cantidadTarjetasDebito?: number;
  cantidadHijos?: number;
  ocupacion?: string;
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
  ubigeo?: UbigeoItem;
  source?: LeadSource;
  visits?: LeadVisit[];
  isActive: boolean;
  departmentId: number | null;
  provinceId: number | null;
  createdAt: string;
  updatedAt: string;
  isInOffice: boolean;
  fullName?: string;
  interestProjects?: string[];
  companionFullName?: string | null;
  companionDni?: string | null;
  companionRelationship?: string | null;
  metadata?: LeadMetadata | null;
}

export interface LeadsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  order?: 'ASC' | 'DESC';
  isInOffice?: 'true' | 'false';
}

// Lead Registration
export interface FindLeadByDocumentInput {
  documentType: DocumentType;
  document: string;
}

export interface FindLeadByDocumentResponse {
  success: boolean;
  message: string;
  data?: Lead;
}

export interface CreateUpdateLeadInput {
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  email?: string;
  phone?: string;
  phone2?: string;
  age?: number;
  sourceId?: number;
  ubigeoId?: number;
  observations?: string;
  isNewLead?: boolean;
  interestProjects?: string[];
  companionFullName?: string;
  companionDni?: string;
  companionRelationship?: string;
  metadata?: LeadMetadata;
}

export interface RegisterLeadResponse {
  success: boolean;
  message: string;
  data?: Lead | null;
}
