'use client';

import { useMemo } from 'react';
import { useSaleDetail } from './use-sale-detail';
import type { StatusSale } from '../types';

export function useSaleDetailContainer(id: string) {
  const { data, isLoading, isError } = useSaleDetail(id);

  // Computed values
  const clientName = useMemo(() => {
    if (!data) return '';
    return `${data.client.firstName} ${data.client.lastName}`;
  }, [data]);

  const totalPaid = useMemo(() => {
    if (!data?.paymentsSummary) return 0;
    return data.paymentsSummary.reduce((sum, payment) => {
      if (payment.status === 'APPROVED') {
        return sum + payment.amount;
      }
      return sum;
    }, 0);
  }, [data?.paymentsSummary]);

  const pendingAmount = useMemo(() => {
    if (!data) return 0;
    return data.totalAmount - totalPaid;
  }, [data, totalPaid]);

  const hasPayments = data?.paymentsSummary && data.paymentsSummary.length > 0;

  return {
    // Data
    sale: data,
    clientName,
    totalPaid,
    pendingAmount,
    hasPayments,
    status: data?.status as StatusSale | undefined,

    // State
    isLoading,
    isError,
  };
}
