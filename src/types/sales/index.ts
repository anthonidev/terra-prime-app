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
  vendor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    document: string;
  } | null;
}

export interface AmortizationItem {
  couteAmount: number;
  expectedPaymentDate: string;
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

export interface AmortizationResponse {
  installments: AmortizationItem[];
}

export interface Client {
  id: number;
  address: string;
}

export type ClientResponse = Client;
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
  id: string | undefined;
}

export interface ProyectBlocksDTO {
  id: string | undefined;
}

export interface ProyectLotsDTO {
  id: string | undefined;
}

export interface ClientFindDTO {
  document: number;
}

export interface AmortizationDTO {
  totalAmount: number;
  initialAmount: number;
  reservationAmount: number;
  interestRate: number;
  numberOfPayments: number;
  firstPaymentDate: string;
  includeDecimals: boolean;
}

export interface ClientGuarantorPayload {
  createClient: {
    leadId: string;
    address: string;
  };
  createGuarantor: {
    firstName: string;
    lastName: string;
    email: string;
    document: string;
    documentType: string;
    phone: string;
    address: string;
  };
  document: string;
}

export interface ClientGuarantorResponse {
  clientId: number;
  guarantorId: number;
}

export interface CreateSalePayload {
  lotId: string;
  saleType: 'DIRECT_PAYMENT' | 'FINANCED';
  clientId: number;
  guarantorId: number;
  paymentDate: string;
  saleDate: string;
  contractDate: string;
  totalAmount: number;

  totalAmountUrbanDevelopment: number;
  firstPaymentDateHu?: string;
  initialAmountUrbanDevelopment?: number; //puede ser 0
  quantityHuCuotes?: number;

  initialAmount?: number;
  interestRate?: number;
  quantitySaleCoutes?: number;

  financingInstallments?: Array<{
    couteAmount: number;
    expectedPaymentDate: string;
  }>;
}

export interface SaleResponse {
  id: string;
  type: string;
  totalAmount: number;
  contractDate: string;
  saleDate: string;
  status: string;
  client: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  lot: {
    name: string;
    lotPrice: number;
  };
  financing: {
    id: string;
    initialAmount: number;
    interestRate: number;
    quantityCoutes: number;
  };
  guarantor: {
    firstName: string;
    lastName: string;
  };
  reservation: {
    id: string;
    amount: number;
  };
  vendor: {
    document: string;
    firstName: string;
    lastName: string;
  };
}

export interface ProjectSelectionState {
  selectedProject: ProyectsActivesItems | null;
  selectedStage: ProyectStagesItems | null;
  selectedBlock: ProyectBlocksItems | null;
  selectedLot: ProyectLotsItems | null;
}

export interface ProjectLoadingState {
  projects: boolean;
  stages: boolean;
  blocks: boolean;
  lots: boolean;
}

export interface ProjectSelectionHandlers {
  onProjectChange: (projectId: string) => void;
  onStageChange: (stageId: string) => void;
  onBlockChange: (blockId: string) => void;
  onLotChange: (lotId: string) => void;
}

export interface ProjectDataActions {
  loadProjects: () => Promise<void>;
  loadStages: (projectId: string) => Promise<void>;
  loadBlocks: (stageId: string) => Promise<void>;
  loadLots: (blockId: string) => Promise<void>;
}

// Constantes para los mensajes de placeholder
export const PLACEHOLDER_MESSAGES = {
  PROJECT: {
    LOADING: 'Cargando proyectos...',
    SELECT: 'Selecciona un proyecto'
  },
  STAGE: {
    LOADING: 'Cargando etapas...',
    SELECT: 'Selecciona una etapa',
    DISABLED: 'Primero selecciona un proyecto'
  },
  BLOCK: {
    LOADING: 'Cargando manzanas...',
    SELECT: 'Selecciona una manzana',
    DISABLED: 'Primero selecciona una etapa'
  },
  LOT: {
    LOADING: 'Cargando lotes...',
    SELECT: 'Selecciona un lote',
    DISABLED: 'Primero selecciona una manzana'
  }
} as const;

export interface SalesListVendorResponse {
  items: SaleResponse[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
