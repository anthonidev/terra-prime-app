'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateUpdateLeadDto, Lead } from '@/types/leads.types';
import { updateLeadContact, registerLeadDeparture } from '../action';

interface UseLeadDetailReturn {
  updating: boolean;
  error: string | null;
  updateLeadContactAction: (data: CreateUpdateLeadDto, leadId: string) => Promise<boolean>;
  registerDepartureAction: (leadId: string) => Promise<boolean>;
}

export function useLeadDetail(lead: Lead): UseLeadDetailReturn {
  const router = useRouter();
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateLeadContactAction = useCallback(
    async (data: CreateUpdateLeadDto, leadId: string): Promise<boolean> => {
      if (!leadId) {
        toast.error('ID de lead no válido');
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
          age: data.age,
          isNewLead: false
        };

        const response = await updateLeadContact(leadId, contactData);

        if (response.success) {
          toast.success('Datos de contacto actualizados correctamente');
          router.refresh();
          return true;
        } else {
          throw new Error(response.error || 'Error al actualizar los datos de contacto');
        }
      } catch (err) {
        console.error('Error al actualizar lead:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Error al actualizar los datos de contacto';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const registerDepartureAction = useCallback(
    async (leadId: string): Promise<boolean> => {
      if (!leadId) {
        toast.error('ID de lead no válido');
        return false;
      }

      if (!lead?.isInOffice) {
        toast.error('El lead no se encuentra en la oficina');
        return false;
      }

      try {
        setError(null);
        setUpdating(true);

        const response = await registerLeadDeparture(leadId);

        if (response.success) {
          toast.success('Salida registrada correctamente');
          router.refresh();
          return true;
        } else {
          throw new Error(response.error || 'Error al registrar la salida');
        }
      } catch (err) {
        console.error('Error al registrar salida:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al registrar la salida';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [lead?.isInOffice, router]
  );

  return {
    updating,
    error,
    updateLeadContactAction,
    registerDepartureAction
  };
}
