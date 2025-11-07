import { DocumentType, SaleType } from '../types';

// Sale type options for select inputs
export const SALE_TYPE_OPTIONS = [
  { value: SaleType.DIRECT_PAYMENT, label: 'Pago Directo' },
  { value: SaleType.FINANCED, label: 'Financiado' },
] as const;

// Document type options for select inputs
export const DOCUMENT_TYPE_OPTIONS = [
  { value: DocumentType.DNI, label: 'DNI' },
  { value: DocumentType.RUC, label: 'RUC' },
  { value: DocumentType.CE, label: 'Carnet de Extranjería' },
  { value: DocumentType.PASSPORT, label: 'Pasaporte' },
] as const;

// Default values for financing
export const DEFAULT_INTEREST_RATE = 12;
export const DEFAULT_HU_INSTALLMENTS = 12;
export const DEFAULT_SALE_INSTALLMENTS = 12;

// Query keys for React Query
export const SALES_QUERY_KEYS = {
  projectLots: (blockId: string) => ['sales', 'project-lots', blockId] as const,
  clientByDocument: (document: string) => ['sales', 'client-by-document', document] as const,
  amortization: (input: string) => ['sales', 'amortization', input] as const,
} as const;
