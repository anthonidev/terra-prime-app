"use client";

import { getSales } from "@/lib/actions/sales/sales.action";
import { SalesItem } from "@/types/sales";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface SalesT {
  // Datos del historial
  salesItems: SalesItem[];
  salesLoading: boolean;
  salesError: string | null;
  salesMeta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;

  // Paginación del historial
  currentPage: number;
  itemsPerPage: number;

  // Funciones para controlar la paginación
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;

  // Funciones para recargar datos
  refreshSales: () => Promise<void>;
}

export function useMyMembership(
  initialPage: number = 1,
  initialLimit: number = 10
): SalesT {
  // Estados para el historial
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(true);
  const [salesError, setSalesError] = useState<string | null>(null);
  const [salesMeta, setSalesMeta] = useState<SalesT["salesMeta"]>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para obtener el historial de planes
  const fetchSales = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setSalesLoading(true);
        setSalesError(null);

        const params = {
          page,
          limit,
        };

        const response = await getSales(params);

        setSalesItems(response.items);
        setSalesMeta(response.meta);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al obtener las ventas";

        setSalesError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSalesLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (salesMeta && (page < 1 || page > salesMeta.totalPages)) return;
      setCurrentPage(page);
    },
    [salesMeta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  useEffect(() => {
    fetchSales(currentPage, itemsPerPage);
  }, [fetchSales, currentPage, itemsPerPage]);

  return {
    // Datos del historial
    salesItems,
    salesLoading,
    salesError,
    salesMeta,

    // Paginación
    currentPage,
    itemsPerPage,

    // Funciones
    handlePageChange,
    handleItemsPerPageChange,
    refreshSales: () => fetchSales(currentPage, itemsPerPage),
  };
}
