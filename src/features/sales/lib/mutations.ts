import { apiClient } from '@/shared/lib/api-client';
import type {
  CalculateAmortizationInput,
  AmortizationResponse,
  CreateGuarantorClientInput,
  CreateGuarantorClientResponse,
  CreateSaleInput,
  CreatedSaleResponse,
  RegisterPaymentInput,
  PaymentResponse,
  AssignSaleParticipantsInput,
  AssignParticipantsResponse,
  GeneratePdfResponse,
} from '../types';

// Calculate amortization schedule
export async function calculateAmortization(
  input: CalculateAmortizationInput
): Promise<AmortizationResponse> {
  const response = await apiClient.post<AmortizationResponse>(
    '/api/sales/financing/calculate-amortization',
    input
  );
  return response.data;
}

// Create guarantor client
export async function createGuarantorClient(
  input: CreateGuarantorClientInput
): Promise<CreateGuarantorClientResponse> {
  const response = await apiClient.post<CreateGuarantorClientResponse>(
    '/api/sales/clients/guarantors/create',
    input
  );
  return response.data;
}

// Create sale
export async function createSale(input: CreateSaleInput): Promise<CreatedSaleResponse> {
  const response = await apiClient.post<CreatedSaleResponse>('/api/sales', input);
  return response.data;
}

// Register payment
export async function registerPayment(
  id: string,
  data: RegisterPaymentInput
): Promise<PaymentResponse> {
  const formData = new FormData();
  formData.append('payments', JSON.stringify(data.payments));
  data.files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<PaymentResponse>(
    `/api/sales/payments/sale/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

// Assign participants to sale
export async function assignParticipantsToSale(
  saleId: string,
  data: AssignSaleParticipantsInput
): Promise<AssignParticipantsResponse> {
  const response = await apiClient.post<AssignParticipantsResponse>(
    `/api/assign/participants/${saleId}`,
    { saleId, assignParticipantsDto: data }
  );
  return response.data;
}

// Generate radication PDF
export async function generateRadicationPdf(saleId: string): Promise<GeneratePdfResponse> {
  const response = await apiClient.post<GeneratePdfResponse>(
    `/api/radication/generate/${saleId}`
  );
  return response.data;
}

// Regenerate radication PDF
export async function regenerateRadicationPdf(saleId: string): Promise<GeneratePdfResponse> {
  const response = await apiClient.post<GeneratePdfResponse>(
    `/api/radication/regenerate/${saleId}`
  );
  return response.data;
}

// Generate payment accord PDF
export async function generatePaymentAccordPdf(saleId: string): Promise<GeneratePdfResponse> {
  const response = await apiClient.post<GeneratePdfResponse>(
    `/api/reports-payment-acord/generate/${saleId}`
  );
  return response.data;
}

// Regenerate payment accord PDF
export async function regeneratePaymentAccordPdf(saleId: string): Promise<GeneratePdfResponse> {
  const response = await apiClient.post<GeneratePdfResponse>(
    `/api/reports-payment-acord/regenerate/${saleId}`
  );
  return response.data;
}
