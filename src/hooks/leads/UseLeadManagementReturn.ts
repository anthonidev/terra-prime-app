import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getActiveLeadSources } from "@/lib/actions/leads/leadSourceActions";
import { getActiveLiners } from "@/lib/actions/leads/linerActions";
import { getUbigeos } from "@/lib/actions/leads/ubigeoActions";

import {
  createOrUpdateLead,
  findLeadByDocument,
} from "@/lib/actions/leads/leadAction";
import {
  CreateUpdateLeadDto,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Liner,
  Ubigeo,
} from "@/types/leads.types";

interface UseLeadManagementReturn {
  // Estados
  lead: Lead | null;
  liners: Liner[];
  leadSources: LeadSource[];
  ubigeos: Ubigeo[];
  isSearching: boolean;
  isSubmitting: boolean;
  isLoadingData: boolean;
  searchError: string | null;
  submitError: string | null;
  isLeadFound: boolean;
  isLeadInOffice: boolean;

  searchedDocument: FindLeadByDocumentDto | null;

  // Acciones
  findLead: (findDto: FindLeadByDocumentDto) => Promise<void>;
  saveLead: (leadData: CreateUpdateLeadDto) => Promise<boolean>;
  reset: () => void;

  // Utilidades
  getDepartments: () => Ubigeo[];
  getProvinces: (departmentId: number) => Ubigeo[];
  getDistricts: (provinceId: number) => Ubigeo[];
}

export function useLeadManagement(): UseLeadManagementReturn {
  // Estados para el lead y operaciones
  const [lead, setLead] = useState<Lead | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLeadFound, setIsLeadFound] = useState<boolean>(false);
  const [isLeadInOffice, setIsLeadInOffice] = useState<boolean>(false);
  const [searchedDocument, setSearchedDocument] =
    useState<FindLeadByDocumentDto | null>(null);

  // Estados para datos relacionados
  const [liners, setLiners] = useState<Liner[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [ubigeos, setUbigeos] = useState<Ubigeo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Ejecutar todas las peticiones en paralelo
      const [linersResponse, sourcesResponse, ubigeosResponse] =
        await Promise.all([
          getActiveLiners(),
          getActiveLeadSources(),
          getUbigeos(),
        ]);

      setLiners(linersResponse.data);
      setLeadSources(sourcesResponse.data);
      setUbigeos(ubigeosResponse.data);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      toast.error("No se pudieron cargar los datos necesarios");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Buscar lead por documento
  const findLead = useCallback(async (findDto: FindLeadByDocumentDto) => {
    setIsSearching(true);
    setSearchError(null);
    setLead(null);
    setIsLeadFound(false);
    setIsLeadInOffice(false);
    setSearchedDocument(findDto);

    try {
      const response = await findLeadByDocument(findDto);

      if (response.success) {
        setLead(response.data);
        setIsLeadFound(true);
        setIsLeadInOffice(false);
        toast.success("Lead encontrado");
      } else {
        if (response.data) {
          setLead(response.data);
          setIsLeadFound(true);
          setIsLeadInOffice(true);
          toast.warning(response.message);
        } else {
          setIsLeadFound(false);
          toast.info(response.message || "No se encontró el lead");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al buscar el lead";
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Guardar lead (crear o actualizar)
  const saveLead = useCallback(
    async (leadData: CreateUpdateLeadDto): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await createOrUpdateLead(leadData);

        if (response.success) {
          setLead(response.data);
          setIsLeadFound(true);
          setIsLeadInOffice(true);
          toast.success(response.message);
          return true;
        } else {
          setSubmitError(response.message);
          toast.error(response.message);
          return false;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al guardar el lead";
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  // Resetear estados
  const reset = useCallback(() => {
    setLead(null);
    setIsLeadFound(false);
    setIsLeadInOffice(false);
    setSearchError(null);
    setSubmitError(null);
    setSearchedDocument(null);
  }, []);

  // Utilidades para manejar los ubigeos
  const getDepartments = useCallback(() => {
    return ubigeos.filter((u) => u.parentId === null);
  }, [ubigeos]);

  const getProvinces = useCallback(
    (departmentId: number) => {
      const department = ubigeos.find((u) => u.id === departmentId);
      return department?.children || [];
    },
    [ubigeos]
  );

  const getDistricts = useCallback(
    (provinceId: number) => {
      // Búsqueda recursiva en la estructura anidada para encontrar la provincia
      const findProvinceAndGetChildren = (items: Ubigeo[]): Ubigeo[] => {
        for (const item of items) {
          if (item.id === provinceId) {
            return item.children || [];
          }
          if (item.children) {
            const found = findProvinceAndGetChildren(item.children);
            if (found.length > 0) {
              return found;
            }
          }
        }
        return [];
      };

      return findProvinceAndGetChildren(ubigeos);
    },
    [ubigeos]
  );
  return {
    // Estados
    lead,
    liners,
    leadSources,
    ubigeos,
    isSearching,
    isSubmitting,
    isLoadingData,
    searchError,
    submitError,
    isLeadFound,
    isLeadInOffice,
    searchedDocument,

    // Acciones
    findLead,
    saveLead,
    reset,

    // Utilidades
    getDepartments,
    getProvinces,
    getDistricts,
  };
}
