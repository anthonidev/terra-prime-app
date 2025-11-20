'use client';

import { useMemo } from 'react';
import { useSaleDetail } from './use-sale-detail';
import { StatusSale, SaleType } from '../types';
import type { StatusSale as StatusSaleType } from '../types';

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

  // Calculate maximum payable amount based on status and sale type
  const maxPayableAmount = useMemo(() => {
    if (!data) return 0;

    const status = data.status as StatusSaleType;
    const saleType = data.type;

    // RESERVATION_PENDING: max payment is reservation amount
    if (status === StatusSale.RESERVATION_PENDING) {
      return Math.max(0, (data.reservationAmount || 0) - totalPaid);
    }

    // PENDING or RESERVED: depends on sale type
    if (status === StatusSale.PENDING || status === StatusSale.RESERVED) {
      // Direct payment: max payment is total lot price
      if (saleType === SaleType.DIRECT_PAYMENT) {
        return Math.max(0, data.totalAmount - totalPaid);
      }

      // Financed: max payment is initial amount
      if (saleType === SaleType.FINANCED) {
        const initialAmount = data.financing?.lot.initialAmount || 0;
        return Math.max(0, initialAmount - totalPaid);
      }
    }

    // For all other statuses, no payment allowed (return 0)
    return 0;
  }, [data, totalPaid]);

  const hasPayments = data?.paymentsSummary && data.paymentsSummary.length > 0;

  return {
    // Data
    sale: data,
    clientName,
    totalPaid,
    pendingAmount,
    maxPayableAmount,
    hasPayments,
    status: data?.status as StatusSaleType | undefined,

    // State
    isLoading,
    isError,
  };
}
