import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { GetLeadsParams, Lead } from "@/types/leads.types";
import {
  getLeads,
  registerLeadDeparture,
} from "@/lib/actions/leads/leadAction";

// Interfaz para metadatos de paginación
interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// Interfaz para los leads paginados
interface PaginatedLeads {
  success: boolean;
  data: Lead[];
  meta: PaginatedMeta;
}

// Props del hook
interface UseLeadsListProps {
  initialPage?: number;
  initialLimit?: number;
}

/**
 * Hook personalizado para manejar la lista de leads con filtrado y paginación
 */
export function useLeadsList({
  initialPage = 1,
  initialLimit = 10,
}: UseLeadsListProps = {}) {
  // Estados para datos y paginación
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

  // Función para registrar la salida de un lead de la oficina (por ahora vacía)
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

  // Función para obtener datos con filtros
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetLeadsParams = {
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

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Manejadores para paginación y filtros
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
    // Datos y estado
    data,
    loading,
    error,

    // Valores de filtros actuales
    search,
    isInOffice,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    order,

    // Funciones de paginación y filtros
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsInOfficeChange,
    handleDateRangeChange,
    handleOrderChange,
    resetFilters,

    // Acción para registrar salida
    handleRegisterDeparture,

    // Refrescar datos
    refresh: fetchLeads,
  };
}
