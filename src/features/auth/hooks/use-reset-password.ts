'use client';

import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../lib/mutations';
import { toast } from 'sonner';

export function useResetPassword(token: string) {
  return useMutation({
    mutationFn: (data: { password: string }) => resetPassword(token, data),
    onSuccess: () => {
      // Don't show toast here - let the component handle the success UI
    },
    onError: (error: Error) => {
      toast.error('Error al restablecer la contraseña');
      console.error('Error resetting password:', error);
    },
  });
}
