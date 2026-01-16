'use client';

import { useState } from 'react';
import { useInvoices } from './use-invoices';
import type { InvoiceStatus, DocumentType } from '../types';

export function useInvoicesContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<InvoiceStatus | undefined>(undefined);
  const [documentType, setDocumentType] = useState<DocumentType | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useInvoices({
    page,
    limit: 10,
    search: search || undefined,
    status,
    documentType,
    startDate,
    endDate,
  });

  const isEmpty = !isLoading && data?.items.length === 0;
  const meta = data?.meta;

  const clearFilters = () => {
    setSearch('');
    setStatus(undefined);
    setDocumentType(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  };

  const hasFilters = Boolean(search || status || documentType || startDate || endDate);

  return {
    // Data
    invoices: data?.items ?? [],
    meta,
    isEmpty,
    isLoading,
    isError,
    hasFilters,

    // Pagination
    page,
    setPage,

    // Filters
    search,
    setSearch,
    status,
    setStatus,
    documentType,
    setDocumentType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
  };
}
