import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getLeadSources,
  createLeadSource,
  updateLeadSource,
} from "@/lib/actions/leads/leadSourceActions";

interface LeadSource {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface PaginatedLeadSources {
  success: boolean;
  data: LeadSource[];
  meta: PaginatedMeta;
}

interface MutationState {
  loading: boolean;
  error: Error | null;
}

interface UseLeadSourcesProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useLeadSources({
  initialPage = 1,
  initialLimit = 10,
}: UseLeadSourcesProps = {}) {
  // Estados para datos y paginación
  const [data, setData] = useState<PaginatedLeadSources | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // Estado para la gestión de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadSource, setSelectedLeadSource] =
    useState<LeadSource | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Estado para mutaciones (crear/actualizar)
  const [mutationState, setMutationState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  // Función para obtener datos con filtros
  const fetchLeadSources = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getLeadSources({
        search,
        page: currentPage,
        limit: itemsPerPage,
        isActive,
        order,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching lead sources:", error);
      toast.error("No se pudieron cargar las fuentes de leads");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, itemsPerPage, isActive, order]);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchLeadSources();
  }, [fetchLeadSources]);

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

  const handleIsActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    setCurrentPage(1);
  };

  const handleOrderChange = (value: "ASC" | "DESC") => {
    setOrder(value);
    setCurrentPage(1);
  };

  // Manejadores para modales
  const openCreateModal = () => {
    setSelectedLeadSource(null);
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (leadSource: LeadSource) => {
    setSelectedLeadSource(leadSource);
    setIsUpdateModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedLeadSource(null);
  };

  // Mutaciones
  const handleCreateLeadSource = async (data: {
    name: string;
    description?: string;
    isActive?: boolean;
  }) => {
    setMutationState({ loading: true, error: null });
    try {
      const result = await createLeadSource(data);
      await fetchLeadSources();
      toast.success("Fuente de lead creada correctamente");
      closeModals();
      return result.data;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Error al crear fuente de lead");
      setMutationState({ loading: false, error: err });
      toast.error(err.message);
      throw err;
    } finally {
      setMutationState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUpdateLeadSource = async (
    id: number,
    data: { name?: string; description?: string; isActive?: boolean }
  ) => {
    setMutationState({ loading: true, error: null });
    try {
      const result = await updateLeadSource(id, data);
      await fetchLeadSources();
      toast.success("Fuente de lead actualizada correctamente");
      closeModals();
      return result.data;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Error al actualizar fuente de lead");
      setMutationState({ loading: false, error: err });
      toast.error(err.message);
      throw err;
    } finally {
      setMutationState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    // Datos y estado
    data,
    loading,
    search,
    currentPage,
    itemsPerPage,
    isActive,
    order,
    mutationLoading: mutationState.loading,
    mutationError: mutationState.error,

    // Estado de los modales
    isCreateModalOpen,
    isUpdateModalOpen,
    selectedLeadSource,

    // Funciones de paginación y filtros
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,

    // Funciones de modales
    openCreateModal,
    openUpdateModal,
    closeModals,

    // Mutaciones
    handleCreateLeadSource,
    handleUpdateLeadSource,

    // Refrescar datos
    refresh: fetchLeadSources,
  };
}
