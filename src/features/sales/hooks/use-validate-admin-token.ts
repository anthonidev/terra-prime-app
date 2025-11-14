'use client';

import { useMutation } from '@tanstack/react-query';
import { validateAdminToken } from '../lib/mutations';
import { toast } from 'sonner';

export function useValidateAdminToken() {
  return useMutation({
    mutationFn: validateAdminToken,
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al validar el token';
      toast.error(message);
      console.error('Error validating admin token:', error);
    },
  });
}
