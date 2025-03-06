import { createBlock, updateBlock } from "@/lib/actions/projects/blocksAction";
import { createLot, updateLot } from "@/lib/actions/projects/lotsActions";
import {
  getProjectDetail,
  getProjectLots,
  updateProjectWithImage,
} from "@/lib/actions/projects/projectActions";
import { createStage, updateStage } from "@/lib/actions/projects/stagesActions";
import {
  LotResponseDto,
  LotStatus,
  ProjectDetailDto,
  UpdateProjectDto,
} from "@/types/project.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseProjectProps {
  projectId: string;
}

interface UseProjectReturn {
  projectDetail: ProjectDetailDto | null;
  lots: LotResponseDto[];
  totalLots: number;
  totalPages: number;
  currentPage: number;
  isLoadingDetail: boolean;
  isLoadingLots: boolean;
  isUpdating: boolean;
  error: string | null;

  filters: Record<string, unknown>;

  fetchProjectDetail: () => Promise<void>;
  fetchProjectLots: (newFilters?: Record<string, unknown>) => Promise<void>;
  setFilters: (newFilters: Record<string, unknown>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;

  updateProject: (
    data: UpdateProjectDto,
    logoFile?: File | null
  ) => Promise<ProjectDetailDto | null>;

  getLotsByStage: (stageId: string) => LotResponseDto[];
  getLotsByBlock: (blockId: string) => LotResponseDto[];
  getLotsByStatus: (status: LotStatus) => LotResponseDto[];

  createProjectStage: (data: {
    name: string;
    isActive?: boolean;
  }) => Promise<void>;
  updateProjectStage: (
    stageId: string,
    data: { name?: string; isActive?: boolean }
  ) => Promise<void>;

  createProjectBlock: (data: {
    name: string;
    isActive?: boolean;
    stageId: string;
  }) => Promise<void>;
  updateProjectBlock: (
    blockId: string,
    data: { name?: string; isActive?: boolean }
  ) => Promise<void>;

  createProjectLot: (data: {
    name: string;
    area: number;
    lotPrice: number;
    urbanizationPrice?: number;
    status?: LotStatus;
    blockId: string;
  }) => Promise<void>;

  updateProjectLot: (
    lotId: string,
    data: {
      name?: string;
      area?: number;
      lotPrice?: number;
      urbanizationPrice?: number;
      status?: LotStatus;
    }
  ) => Promise<void>;
}

export function useProject({ projectId }: UseProjectProps): UseProjectReturn {
  const [projectDetail, setProjectDetail] = useState<ProjectDetailDto | null>(
    null
  );
  const [lots, setLots] = useState<LotResponseDto[]>([]);
  const [totalLots, setTotalLots] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(true);
  const [isLoadingLots, setIsLoadingLots] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<Record<string, unknown>>({
    page: 1,
    limit: 10,
    order: "DESC",
  });

  const fetchProjectDetail = useCallback(async () => {
    try {
      setIsLoadingDetail(true);
      setError(null);
      const projectData = await getProjectDetail(projectId);
      setProjectDetail(projectData);
    } catch (err) {
      console.error("Error fetching project detail:", err);
      setError("No se pudo cargar el detalle del proyecto");
    } finally {
      setIsLoadingDetail(false);
    }
  }, [projectId]);

  const fetchProjectLots = useCallback(
    async (newFilters?: Record<string, unknown>) => {
      try {
        setIsLoadingLots(true);

        const currentFilters = newFilters || filters;

        const lotsData = await getProjectLots(projectId, currentFilters);
        setLots(lotsData.items);
        setTotalLots(lotsData.meta.totalItems);
        setTotalPages(lotsData.meta.totalPages);
        setCurrentPage(lotsData.meta.currentPage);
      } catch (err) {
        console.error("Error fetching project lots:", err);
        setError("No se pudo cargar los lotes del proyecto");
      } finally {
        setIsLoadingLots(false);
      }
    },
    [projectId, filters]
  );

  const setFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      page: 1,
      limit: 10,
      order: "DESC",
    });
  }, []);

  const updateProject = useCallback(
    async (
      data: UpdateProjectDto,
      logoFile?: File | null
    ): Promise<ProjectDetailDto | null> => {
      if (!projectId) {
        setError("ID de proyecto no válido");
        return null;
      }

      setIsUpdating(true);
      setError(null);

      try {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (key === "name" || key === "isActive") {
            if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else if (value !== null && value !== undefined) {
              formData.append(key, String(value));
            }
          }
        });

        if (logoFile) {
          formData.append("logo", logoFile);
        }

        const updatedProject = await updateProjectWithImage({
          id: projectId,
          formData,
        });

        setProjectDetail(updatedProject);

        toast.success("Proyecto actualizado correctamente");
        return updatedProject;
      } catch (error) {
        console.error("Error al actualizar el proyecto:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar el proyecto";

        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [projectId]
  );

  const getLotsByStage = useCallback(
    (stageId: string) => lots.filter((lot) => lot.stageId === stageId),
    [lots]
  );

  const getLotsByBlock = useCallback(
    (blockId: string) => lots.filter((lot) => lot.blockId === blockId),
    [lots]
  );

  const getLotsByStatus = useCallback(
    (status: LotStatus) => lots.filter((lot) => lot.status === status),
    [lots]
  );

  useEffect(() => {
    fetchProjectDetail();
  }, [fetchProjectDetail]);

  useEffect(() => {
    fetchProjectLots();
  }, [fetchProjectLots, filters]);

  const createProjectStage = useCallback(
    async (data: { name: string; isActive?: boolean }): Promise<void> => {
      if (!projectId) {
        setError("ID de proyecto no válido");
        return;
      }

      try {
        setError(null);
        await createStage({
          ...data,
          projectId,
        });

        toast.success("Etapa creada correctamente");
        await fetchProjectDetail();
      } catch (error) {
        console.error("Error al crear la etapa:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error al crear la etapa";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [projectId, fetchProjectDetail]
  );
  const updateProjectStage = useCallback(
    async (
      stageId: string,
      data: { name?: string; isActive?: boolean }
    ): Promise<void> => {
      if (!stageId) {
        setError("ID de etapa no válido");
        return;
      }

      try {
        setError(null);
        await updateStage(stageId, data);

        toast.success("Etapa actualizada correctamente");
        await fetchProjectDetail();
      } catch (error) {
        console.error("Error al actualizar la etapa:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar la etapa";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [fetchProjectDetail]
  );

  const createProjectBlock = useCallback(
    async (data: {
      name: string;
      isActive?: boolean;
      stageId: string;
    }): Promise<void> => {
      if (!data.stageId) {
        setError("ID de etapa no válido");
        return;
      }

      try {
        setError(null);
        await createBlock(data);

        toast.success("Manzana creada correctamente");
        await fetchProjectDetail();
      } catch (error) {
        console.error("Error al crear la manzana:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error al crear la manzana";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [fetchProjectDetail]
  );

  const updateProjectBlock = useCallback(
    async (
      blockId: string,
      data: { name?: string; isActive?: boolean }
    ): Promise<void> => {
      if (!blockId) {
        setError("ID de manzana no válido");
        return;
      }

      try {
        setError(null);
        await updateBlock(blockId, data);

        // Refrescar los datos del proyecto tras actualizar la manzana
        toast.success("Manzana actualizada correctamente");
        await fetchProjectDetail();
      } catch (error) {
        console.error("Error al actualizar la manzana:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar la manzana";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [fetchProjectDetail]
  );
  const createProjectLot = useCallback(
    async (data: {
      name: string;
      area: number;
      lotPrice: number;
      urbanizationPrice?: number;
      status?: LotStatus;
      blockId: string;
    }): Promise<void> => {
      if (!data.blockId) {
        setError("ID de manzana no válido");
        return;
      }

      try {
        setError(null);
        await createLot(data);

        toast.success("Lote creado correctamente");
        await fetchProjectDetail();
        await fetchProjectLots();
      } catch (error) {
        console.error("Error al crear el lote:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error al crear el lote";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [fetchProjectDetail, fetchProjectLots]
  );

  const updateProjectLot = useCallback(
    async (
      lotId: string,
      data: {
        name?: string;
        area?: number;
        lotPrice?: number;
        urbanizationPrice?: number;
        status?: LotStatus;
      }
    ): Promise<void> => {
      if (!lotId) {
        setError("ID de lote no válido");
        return;
      }

      try {
        setError(null);
        await updateLot(lotId, data);

        toast.success("Lote actualizado correctamente");
        await fetchProjectDetail();
        await fetchProjectLots();
      } catch (error) {
        console.error("Error al actualizar el lote:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al actualizar el lote";

        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [fetchProjectDetail, fetchProjectLots]
  );
  return {
    projectDetail,
    lots,
    totalLots,
    totalPages,
    currentPage,
    isLoadingDetail,
    isLoadingLots,
    isUpdating,
    error,
    filters,

    fetchProjectDetail,
    fetchProjectLots,
    setFilters,
    setPage,
    resetFilters,
    updateProject,

    getLotsByStage,
    getLotsByBlock,
    getLotsByStatus,

    createProjectStage,
    updateProjectStage,

    createProjectBlock,
    updateProjectBlock,

    createProjectLot,
    updateProjectLot,
  };
}
