'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import { assignLeadsToVendor, getLeadsOfDay } from '@infrastructure/server-actions/sales.actions';
import { Meta } from '@infrastructure/types/pagination.types';
import { AssignLeadsToVendorDTO } from '@application/dtos/bienvenidos.dto';

interface UseBienvenidosReturn {
  data: LeadsOfDay[];
  loading: boolean;
  error: string | null;
  meta: Meta | null;
  currentPage: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  refreshData: () => Promise<void>;
  assignLeads: (data: AssignLeadsToVendorDTO) => Promise<LeadsOfDay[]>;
}

export function useBienvenidos(
  initialPage: number = 1,
  initialLimit: number = 10
): UseBienvenidosReturn {
  const [state, setState] = useState<{
    data: LeadsOfDay[];
    loading: boolean;
    error: string | null;
    meta: Meta | null;
    currentPage: number;
    itemsPerPage: number;
  }>({
    data: [],
    loading: true,
    error: null,
    meta: null,
    currentPage: initialPage,
    itemsPerPage: initialLimit
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await getLeadsOfDay({
        page: state.currentPage,
        limit: state.itemsPerPage
      });

      setState((prev) => ({
        ...prev,
        data: response.items,
        meta: response.meta,
        currentPage: response.meta.currentPage,
        itemsPerPage: response.meta.itemsPerPage
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al obtener las ventas';

      setState((prev) => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.currentPage, state.itemsPerPage]);

  const assignLeads = useCallback(
    async (data: AssignLeadsToVendorDTO): Promise<LeadsOfDay[]> => {
      try {
        const response = await assignLeadsToVendor(data);
        toast.success('Asignado correctamente');
        await fetchData();
        return response;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al asignar leads:', error.message);
          toast.error('Error al asignar leads');
        }
        throw error;
      }
    },
    [fetchData]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (state.meta && (page < 1 || page > state.meta.totalPages)) return;
      setState((prev) => ({ ...prev, currentPage: page }));
    },
    [state.meta]
  );

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setState((prev) => ({
      ...prev,
      itemsPerPage: limit,
      currentPage: 1
    }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    meta: state.meta,
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshData: fetchData,
    assignLeads
  };
}
