'use client';

import { assignLeadsToVendor, getLeadsByDay } from '@/lib/actions/sales/bienvenidosAction';
import { AssignLeadsToVendorDto, LeadsByDayItem } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TData {
  data: LeadsByDayItem[];
  dataLoading: boolean;
  dataError: string | null;

  dataMeta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;

  currentPage: number;
  dataPerPage: number;

  handlePageChange: (page: number) => void;
  handleDataPerPageChange: (pageSize: number) => void;

  refreshData: () => Promise<void>;
  handleAssignVendor: (data: AssignLeadsToVendorDto) => Promise<LeadsByDayItem[]>;
}

export function useBienvenidos(initialPage: number = 1, initialLimit: number = 10): TData {
  const [data, setDataItems] = useState<LeadsByDayItem[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataMeta, setDataMeta] = useState<TData['dataMeta']>(null);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [dataPerPage, setDataPerPage] = useState<number>(initialLimit);

  const fetchData = useCallback(
    async (page: number = currentPage, limit: number = dataPerPage) => {
      try {
        setDataLoading(true);
        setDataError(null);

        const params = {
          page,
          limit
        };

        const response = await getLeadsByDay(params);

        setDataItems(response.items);
        setDataMeta(response.meta);

        setCurrentPage(response.meta.currentPage);
        setDataPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido al obtener las ventas';

        setDataError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setDataLoading(false);
      }
    },
    [currentPage, dataPerPage]
  );

  const handleAssignVendor = async (data: AssignLeadsToVendorDto): Promise<LeadsByDayItem[]> => {
    try {
      const response = await assignLeadsToVendor(data);
      toast.success('Asignado correctamente');
      await fetchData();
      return response;
    } catch (error) {
      if (error instanceof Error) console.log('Has been error, reason: %s', error.message);
      throw error;
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      if (dataMeta && (page < 1 || page > dataMeta.totalPages)) return;
      setCurrentPage(page);
    },
    [dataMeta]
  );

  const handleDataPerPageChange = useCallback((limit: number) => {
    setDataPerPage(limit);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchData(currentPage, dataPerPage);
  }, [fetchData, currentPage, dataPerPage]);

  return {
    data,
    dataLoading,
    dataError,
    dataMeta,

    currentPage,
    dataPerPage,

    handlePageChange,
    handleDataPerPageChange,
    refreshData: () => fetchData(currentPage, dataPerPage),
    handleAssignVendor
  };
}
