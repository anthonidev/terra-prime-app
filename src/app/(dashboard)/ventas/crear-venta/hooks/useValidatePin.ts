'use client';

import { validatePin } from '@infrastructure/server-actions/pin.actions';
import { useState } from 'react';
import { toast } from 'sonner';

export function useValidatePin(pin: string) {
  const [state, setState] = useState<{
    isLoading: boolean;
  }>({
    isLoading: false
  });

  const onValidatePin = async (): Promise<boolean> => {
    setState({ ...state, isLoading: true });
    try {
      const response = await validatePin(pin);
      console.log(response);
      return response;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      throw error;
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  return {
    ...state,
    onValidatePin
  };
}
