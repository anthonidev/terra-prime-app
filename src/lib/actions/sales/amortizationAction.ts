'use server';

import { httpClient } from '@/lib/api/http-client';
import { AmortizationDTO, AmortizationResponse } from '@/types/sales';

export async function calculateAmortization(data: AmortizationDTO): Promise<AmortizationResponse> {
  try {
    return await httpClient<AmortizationResponse>('/api/sales/financing/calculate-amortization', {
      method: 'POST',
      body: {
        totalAmount: data.totalAmount,
        initialAmount: data.initialAmount,
        reservationAmount: data.reservationAmount,
        interestRate: data.interestRate,
        numberOfPayments: data.numberOfPayments,
        firstPaymentDate: data.firstPaymentDate,
        includeDecimals: data.includeDecimals
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
