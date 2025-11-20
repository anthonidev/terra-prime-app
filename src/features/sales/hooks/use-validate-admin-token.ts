'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { validateAdminToken } from '../lib/mutations';
import { toast } from 'sonner';

export function useValidateAdminToken() {
  return useMutation({
    mutationFn: validateAdminToken,
    onError: (error: Error) => {
      let message = 'Error al validar el token';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error validating admin token:', error);
    },
  });
}
