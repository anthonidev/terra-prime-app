import { apiClient } from '@/shared/lib/api-client';
import type { PaymentsResponse, PaymentsQueryParams, PaymentDetail } from '../types';

export async function getPayments(params: PaymentsQueryParams = {}): Promise<PaymentsResponse> {
  const { page = 1, limit = 20, ...rest } = params;

  const response = await apiClient.get('/api/payments/list', {
    params: {
      page,
      limit,
      ...rest,
    },
  });

  return response.data;
}

export async function getPaymentDetail(id: string): Promise<PaymentDetail> {
  const response = await apiClient.get(`/api/payments/details/${id}`);
  return response.data;
}
