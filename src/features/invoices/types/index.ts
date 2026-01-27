import type { PaymentDetail } from '@/features/payments/types';

// Document Type Enum (Tipo de comprobante)
export enum DocumentType {
  INVOICE = 1, // Factura
  RECEIPT = 2, // Boleta
  CREDIT_NOTE = 3, // Nota de crédito
  DEBIT_NOTE = 4, // Nota de débito
}

// Document Type Labels for UI
export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.INVOICE]: 'Factura',
  [DocumentType.RECEIPT]: 'Boleta',
  [DocumentType.CREDIT_NOTE]: 'Nota de Crédito',
  [DocumentType.DEBIT_NOTE]: 'Nota de Débito',
};

// Client Document Type Enum (numeric values for API)
export enum ClientDocumentType {
  NO_DOMICILIADO = 0, // No domiciliado (Exportación)
  DNI = 1, // DNI
  FOREIGN_CARD = 4, // Carnet de Extranjería
  RUC = 6, // RUC
  PASSPORT = 7, // Pasaporte
}

// Client Document Type Labels for UI
export const ClientDocumentTypeLabels: Record<ClientDocumentType, string> = {
  [ClientDocumentType.NO_DOMICILIADO]: 'No Domiciliado',
  [ClientDocumentType.DNI]: 'DNI',
  [ClientDocumentType.FOREIGN_CARD]: 'Carnet de Extranjería',
  [ClientDocumentType.RUC]: 'RUC',
  [ClientDocumentType.PASSPORT]: 'Pasaporte',
};

// Invoice Status Enum
export enum InvoiceStatus {
  DRAFT = 'BORRADOR',
  PENDING = 'PENDIENTE',
  SENT = 'ENVIADO',
  ACCEPTED = 'ACEPTADO',
  REJECTED = 'RECHAZADO',
  CANCELLED = 'ANULADO',
}

// Invoice Status Labels for UI
export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: 'Borrador',
  [InvoiceStatus.PENDING]: 'Pendiente',
  [InvoiceStatus.SENT]: 'Enviado',
  [InvoiceStatus.ACCEPTED]: 'Aceptado',
  [InvoiceStatus.REJECTED]: 'Rechazado',
  [InvoiceStatus.CANCELLED]: 'Anulado',
};

// Currency Enum
export enum Currency {
  PEN = 1, // Soles
  USD = 2, // Dólares
}

// Currency Labels for UI
export const CurrencyLabels: Record<Currency, string> = {
  [Currency.PEN]: 'Soles (PEN)',
  [Currency.USD]: 'Dólares (USD)',
};

// User basic type for invoice
export interface InvoiceUserBasic {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// Invoice Interface
export interface Invoice {
  id: number;
  documentType: DocumentType;
  series: string; // Serie (F001, B001, etc.)
  number: number; // Número correlativo
  fullNumber: string; // Serie-Número (F001-123)
  sunatTransaction: number;
  clientDocumentType: ClientDocumentType;
  clientDocumentNumber: string;
  clientName: string;
  clientAddress: string | null;
  clientEmail: string | null;
  currency: Currency;
  totalTaxed: number; // Total gravado
  totalUnaffected: number; // Total inafecto
  totalExonerated: number; // Total exonerado
  totalFree: number; // Total gratuito
  totalDiscounts: number; // Total descuentos
  totalIgv: number; // Total IGV
  total: number; // Total final
  createdBy: InvoiceUserBasic;
  status: InvoiceStatus;
  sendAutomaticallyToSunat: boolean;
  sendAutomaticallyToClient: boolean;
  pdfUrl: string | null; // URL del PDF generado
  xmlUrl: string | null; // URL del XML
  cdrUrl: string | null; // URL del CDR
  sunatAccepted: string | null; // "1" = Aceptado
  sunatDescription: string | null;
  sunatNote: string | null;
  sunatResponseCode: string | null;
  sunatSoapError: string | null;
  uniqueCode: string | null;
  pdfFormat: string;
  observations: string | null;
  issueDate: string | null;
  dueDate: string | null;
  notes: Invoice[] | null;
  noteReasonCode: string | null;
  noteReasonDescription: string | null;
  payment: PaymentDetail;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// Create Invoice Input
export interface CreateInvoiceInput {
  documentType: DocumentType;
  clientDocumentType: ClientDocumentType;
  clientDocumentNumber: string;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  paymentId: number;
  observations?: string;
}

// Create Invoice Response
export interface CreateInvoiceResponse {
  success: boolean;
  message: string;
  data: Invoice;
}

// Get Invoice by Payment Response (can be null if no invoice exists)
export type GetInvoiceByPaymentResponse = Invoice | null;

// Invoice Item (line item in invoice)
export interface InvoiceItem {
  id: number;
  unitOfMeasure: string;
  code: string;
  description: string;
  quantity: number;
  unitValue: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  igvType: number;
  igv: number;
  total: number;
}

// Invoice List Item (extended invoice with items array)
export interface InvoiceListItem extends Omit<Invoice, 'clientDocumentType'> {
  clientDocumentType: string; // API returns as string ("6", "1", etc.)
  items: InvoiceItem[];
}

// Pagination Meta
export interface InvoicePaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// Invoices List Response
export interface InvoicesListResponse {
  items: InvoiceListItem[];
  meta: InvoicePaginationMeta;
}

// Invoices Query Params
export interface InvoicesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
  documentType?: DocumentType;
  startDate?: string;
  endDate?: string;
}

// Debit Note Type Enum
export enum DebitNoteType {
  LATE_FEE_INTEREST = 1, // Intereses por mora
  VALUE_INCREASE = 2, // Aumento de valor
  PENALTIES = 3, // Penalidades
  IVAP_ADJUSTMENTS = 4, // Ajustes afectos al IVAP
  EXPORT_ADJUSTMENTS = 5, // Ajustes de operaciones de exportación
}

// Debit Note Type Labels
export const DebitNoteTypeLabels: Record<DebitNoteType, string> = {
  [DebitNoteType.LATE_FEE_INTEREST]: 'Intereses por mora',
  [DebitNoteType.VALUE_INCREASE]: 'Aumento de valor',
  [DebitNoteType.PENALTIES]: 'Penalidades',
  [DebitNoteType.IVAP_ADJUSTMENTS]: 'Ajustes afectos al IVAP',
  [DebitNoteType.EXPORT_ADJUSTMENTS]: 'Ajustes de operaciones de exportación',
};

// Credit Note Type Enum
export enum CreditNoteType {
  CANCELLATION = 1, // Anulación de la operación
  CANCELLATION_RUC_ERROR = 2, // Anulación por error en el RUC
  DESCRIPTION_CORRECTION = 3, // Corrección por error en la descripción
  GLOBAL_DISCOUNT = 4, // Descuento global
  ITEM_DISCOUNT = 5, // Descuento por ítem
  TOTAL_RETURN = 6, // Devolución total
  ITEM_RETURN = 7, // Devolución por ítem
  BONUS = 8, // Bonificación
  VALUE_DECREASE = 9, // Disminución en el valor
  OTHER_CONCEPTS = 10, // Otros conceptos
  IVAP_ADJUSTMENTS = 11, // Ajustes afectos al IVAP
  EXPORT_ADJUSTMENTS = 12, // Ajustes de operaciones de exportación
  PAYMENT_ADJUSTMENTS = 13, // Ajustes - Montos y/o fechas de pago
}

// Credit Note Type Labels
export const CreditNoteTypeLabels: Record<CreditNoteType, string> = {
  [CreditNoteType.CANCELLATION]: 'Anulación de la operación',
  [CreditNoteType.CANCELLATION_RUC_ERROR]: 'Anulación por error en el RUC',
  [CreditNoteType.DESCRIPTION_CORRECTION]: 'Corrección por error en la descripción',
  [CreditNoteType.GLOBAL_DISCOUNT]: 'Descuento global',
  [CreditNoteType.ITEM_DISCOUNT]: 'Descuento por ítem',
  [CreditNoteType.TOTAL_RETURN]: 'Devolución total',
  [CreditNoteType.ITEM_RETURN]: 'Devolución por ítem',
  [CreditNoteType.BONUS]: 'Bonificación',
  [CreditNoteType.VALUE_DECREASE]: 'Disminución en el valor',
  [CreditNoteType.OTHER_CONCEPTS]: 'Otros conceptos',
  [CreditNoteType.IVAP_ADJUSTMENTS]: 'Ajustes afectos al IVAP',
  [CreditNoteType.EXPORT_ADJUSTMENTS]: 'Ajustes de operaciones de exportación',
  [CreditNoteType.PAYMENT_ADJUSTMENTS]: 'Ajustes - Montos y/o fechas de pago',
};

// Create Debit Note Input
export interface CreateDebitNoteInput {
  relatedInvoiceId: number;
  amount: number;
  debitNoteType: DebitNoteType;
  chargeDescription?: string;
  observations?: string;
}

// Create Credit Note Input
export interface CreateCreditNoteInput {
  relatedInvoiceId: number;
  creditNoteType: CreditNoteType;
  reasonDescription?: string;
}

// Create Note Response
export interface CreateNoteResponse {
  success: boolean;
  message: string;
  data: Invoice;
}
