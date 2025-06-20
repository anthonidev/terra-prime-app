'use client';

import { createPin, findPin } from '@infrastructure/server-actions/pin.actions';
import { PinResponse } from '@infrastructure/types/pin';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UsePinState {
  pinGenerated: PinResponse | null;
  existingPin: PinResponse | null;
  isLoading: boolean;
  isLoadingExisting: boolean;
  error: string | null;
}

export function usePin() {
  const [state, setState] = useState<UsePinState>({
    pinGenerated: null,
    existingPin: null,
    isLoading: false,
    isLoadingExisting: false,
    error: null
  });

  const handleError = useCallback((error: unknown, action: string) => {
    const message = error instanceof Error ? error.message : `Error al ${action}`;
    setState((prev) => ({ ...prev, error: message }));
    toast.error(message);
  }, []);

  const generatePin = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await createPin();
      setState((prev) => ({
        ...prev,
        pinGenerated: response,
        isLoading: false
      }));

      toast.success('PIN generado correctamente!');

      // Recargar el PIN existente después de generar uno nuevo
      await loadExistingPin();
    } catch (error) {
      handleError(error, 'generar el PIN');
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleError]);

  const loadExistingPin = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingExisting: true, error: null }));

    try {
      const response = await findPin();
      setState((prev) => ({
        ...prev,
        existingPin: response,
        isLoadingExisting: false
      }));
    } catch (error) {
      handleError(error, 'cargar el PIN existente');
      setState((prev) => ({
        ...prev,
        existingPin: null,
        isLoadingExisting: false
      }));
    }
  }, [handleError]);

  const clearGeneratedPin = useCallback(() => {
    setState((prev) => ({ ...prev, pinGenerated: null }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    loadExistingPin();
  }, [loadExistingPin]);

  return {
    ...state,
    generatePin,
    loadExistingPin,
    clearGeneratedPin,
    clearError
  };
}
