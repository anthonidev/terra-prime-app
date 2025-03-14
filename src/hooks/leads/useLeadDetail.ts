import {
  createOrUpdateLead,
  getLeadDetail,
  registerLeadDeparture,
} from "@/lib/actions/leads/leadAction";
import { CreateUpdateLeadDto, Lead } from "@/types/leads.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useLeadDetail(leadId?: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles del lead
  const fetchLeadDetail = useCallback(async () => {
    if (!leadId) {
      setLead(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response = await getLeadDetail(leadId);
      setLead(response.data);
    } catch (err) {
      console.error("Error al cargar detalles del lead:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles del lead";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLeadDetail();
  }, [fetchLeadDetail]);

  const updateLeadContact = useCallback(
    async (data: CreateUpdateLeadDto): Promise<boolean> => {
      if (!leadId) {
        toast.error("No se puede actualizar: ID de lead no válido");
        return false;
      }

      try {
        setError(null);
        setUpdating(true);

        const contactData: CreateUpdateLeadDto = {
          firstName: data.firstName,
          lastName: data.lastName,
          documentType: data.documentType,
          document: data.document,
          email: data.email,
          phone: data.phone,
          phone2: data.phone2,
        };

        const response = await createOrUpdateLead(contactData);

        if (response.success) {
          setLead(response.data);
          toast.success("Datos de contacto actualizados correctamente");
          return true;
        } else {
          throw new Error(
            response.message || "Error al actualizar los datos de contacto"
          );
        }
        return true;
      } catch (err) {
        console.error("Error al actualizar lead:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar los datos de contacto";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [leadId]
  );

  const registerDeparture = useCallback(async (): Promise<boolean> => {
    if (!leadId) {
      toast.error("No se puede registrar la salida: ID de lead no válido");
      return false;
    }

    if (!lead?.isInOffice) {
      toast.error("El lead no se encuentra en la oficina");
      return false;
    }

    try {
      setError(null);
      setUpdating(true);
      const response = await registerLeadDeparture(leadId);

      if (response.success) {
        setLead(response.data);
        toast.success("Salida registrada correctamente");
        return true;
      } else {
        throw new Error(response.message || "Error al registrar la salida");
      }
      return true;
    } catch (err) {
      console.error("Error al registrar salida:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar la salida";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [leadId, lead?.isInOffice]);

  return {
    lead,
    loading,
    updating,
    error,
    fetchLeadDetail,
    updateLeadContact,
    registerDeparture,
  };
}
