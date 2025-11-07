'use client';

import { SaleType, type SalesFormData } from '../types';

interface UseSaleSummaryProps {
  formData: SalesFormData;
}

export function useSaleSummary({ formData }: UseSaleSummaryProps) {
  const { step1, step2, step3, step4 } = formData;

  // Computed values
  const isFinanced = step2.saleType === SaleType.FINANCED;
  const isDirectPayment = step2.saleType === SaleType.DIRECT_PAYMENT;
  const hasReservation = step2.isReservation;
  const hasGuarantor = !!step4.guarantor;
  const hasSecondaryClients = !!step4.secondaryClients && step4.secondaryClients.length > 0;
  const hasUrbanization = parseFloat(step1.selectedLot!.urbanizationPrice) > 0;
  const hasAmortization = isFinanced && !!step3.amortizationMeta;

  // Currency
  const currency = step1.selectedLot!.projectCurrency;
  const currencyType: 'USD' | 'PEN' = currency === 'USD' ? 'USD' : 'PEN';

  // Prices
  const lotPrice = parseFloat(step1.selectedLot!.lotPrice);
  const urbanizationPrice = parseFloat(step1.selectedLot!.urbanizationPrice);
  const totalPrice = step1.selectedLot!.totalPrice;

  // Sale type label
  const saleTypeLabel = step2.saleType === SaleType.DIRECT_PAYMENT ? 'Pago Directo' : 'Financiado';

  return {
    // Data
    step1,
    step2,
    step3,
    step4,

    // Computed
    isFinanced,
    isDirectPayment,
    hasReservation,
    hasGuarantor,
    hasSecondaryClients,
    hasUrbanization,
    hasAmortization,

    // Currency
    currency,
    currencyType,

    // Prices
    lotPrice,
    urbanizationPrice,
    totalPrice,

    // Labels
    saleTypeLabel,
  };
}
