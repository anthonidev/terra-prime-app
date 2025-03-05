import { getProjectDetail, getProjectLots } from "@/lib/actions/projects/projectActions";
import { LotResponseDto, LotStatus, ProjectDetailDto } from "@/types/project.types";
import { useState, useEffect, useCallback } from "react";

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
    error: string | null;

    filters: Record<string, unknown>;

    fetchProjectDetail: () => Promise<void>;
    fetchProjectLots: (newFilters?: Record<string, unknown>) => Promise<void>;
    setFilters: (newFilters: Record<string, unknown>) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;

    getLotsByStage: (stageId: string) => LotResponseDto[];
    getLotsByBlock: (blockId: string) => LotResponseDto[];
    getLotsByStatus: (status: LotStatus) => LotResponseDto[];
}


export function useProject({ projectId }: UseProjectProps): UseProjectReturn {
    const [projectDetail, setProjectDetail] = useState<ProjectDetailDto | null>(null);
    const [lots, setLots] = useState<LotResponseDto[]>([]);
    const [totalLots, setTotalLots] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(true);
    const [isLoadingLots, setIsLoadingLots] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<Record<string, unknown>>({
        page: 1,
        limit: 10,
        order: "DESC"
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

    const fetchProjectLots = useCallback(async (newFilters?: Record<string, unknown>) => {
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
    }, [projectId, filters]);

    const setFilters = useCallback((newFilters: Record<string, unknown>) => {
        setFiltersState(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }));
    }, []);

    const setPage = useCallback((page: number) => {
        setFiltersState(prev => ({
            ...prev,
            page
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState({
            page: 1,
            limit: 10,
            order: "DESC"
        });
    }, []);

    const getLotsByStage = useCallback(
        (stageId: string) => lots.filter(lot => lot.stageId === stageId),
        [lots]
    );

    const getLotsByBlock = useCallback(
        (blockId: string) => lots.filter(lot => lot.blockId === blockId),
        [lots]
    );

    const getLotsByStatus = useCallback(
        (status: LotStatus) => lots.filter(lot => lot.status === status),
        [lots]
    );

    useEffect(() => {
        fetchProjectDetail();
    }, [fetchProjectDetail]);

    useEffect(() => {
        fetchProjectLots();
    }, [fetchProjectLots, filters]);

    return {
        // Estados
        projectDetail,
        lots,
        totalLots,
        totalPages,
        currentPage,
        isLoadingDetail,
        isLoadingLots,
        error,
        filters,

        // Acciones
        fetchProjectDetail,
        fetchProjectLots,
        setFilters,
        setPage,
        resetFilters,

        // Helpers
        getLotsByStage,
        getLotsByBlock,
        getLotsByStatus
    };
}