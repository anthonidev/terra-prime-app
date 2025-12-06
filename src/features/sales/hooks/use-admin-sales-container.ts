'use client';

import { useState } from 'react';
import { useAllSales } from './use-all-sales';
import type { StatusSale, SaleType } from '../types';

export function useAdminSalesContainer() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [status, setStatus] = useState<StatusSale | undefined>(undefined);
  const [type, setType] = useState<SaleType | undefined>(undefined);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [clientName, setClientName] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useAllSales({
    page,
    limit: 20,
    order,
    status,
    type,
    projectId,
    clientName,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOrderChange = (newOrder: 'ASC' | 'DESC') => {
    setOrder(newOrder);
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  const isEmpty = !isLoading && data?.items && data.items.length === 0;

  return {
    // Data
    sales: data?.items || [],
    meta: data?.meta || {
      currentPage: page,
      itemsPerPage: 20,
      totalItems: 0,
      totalPages: 0,
    },

    // State
    page,
    order,
    status,
    type,
    projectId,
    clientName,
    isLoading,
    isError,
    isEmpty,

    // Actions
    handlePageChange,
    handleOrderChange,
    toggleOrder,
    setStatus,
    setType,
    setProjectId,
    setClientName,
  };
}
