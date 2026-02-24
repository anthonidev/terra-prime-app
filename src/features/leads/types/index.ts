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

export enum ParticipantType {
  LINER = 'LINER',
  TELEMARKETING_SUPERVISOR = 'TELEMARKETING_SUPERVISOR',
  TELEMARKETING_CONFIRMER = 'TELEMARKETING_CONFIRMER',
  TELEMARKETER = 'TELEMARKETER',
  FIELD_MANAGER = 'FIELD_MANAGER',
  FIELD_SUPERVISOR = 'FIELD_SUPERVISOR',
  FIELD_SELLER = 'FIELD_SELLER',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_GENERAL_MANAGER = 'SALES_GENERAL_MANAGER',
  POST_SALE = 'POST_SALE',
  CLOSER = 'CLOSER',
  GENERAL_DIRECTOR = 'GENERAL_DIRECTOR',
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  document: string;
  documentType: DocumentType;
  phone: string;
  address: string;
  participantType: ParticipantType;
}

export interface ParticipantResponseActive {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  participantType: ParticipantType;
}

export interface Companion {
  fullName: string;
  dni?: string | null;
  relationship?: string | null;
}

export interface LeadVisit {
  id: string;
  arrivalTime: string;
  departureTime: string | null;
  observations: string | null;
  createdAt: string;
  reportPdfUrl: string | null;
  companions: Companion[] | null;
  linerParticipant: Participant | null;
  telemarketingSupervisor: Participant | null;
  telemarketingConfirmer: Participant | null;
  telemarketer: Participant | null;
  fieldManager: Participant | null;
  fieldSupervisor: Participant | null;
  fieldSeller: Participant | null;
  salesManager: Participant | null;
  salesGeneralManager: Participant | null;
  postSale: Participant | null;
  closer: Participant | null;
  generalDirector: Participant | null;
}

export interface LeadMetadata {
  estadoCivil?: string;
  tieneTarjetasCredito?: boolean;
  cantidadTarjetasCredito?: number;
  tieneTarjetasDebito?: boolean;
  cantidadTarjetasDebito?: number;
  cantidadHijos?: number;
  ocupacion?: string;
  ingresoPromedioFamiliar?: number;
}

export interface LeadVendor {
  document: string;
  firstName: string;
  lastName: string;
  createdAt: string;
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
  metadata?: LeadMetadata | null;
  vendor?: LeadVendor | null;
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
  companions?: Companion[];
  metadata?: LeadMetadata;
}

export interface RegisterLeadResponse {
  success: boolean;
  message: string;
  data?: Lead | null;
}

// Lead Detail
export interface LeadDetailResponse {
  success: boolean;
  data: Lead;
}

export interface UpdateLeadInput {
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: DocumentType;
  email?: string;
  phone?: string;
  phone2?: string;
  age?: number;
  observations?: string;
}

export interface UpdateLeadResponse {
  success: boolean;
  message: string;
  data: Lead | null;
}

export interface RegisterDepartureResponse {
  success: boolean;
  message: string;
  data: Lead | null;
}

// Reports
export interface GenerateReportResponse {
  success: boolean;
  message: string;
  data: {
    leadId: string;
    documentUrl: string;
    generatedAt: string;
    clientName?: string;
    documentNumber: string;
    leadInfo: {
      documentType: DocumentType;
      phone: string;
      source: string;
    };
    isNewDocument: boolean;
  };
}

// Participants
export interface AssignParticipantsInput {
  linerParticipantId?: string;
  telemarketingSupervisorId?: string;
  telemarketingConfirmerId?: string;
  telemarketerId?: string;
  fieldManagerId?: string;
  fieldSupervisorId?: string;
  fieldSellerId?: string;
  salesManagerId?: string;
  salesGeneralManagerId?: string;
  postSaleId?: string;
  closerId?: string;
  generalDirectorId?: string;
}

export interface AssignParticipantsResponse {
  success: boolean;
  message: string;
}

export interface ParticipantsResponse {
  success: boolean;
  data: Participant[];
}

export interface ParticipantsActiveResponse {
  success: boolean;
  data: ParticipantResponseActive[];
}

// Lead Assignment
export interface LeadsPaginatedResponse {
  items: Lead[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface AssignLeadsToVendorInput {
  leadsId: string[];
  vendorId: string;
}

export interface AssignLeadsToVendorResponse {
  success: boolean;
  message: string;
}

// Vendor Leads
export interface VendorLead {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  phone2?: string;
  email?: string;
  age: number;
  placeOfResidence?: string;
  interestProjects?: string[];
  notes?: string;
  createdAt: string;
  source: {
    id: number;
    name: string;
  };
}
