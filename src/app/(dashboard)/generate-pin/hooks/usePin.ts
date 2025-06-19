'use client';

import { createPin, findPin } from '@infrastructure/server-actions/pin.actions';
import { PinResponse } from '@infrastructure/types/pin';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function usePin() {
  const [pinGenerated, setPinGenerated] = useState<PinResponse | null>(null);
  const [existingPin, setExistingPin] = useState<PinResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  const onGenerated = async () => {
    setIsLoading(true);
    try {
      const response = await createPin();
      setPinGenerated(response);
      toast.info('Pin generado correctamente!');
      await loadExistingPin();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingPin = async () => {
    setIsLoadingExisting(true);
    try {
      const response = await findPin();
      setExistingPin(response);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setExistingPin(null);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  useEffect(() => {
    loadExistingPin();
  }, []);

  return {
    isLoading,
    isLoadingExisting,
    pinGenerated,
    existingPin,
    onGenerated,
    reloadPin: loadExistingPin
  };
}
