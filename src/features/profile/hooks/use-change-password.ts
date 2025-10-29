'use client';

import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../lib/mutations';
import { toast } from 'sonner';
import type { ChangePasswordInput } from '../types';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Contraseña actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al cambiar la contraseña');
      console.error('Error changing password:', error);
    },
  });
}
