import { apiClient } from '@/shared/lib/api-client';
import type { CreateInvoiceInput, Invoice } from '../types';

export async function createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
  const response = await apiClient.post<Invoice>('/api/invoices', data);
  return response.data;
}
