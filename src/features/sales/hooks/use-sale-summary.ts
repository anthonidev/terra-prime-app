'use client';

import { SaleType, type SalesFormData } from '../types';

interface UseSaleSummaryProps {
  formData: SalesFormData;
}

export function useSaleSummary({ formData }: UseSaleSummaryProps) {
  const { step1, step2, step3, step4 } = formData;

  const isParking = step1.saleTarget === 'parking';

  // Computed values
  const isFinanced = step2.saleType === SaleType.FINANCED;
  const isDirectPayment = step2.saleType === SaleType.DIRECT_PAYMENT;
  const hasReservation = step2.isReservation;
  const hasGuarantor = !!step4.guarantor;
  const hasSecondaryClients = !!step4.secondaryClients && step4.secondaryClients.length > 0;
  const hasUrbanization = isParking
    ? false
    : parseFloat(step1.selectedLot?.urbanizationPrice || '0') > 0;
  const hasAmortization = isFinanced && !!step3.amortizationMeta;

  // Currency
  const currency = isParking
    ? step1.projectCurrency
    : step1.selectedLot?.projectCurrency || step1.projectCurrency;
  const currencyType: 'USD' | 'PEN' = currency === 'USD' ? 'USD' : 'PEN';

  // Prices
  const lotPrice = isParking
    ? parseFloat(step1.selectedParking?.price || '0')
    : parseFloat(step1.selectedLot?.lotPrice || '0');
  const urbanizationPrice = isParking ? 0 : parseFloat(step1.selectedLot?.urbanizationPrice || '0');
  const totalPrice = isParking
    ? parseFloat(step1.selectedParking?.price || '0')
    : step1.selectedLot?.totalPrice || 0;

  // Sale type label
  const saleTypeLabel = step2.saleType === SaleType.DIRECT_PAYMENT ? 'Pago Directo' : 'Financiado';

  return {
    // Data
    step1,
    step2,
    step3,
    step4,

    // Computed
    isParking,
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
