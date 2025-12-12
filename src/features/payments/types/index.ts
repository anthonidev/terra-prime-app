// Payment Status Enum
export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// Currency Type
export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN',
}

// Basic Types
export interface ReviewByBasic {
  id: string;
  email: string;
}

export interface UserBasic {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  document: string;
}

export interface LeadBasic {
  firstName?: string;
  lastName?: string;
  document?: string;
}

export interface ClientBasic {
  address?: string;
  lead?: LeadBasic;
}

export interface LotBasic {
  name?: string;
  lotPrice?: string;
  block?: string;
  stage?: string;
  project?: string;
}

// Payment Config
export enum PaymentConfigCode {
  SALE_PAYMENT = 'SALE_PAYMENT',
  FINANCING_PAYMENT = 'FINANCING_PAYMENT',
  FINANCING_INSTALLMENTS_PAYMENT = 'FINANCING_INSTALLMENTS_PAYMENT',
  RESERVATION_PAYMENT = 'RESERVATION_PAYMENT',
}

export interface PaymentConfig {
  code: PaymentConfigCode;
  name: string;
  description: string;
}

// Payment Item
export interface Payment {
  id: number;
  amount: number;
  status: StatusPayment;
  createdAt: string;
  reviewedAt?: string | null;
  reviewBy?: ReviewByBasic | null;
  banckName?: string | null;
  dateOperation?: string | null;
  numberTicket?: string | null;
  paymentConfig: PaymentConfig;
  reason?: string | null;
  user: UserBasic;
  currency?: CurrencyType;
  client?: ClientBasic;
  lot?: LotBasic;
}

// Pagination Meta
export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// Payments Response
export interface PaymentsResponse {
  items: Payment[];
  meta: PaginationMeta;
}

// Query Params
export interface PaymentsQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: StatusPayment;
}

// Payment Voucher
export interface PaymentVoucher {
  id: number;
  url: string;
  amount: number;
  bankName: string;
  transactionReference: string;
  transactionDate: string;
  codeOperation?: string;
  isActive: boolean;
}

// Payment Detail
export interface PaymentDetail {
  id: number;
  amount: number;
  status: StatusPayment;
  createdAt: string;
  reviewedAt?: string | null;
  reviewBy?: ReviewByBasic | null;
  banckName?: string | null;
  dateOperation?: string | null;
  numberTicket?: string | null;
  paymentConfig: PaymentConfig;
  reason?: string | null;
  user: UserBasic;
  currency?: CurrencyType;
  client?: ClientBasic;
  lot?: LotBasic;
  vouchers?: PaymentVoucher[];
}

// Mutation Inputs
export interface ApprovePaymentInput {
  dateOperation: string;
  numberTicket?: string;
}

export interface RejectPaymentInput {
  rejectionReason: string;
}

export interface CompletePaymentInput {
  numberTicket: string;
}

export interface UpdateVoucherCodeOperationInput {
  codeOperation: string;
}

// Mutation Responses
export interface ApprovePaymentResponse {
  success: boolean;
  message: string;
}

export interface RejectPaymentResponse {
  success: boolean;
  message: string;
}

export interface CompletePaymentResponse {
  success: boolean;
  message: string;
}

export interface UpdateVoucherCodeOperationResponse {
  success: boolean;
  message: string;
}
