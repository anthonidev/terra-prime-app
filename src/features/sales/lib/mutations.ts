import { apiClient } from '@/shared/lib/api-client';
import type {
  CalculateAmortizationInput,
  AmortizationResponse,
  CreateGuarantorClientInput,
  CreateGuarantorClientResponse,
  CreateSaleInput,
  CreatedSaleResponse,
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
