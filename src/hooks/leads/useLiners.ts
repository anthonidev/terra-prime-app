import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getLiners,
  createLiner,
  updateLiner,
} from "@/lib/actions/leads/linerActions";
import { DocumentType } from "@/types/leads.types";

interface Liner {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: DocumentType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface PaginatedLiners {
  success: boolean;
  data: Liner[];
  meta: PaginatedMeta;
}

interface MutationState {
  loading: boolean;
  error: Error | null;
}

interface UseLinersProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useLiners({
  initialPage = 1,
  initialLimit = 10,
}: UseLinersProps = {}) {
  // Estados para datos y paginación
  const [data, setData] = useState<PaginatedLiners | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // Estado para la gestión de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLiner, setSelectedLiner] = useState<Liner | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Estado para mutaciones (crear/actualizar)
  const [mutationState, setMutationState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  // Función para obtener datos con filtros
  const fetchLiners = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getLiners({
        search,
        page: currentPage,
        limit: itemsPerPage,
        isActive,
        order,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching liners:", error);
      toast.error("No se pudieron cargar los liners");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, itemsPerPage, isActive, order]);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchLiners();
  }, [fetchLiners]);

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
    setSelectedLiner(null);
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (liner: Liner) => {
    setSelectedLiner(liner);
    setIsUpdateModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedLiner(null);
  };

  // Mutaciones
  const handleCreateLiner = async (data: {
    firstName: string;
    lastName: string;
    document: string;
    documentType: DocumentType;
    isActive?: boolean;
  }) => {
    setMutationState({ loading: true, error: null });
    try {
      const result = await createLiner(data);
      await fetchLiners();
      toast.success("Liner creado correctamente");
      closeModals();
      return result.data;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Error al crear liner");
      setMutationState({ loading: false, error: err });
      toast.error(err.message);
      throw err;
    } finally {
      setMutationState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUpdateLiner = async (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      document?: string;
      documentType?: DocumentType;
      isActive?: boolean;
    }
  ) => {
    setMutationState({ loading: true, error: null });
    try {
      const result = await updateLiner(id, data);
      await fetchLiners();
      toast.success("Liner actualizado correctamente");
      closeModals();
      return result.data;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Error al actualizar liner");
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
    selectedLiner,

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
    handleCreateLiner,
    handleUpdateLiner,

    // Refrescar datos
    refresh: fetchLiners,
  };
}
