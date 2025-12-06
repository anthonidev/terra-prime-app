'use client';

import { useState } from 'react';
import { useMySales } from './use-my-sales';
import { type SaleType, type StatusSale } from '../types';

export function useMySalesContainer() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  /* Filters */
  const [status, setStatus] = useState<StatusSale | undefined>();
  const [type, setType] = useState<SaleType | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [clientName, setClientName] = useState<string | undefined>();

  const { data, isLoading, isError } = useMySales({
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
    setPage, // Exposing setPage directly as well if needed or rely on handlePageChange
    handlePageChange,
    handleOrderChange,
    toggleOrder,
    setStatus,
    setType,
    setProjectId,
    setClientName,
  };
}
