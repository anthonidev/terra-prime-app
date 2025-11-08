'use client';

import { useState, useMemo } from 'react';
import { usePayments } from './use-payments';
import type { PaymentsQueryParams, StatusPayment } from '../types';

export function usePaymentsContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusPayment | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const params: PaymentsQueryParams = useMemo(
    () => ({
      page,
      limit: 20,
      search: search || undefined,
      status,
      startDate,
      endDate,
    }),
    [page, search, status, startDate, endDate]
  );

  const { data, isLoading, isError } = usePayments(params);

  const payments = data?.items ?? [];
  const meta = data?.meta;
  const isEmpty = !isLoading && payments.length === 0;

  return {
    payments,
    meta,
    page,
    search,
    status,
    startDate,
    endDate,
    isLoading,
    isError,
    isEmpty,
    setPage,
    setSearch,
    setStatus,
    setStartDate,
    setEndDate,
  };
}
