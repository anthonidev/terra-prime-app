import {
  getLeads,
  registerLeadDeparture,
} from "@/lib/actions/leads/leadAction";
import { Lead } from "@/types/leads.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
interface PaginatedLeads {
  success: boolean;
  data: Lead[];
  meta: PaginatedMeta;
}
interface UseLeadsListProps {
  initialPage?: number;
  initialLimit?: number;
}
export function useLeadsList({
  initialPage = 1,
  initialLimit = 10,
}: UseLeadsListProps = {}) {
  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isInOffice, setIsInOffice] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [error, setError] = useState<string | null>(null);
  const handleRegisterDeparture = async (leadId: string): Promise<boolean> => {
    try {
      setError(null);
      await registerLeadDeparture(leadId);
      await fetchLeads();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al registrar salida del lead";
      console.error(errorMessage, err);
      setError(errorMessage);
      return false;
    }
  };
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search: search || undefined,
        isInOffice,
        startDate,
        endDate,
        page: currentPage,
        limit: itemsPerPage,
        order,
      };
      const result = await getLeads(params);
      setData(result);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("No se pudieron cargar los leads");
      toast.error("Error al cargar los leads");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    isInOffice,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    order,
  ]);
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleIsInOfficeChange = (value: boolean | undefined) => {
    setIsInOffice(value);
    setCurrentPage(1);
  };
  const handleOrderChange = (value: "ASC" | "DESC") => {
    setOrder(value);
    setCurrentPage(1);
  };
  const handleDateRangeChange = (start?: string, end?: string) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setSearch("");
    setIsInOffice(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setOrder("DESC");
    setCurrentPage(1);
  };
  return {
    data,
    loading,
    error,
    search,
    isInOffice,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    order,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsInOfficeChange,
    handleDateRangeChange,
    handleOrderChange,
    resetFilters,
    handleRegisterDeparture,
    refresh: fetchLeads,
  };
}
