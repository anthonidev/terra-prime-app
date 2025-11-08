import { apiClient } from '@/shared/lib/api-client';
import type { ApprovePaymentResponse, RejectPaymentResponse } from '../types';

export async function approvePayment(id: string): Promise<ApprovePaymentResponse> {
  const response = await apiClient.post(`/payments/approve/${id}`);
  return response.data;
}

export async function rejectPayment(id: string): Promise<RejectPaymentResponse> {
  const response = await apiClient.post(`/payments/reject/${id}`);
  return response.data;
}
