// Project types
export interface Project {
  id: string;
  name: string;
  currency: string;
  logo: string;
  logoPublicId: string;
  projectCode: string;
  createdAt: string;
}

// Stage types
export interface ProjectStage {
  id: string;
  name: string;
  createdAt: string;
}

// Block types
export interface ProjectBlock {
  id: string;
  name: string;
  createdAt: string;
}

// Lot types
export interface Lot {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  blockId: string;
  blockName: string;
  stageId: string;
  stageName: string;
  projectId: string;
  projectName: string;
  projectCurrency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
}

// Query params
export interface LotsQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  stageId?: string;
  blockId?: string;
  term?: string;
}

// Enums for sales creation
export enum DocumentType {
  DNI = 'DNI',
  RUC = 'RUC',
  CE = 'CE',
  PASSPORT = 'Pasaporte',
}

export enum SaleType {
  DIRECT_PAYMENT = 'DIRECT_PAYMENT',
  FINANCED = 'FINANCED',
}

export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN',
}

export enum StatusSale {
  // Estados de Reserva
  RESERVATION_PENDING = 'RESERVATION_PENDING',
  RESERVATION_PENDING_APPROVAL = 'RESERVATION_PENDING_APPROVAL',
  RESERVED = 'RESERVED',

  // Estados de Venta
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  IN_PAYMENT_PROCESS = 'IN_PAYMENT_PROCESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Project Lot Response
export interface ProjectLotResponse {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  blockId: string;
  blockName: string;
  stageId: string;
  stageName: string;
  projectId: string;
  projectName: string;
  projectCurrency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
}

// Client By Document Response
export interface ClientByDocumentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  address?: string;
  civilStatus?: string;
  occupation?: string;
  createdAt: string;
  updatedAt: string;
}

// Amortization types
export interface CombinedInstallment {
  lotInstallmentAmount: number;
  lotInstallmentNumber: number;
  huInstallmentAmount: number;
  huInstallmentNumber: number;
  expectedPaymentDate: string;
  totalInstallmentAmount: number;
}

export interface AmortizationMeta {
  lotInstallmentsCount: number;
  lotTotalAmount: number;
  huInstallmentsCount: number;
  huTotalAmount: number;
  totalInstallmentsCount: number;
  totalAmount: number;
}

export interface AmortizationResponse {
  installments: CombinedInstallment[];
  meta: AmortizationMeta;
}

// Create Guarantor Client Response
export interface CreateGuarantorClientResponse {
  clientId: number;
  guarantorId?: number;
  secondaryClientIds?: number[];
}

// Created Sale Response
export interface CreatedSaleResponse {
  id: string;
  type: string;
  totalAmount: number;
  contractDate: string;
  status: string;
  currency: CurrencyType;
  createdAt: string;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  fromReservation?: boolean;
  client: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    reportPdfUrl: string | null;
  };
  lot: {
    id: string;
    name: string;
    lotPrice: number;
    block: string;
    stage: string;
    project: string;
  };
}

// Input types for mutations
export interface CalculateAmortizationInput {
  totalAmount: number; // monto del precio del lote
  initialAmount: number; // pago inicial
  reservationAmount?: number; // monto de la reserva (default: 0)
  interestRate: number; // tasa de interés anual
  numberOfPayments: number; // número de pagos mensuales
  firstPaymentDate: string; // fecha del primer pago
  includeDecimals?: boolean; // si el cálculo debe incluir decimales (default: false)
  totalAmountHu?: number; // monto del precio de HU del lote
  numberOfPaymentsHu?: number; // número de pagos mensuales en HU
  firstPaymentDateHu?: string; // fecha del primer pago en HU
}

export interface CreateGuarantorInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  address?: string;
  civilStatus?: string;
  occupation?: string;
}

export interface CreateSecondaryClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  documentType: DocumentType;
  address?: string;
  civilStatus?: string;
  occupation?: string;
}

export interface CreateGuarantorClientInput {
  createClient: {
    leadId: string;
    address: string;
  };
  createGuarantor?: CreateGuarantorInput;
  createSecondaryClient?: CreateSecondaryClientInput[];
}

export interface CreateSaleInput {
  lotId: string;
  saleType: SaleType;
  clientId: number;
  totalAmount: number;
  totalAmountUrbanDevelopment: number;
  guarantorId?: number;
  secondaryClientsIds?: number[];
  contractDate?: string;
  firstPaymentDateHu?: string;
  initialAmountUrbanDevelopment?: number;
  quantityHuCuotes?: number;
  metadata?: Record<string, any>;
  notes?: string;
  initialAmount?: number;
  interestRate?: number;
  quantitySaleCoutes?: number;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  isReservation?: boolean;
  combinedInstallments?: CombinedInstallment[];
}

// Form data interfaces for multi-step form
export interface Step1Data {
  projectId: string;
  projectName: string;
  projectCurrency: string;
  stageId: string;
  stageName: string;
  blockId: string;
  blockName: string;
  selectedLot: ProjectLotResponse | null;
}

export interface Step2Data {
  saleType: SaleType;
  isReservation: boolean;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
}

export interface Step3Data {
  totalAmount: number;
  totalAmountUrbanDevelopment: number;
  initialAmount?: number;
  interestRate?: number;
  quantitySaleCoutes?: number;
  firstPaymentDate?: string;
  initialAmountUrbanDevelopment?: number;
  quantityHuCuotes?: number;
  firstPaymentDateHu?: string;
  combinedInstallments?: CombinedInstallment[];
  amortizationMeta?: AmortizationMeta;
}

export interface Step4Data {
  leadId: string;
  leadName?: string; // Nombre completo del lead para mostrar
  leadDocument?: string; // Documento del lead para mostrar
  clientAddress: string;
  clientId?: number;
  guarantor?: CreateGuarantorInput;
  secondaryClients?: CreateSecondaryClientInput[];
  guarantorId?: number;
  secondaryClientIds?: number[];
}

export interface SalesFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

// My Sales Response
export interface MySale {
  id: string;
  type: string;
  totalAmount: number;
  status: StatusSale;
  currency: CurrencyType;
  createdAt: string;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  fromReservation?: boolean;
  client: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    reportPdfUrl: string | null;
  };
  lot: {
    id: string;
    name: string;
    lotPrice: number;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
}

export interface MySalesQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

// Sale Detail Response
export interface PaymentSummary {
  id: number;
  amount: number;
  status: StatusPayment;
  createdAt: string;
  reviewedAt: string | null;
  codeOperation: string | null;
  banckName: string | null;
  dateOperation: string | null;
  numberTicket: string | null;
  paymentConfig: string;
  reason: string | null;
}

export interface PersonInfo {
  firstName: string;
  lastName: string;
}

export interface VendorInfo extends PersonInfo {
  document: string;
}

export interface ClientInfo extends PersonInfo {
  address: string;
  phone: string;
}

export interface SaleDetail {
  id: string;
  type: string;
  totalAmount: number;
  contractDate: string;
  status: string;
  currency: CurrencyType;
  createdAt: string;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  fromReservation?: boolean;
  client: ClientInfo & {
    reportPdfUrl: string | null;
  };
  secondaryClients: ClientInfo[];
  lot: {
    id: string;
    name: string;
    lotPrice: number;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
  guarantor: PersonInfo;
  liner: PersonInfo;
  telemarketingSupervisor: PersonInfo;
  telemarketingConfirmer: PersonInfo;
  telemarketer: PersonInfo;
  fieldManager: PersonInfo;
  fieldSupervisor: PersonInfo;
  fieldSeller: PersonInfo;
  vendor: VendorInfo;
  paymentsSummary: PaymentSummary[];
}
