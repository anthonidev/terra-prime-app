import { apiClient } from '@/shared/lib/api-client';
import type { Invoice, InvoicesListResponse, InvoicesQueryParams } from '../types';

export async function getInvoices(params?: InvoicesQueryParams): Promise<InvoicesListResponse> {
  const response = await apiClient.get<InvoicesListResponse>('/api/invoices', { params });
  return response.data;
}

export async function getInvoiceByPaymentId(paymentId: string): Promise<Invoice | null> {
  try {
    const response = await apiClient.get<Invoice>(`/api/invoices/by-payment/${paymentId}`);
    return response.data;
  } catch {
    return null;
  }
}
