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
  DIRECT_PAYMENT = 'DIRECT_PAYMENT', // Contado
  FINANCED = 'FINANCED', // Financiado
}

export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN',
}

export enum StatusSale {
  // ========== ESTADOS DE RESERVA ==========
  RESERVATION_PENDING = 'RESERVATION_PENDING', // Reserva registrada, sin pagos
  RESERVATION_PENDING_APPROVAL = 'RESERVATION_PENDING_APPROVAL', // Pago de reserva pendiente de aprobación
  RESERVATION_IN_PAYMENT = 'RESERVATION_IN_PAYMENT', // Pago parcial de reserva aprobado, aún falta dinero
  RESERVED = 'RESERVED', // Reserva completada y aprobada

  // ========== ESTADOS DE VENTA DIRECTA ==========
  PENDING = 'PENDING', // Venta creada, sin pagos
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Pago pendiente de aprobación (puede ser parcial o total)
  IN_PAYMENT = 'IN_PAYMENT', // Pago parcial aprobado, aún falta dinero
  APPROVED = 'APPROVED', // Venta aprobada (mantener por compatibilidad)
  COMPLETED = 'COMPLETED', // Venta completada y totalmente pagada

  // ========== ESTADOS DE VENTA FINANCIADA ==========
  // (usa PENDING, PENDING_APPROVAL, IN_PAYMENT para la inicial)
  IN_PAYMENT_PROCESS = 'IN_PAYMENT_PROCESS', // Inicial aprobada, pagando cuotas

  // ========== ESTADOS FINALES ==========
  REJECTED = 'REJECTED', // Rechazada (incluye reservas rechazadas/expiradas)
  WITHDRAWN = 'WITHDRAWN', // Retirada (incluye reservas anuladas)
}

export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
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
  metadata?: Record<string, unknown>;
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
  type: SaleType;
  totalAmount: string; // The response shows it as "64000.00" string, changing from number to string/number based on API usage, keeping string to be safe based on JSON
  status: StatusSale;
  currency: CurrencyType;
  createdAt: string;
  reservationAmount?: number | null;
  reservationAmountPaid?: number | null;
  reservationAmountPending?: number | null;
  totalAmountPaid: number;
  totalAmountPending?: number | null;
  maximumHoldPeriod?: number | null;
  fromReservation: boolean;
  client: {
    firstName: string;
    lastName: string;
    phone: string;
    reportPdfUrl: string | null;
  };
  lot: {
    id: string;
    name: string;
    area: string;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
  financing?: {
    quantityCoutes: string;
    interestRate: string;
    initialAmount: string;
    initialAmountPaid: number;
    initialAmountPending: number;
  } | null;
  urbanDevelopment?: {
    quantityCoutes: string;
    initialAmount: string;
    initialAmountPaid: number;
    initialAmountPending: string;
  } | null;
}

export interface AdminSale extends MySale {
  liner: PersonInfo | null;
  telemarketingSupervisor: PersonInfo | null;
  telemarketingConfirmer: PersonInfo | null;
  telemarketer: PersonInfo | null;
  fieldManager: PersonInfo | null;
  fieldSupervisor: PersonInfo | null;
  fieldSeller: PersonInfo | null;
  salesGeneralManager: PersonInfo | null;
  salesManager: PersonInfo | null;
  postSale: PersonInfo | null;
  closer: PersonInfo | null;
  vendor: VendorInfo;
}

export interface AdminSale extends MySale {
  liner: PersonInfo | null;
  telemarketingSupervisor: PersonInfo | null;
  telemarketingConfirmer: PersonInfo | null;
  telemarketer: PersonInfo | null;
  fieldManager: PersonInfo | null;
  fieldSupervisor: PersonInfo | null;
  fieldSeller: PersonInfo | null;
  salesGeneralManager: PersonInfo | null;
  salesManager: PersonInfo | null;
  postSale: PersonInfo | null;
  closer: PersonInfo | null;
  vendor: VendorInfo;
}

export interface MySalesQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  status?: StatusSale;
  type?: SaleType;
  projectId?: string;
  clientName?: string;
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
  metadata: Record<string, unknown> | null;
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

// Sale Detail Financing Installment (for lot and HU)
export interface SaleDetailInstallment {
  id: string;
  numberCuote?: number;
  couteAmount: string | number;
  coutePending: string | number;
  coutePaid: string | number;
  expectedPaymentDate: string;
  lateFeeAmount?: number;
  lateFeeAmountPending: string | number;
  lateFeeAmountPaid: string | number;
  status: StatusFinancingInstallments;
}

// Sale Detail Lot Financing info
export interface SaleDetailLotFinancing {
  id: string;
  initialAmount: string | number;
  initialAmountPaid: number;
  initialAmountPending: number | null;
  initialToPay: number;
  interestRate: string | number;
  quantityCoutes: string | number;
}

// Sale Detail Urban Development Financing info
export interface SaleDetailUrbanDevelopmentFinancing {
  id: string;
  amount: string | number;
  initialAmount: string | number;
  quantityCoutes: string | number;
  interestRate: string | number;
}

// Sale Detail Financing Meta
export interface SaleDetailFinancingMeta {
  lotInstallmentsCount: number;
  lotTotalAmount: number;
  huInstallmentsCount: number;
  huTotalAmount: number;
  totalInstallmentsCount: number;
  totalAmount: number;
}

// Sale Detail Financing structure
export interface SaleDetailFinancing {
  lot: SaleDetailLotFinancing;
  lotInstallments: SaleDetailInstallment[];
  urbanDevelopment?: SaleDetailUrbanDevelopmentFinancing;
  huInstallments: SaleDetailInstallment[];
  meta: SaleDetailFinancingMeta;
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
  reservationAmountPaid?: number;
  maximumHoldPeriod?: number;
  fromReservation?: boolean;
  totalToPay?: number;
  totalAmountPaid?: number;
  initialToPay?: number;
  initialAmountPaid?: number;
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

  financing: SaleDetailFinancing | null;
}

// Register Payment Types
export interface VoucherInput {
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  codeOperation: string;
  fileIndex: number;
}

export interface RegisterPaymentInput {
  payments: VoucherInput[];
  files: File[];
}

export interface VoucherResponse {
  id: number;
  url: string;
  amount: number;
  bankName: string | null;
  transactionReference: string;
  transactionDate: string;
}

export interface PaymentResponse {
  id: number;
  relatedEntityType: string;
  relatedEntityId: string;
  amount: number;
  methodPayment: string;
  status: string;
  createdAt: string;
  vouchers: VoucherResponse[];
}

// Admin Sales Types
export interface AdminSalesQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  status?: StatusSale;
  type?: SaleType;
  projectId?: string;
  clientName?: string;
}

// Assign Participants Input
export interface AssignSaleParticipantsInput {
  linerId?: string;
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
}

// Assign Participants Response
export interface AssignParticipantsResponse {
  success: boolean;
  message: string;
}

// Generate PDF Response
export interface GeneratePdfResponse {
  success: boolean;
  message: string;
  data: {
    url?: string;
    [key: string]: unknown;
  };
}

// Admin Token Validation
export interface AdminTokenValidationResponse {
  valid: boolean;
}

// Extend Reservation
export interface ExtendReservationInput {
  additionalDays: number;
}

export interface ExtendReservationResponse {
  success: boolean;
  message: string;
}

// Delete Sale
export interface DeleteSaleInput {
  token: string;
}

export interface DeleteSaleResponse {
  success: boolean;
  message: string;
}

// ============ Financing Detail Types ============

export enum StatusFinancingInstallments {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID',
}

export interface FinancingDetailInstallment {
  id: string;
  numberCuote: number;
  couteAmount: number;
  coutePending: number;
  coutePaid: number;
  expectedPaymentDate: string;
  lateFeeAmount: number;
  lateFeeAmountPending: number;
  lateFeeAmountPaid: number;
  status: StatusFinancingInstallments;
}

export interface FinancingDetailSale {
  id: string;
  status: StatusSale;
  type: SaleType;
  totalAmount: number;
  totalAmountPaid: number;
  reservationAmount: number;
  contractDate: string;
  client: {
    id: number;
    fullName: string;
    document: string;
    documentType: DocumentType | string;
  };
  lot: {
    id: string;
    name: string;
    block: string;
    stage: string;
    project: string;
  };
}

export interface FinancingDetail {
  id: string;
  financingType: string;
  initialAmount: number;
  initialAmountPaid: number;
  initialAmountPending: number;
  interestRate: number;
  quantityCoutes: number;
  totalCouteAmount: number;
  totalPaid: number;
  totalPending: number;
  totalLateFee: number;
  totalLateFeeePending: number;
  totalLateFeePaid: number;
  installments: FinancingDetailInstallment[];
}

export interface FinancingDetailResponse {
  sale: FinancingDetailSale;
  financing: FinancingDetail;
}

// ============ Amendment Types ============

export enum AmendmentInstallmentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
}

export interface AmendmentInstallment {
  numberCuote: number;
  dueDate: string;
  amount: number;
  status: AmendmentInstallmentStatus;
}

export interface CreateAmendmentInput {
  additionalAmount: number;
  observation?: string;
  installments: AmendmentInstallment[];
}

export interface CreateAmendmentResponse {
  success: boolean;
  message: string;
}

// Local state for amendment editing
export interface AmendmentInstallmentLocal {
  id: string; // local id for editing
  numberCuote: number;
  dueDate: string;
  amount: number;
  status: AmendmentInstallmentStatus;
}
