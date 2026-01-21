import { apiClient } from '@/shared/lib/api-client';
import type {
  ApprovePaymentInput,
  ApprovePaymentResponse,
  CancelPaymentInput,
  CancelPaymentResponse,
  CompletePaymentInput,
  CompletePaymentResponse,
  RejectPaymentInput,
  RejectPaymentResponse,
  UpdateVoucherCodeOperationInput,
  UpdateVoucherCodeOperationResponse,
  UpdateVoucherInput,
  UpdateVoucherResponse,
} from '../types';

export async function approvePayment(
  id: string,
  data: ApprovePaymentInput
): Promise<ApprovePaymentResponse> {
  const response = await apiClient.post(`/api/payments/approve/${id}`, data);
  return response.data;
}

export async function rejectPayment(
  id: string,
  data: RejectPaymentInput
): Promise<RejectPaymentResponse> {
  const response = await apiClient.post(`/api/payments/reject/${id}`, data);
  return response.data;
}

export async function completePayment(
  id: string,
  data: CompletePaymentInput
): Promise<CompletePaymentResponse> {
  const response = await apiClient.patch(`/api/payments/complete-payment/${id}`, data);
  return response.data;
}

export async function updateVoucherCodeOperation(
  id: number,
  data: UpdateVoucherCodeOperationInput
): Promise<UpdateVoucherCodeOperationResponse> {
  const response = await apiClient.patch(`/api/payments/details/${id}/code-operation`, data);
  return response.data;
}

export async function updateVoucher(
  id: number,
  data: UpdateVoucherInput
): Promise<UpdateVoucherResponse> {
  const response = await apiClient.patch(`/api/payments/details/${id}`, data);
  return response.data;
}

export async function cancelPayment(
  id: string,
  data: CancelPaymentInput
): Promise<CancelPaymentResponse> {
  const response = await apiClient.post(`/api/payments/cancel-installment/${id}`, data);
  return response.data;
}
