'use client';

import { useState } from 'react';
import { useAllSales } from './use-all-sales';

export function useAdminSalesContainer() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  const { data, isLoading, isError } = useAllSales({ page, limit: 20, order });

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
    totalPages: data?.meta?.totalPages || 0,
    totalItems: data?.meta?.totalItems || 0,

    // State
    page,
    order,
    isLoading,
    isError,
    isEmpty,

    // Actions
    handlePageChange,
    handleOrderChange,
    toggleOrder,
  };
}
