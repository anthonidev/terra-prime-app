// ============================================================
// TIPOS DE DATOS - API de Ventas (Rol VEN - Vendedor)
// ============================================================
// Estos tipos representan las estructuras de datos que devuelve
// y recibe la API del backend.
// ============================================================

// ========== ENTIDADES BASE ==========

export interface Project {
  id: string;
  name: string;
  currency: string;
  logo: string;
  logoPublicId: string;
  projectCode: string;
  createdAt: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProjectBlock {
  id: string;
  name: string;
  createdAt: string;
}

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

// ========== ENUMS ==========

export enum DocumentType {
  DNI = 'DNI',
  RUC = 'RUC',
  CE = 'CE',
  PASSPORT = 'Pasaporte',
}

export enum SaleType {
  DIRECT_PAYMENT = 'DIRECT_PAYMENT', // Pago directo / Contado
  FINANCED = 'FINANCED', // Financiado
}

export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN',
}

export enum StatusSale {
  // === Estados de Reserva ===
  RESERVATION_PENDING = 'RESERVATION_PENDING',
  RESERVATION_PENDING_APPROVAL = 'RESERVATION_PENDING_APPROVAL',
  RESERVATION_IN_PAYMENT = 'RESERVATION_IN_PAYMENT',
  RESERVED = 'RESERVED',

  // === Estados de Venta Directa ===
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  IN_PAYMENT = 'IN_PAYMENT',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',

  // === Estados de Venta Financiada ===
  IN_PAYMENT_PROCESS = 'IN_PAYMENT_PROCESS',

  // === Estados Finales ===
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum StatusFinancingInstallments {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID',
}

// ========== PAGINACION ==========

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ========== QUERY PARAMS ==========

export interface LotsQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  stageId?: string;
  blockId?: string;
  term?: string;
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

// ========== CLIENTE ==========

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

// ========== AMORTIZACION (para creacion de venta financiada) ==========

export interface InterestRateSection {
  startInstallment: number;
  endInstallment: number;
  interestRate: number;
}

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

// ========== INPUTS DE CREACION ==========

export interface CalculateAmortizationInput {
  totalAmount: number;
  initialAmount: number;
  reservationAmount?: number;
  interestRateSections: InterestRateSection[];
  firstPaymentDate: string;
  includeDecimals?: boolean;
  totalAmountHu?: number;
  numberOfPaymentsHu?: number;
  firstPaymentDateHu?: string;
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

export interface CreateGuarantorClientResponse {
  clientId: number;
  guarantorId?: number;
  secondaryClientIds?: number[];
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
  interestRateSections?: InterestRateSection[];
  quantitySaleCoutes?: number;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  isReservation?: boolean;
  combinedInstallments?: CombinedInstallment[];
}

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

// ========== MIS VENTAS (Listado) ==========

export interface MySale {
  id: string;
  type: SaleType;
  totalAmount: string;
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
    document: string;
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
    interestRateSections?: InterestRateSection[] | null;
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

// ========== DETALLE DE VENTA ==========

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
  isParked: boolean;
}

export interface SaleDetailFinancingItem {
  id: string;
  financingType: string;
  initialAmount: number;
  initialAmountPaid: number;
  initialAmountPending: number;
  interestRate: number;
  interestRateSections?: InterestRateSection[] | null;
  quantityCoutes: number;
  totalCouteAmount: number;
  totalPaid: number;
  totalPending: number;
  totalLateFee: number;
  totalLateFeeePending: number;
  totalLateFeePaid: number;
  installments: SaleDetailInstallment[];
}

export interface SaleDetailFinancing {
  lot: SaleDetailFinancingItem;
  hu?: SaleDetailFinancingItem;
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
  reservationAmountPending?: number;
  maximumHoldPeriod?: number;
  fromReservation?: boolean;
  totalToPay?: number;
  totalAmountPaid?: number;
  initialToPay?: number;
  initialAmountPaid?: number;
  client: ClientInfo & {
    reportPdfUrl: string | null;
    document?: string;
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

// ========== REGISTRAR PAGO ==========

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

// ========== DETALLE DE FINANCIAMIENTO ==========

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
  currency: CurrencyType;
  totalAmount: number;
  totalAmountPaid: number;
  reservationAmount: number;
  reservationAmountPaid: number;
  reservationAmountPending: number;
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
  interestRateSections?: InterestRateSection[] | null;
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
