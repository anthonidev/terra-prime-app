'use client';

import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '../lib/mutations';
import { toast } from 'sonner';
import type { RequestPasswordResetInput } from '../types';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: RequestPasswordResetInput) => requestPasswordReset(data),
    onSuccess: () => {
      // Don't show success toast here - let the component handle the UI
      // This prevents showing both a toast and the success card
    },
    onError: (error: Error) => {
      toast.error('Error al solicitar recuperación de contraseña');
      console.error('Error requesting password reset:', error);
    },
  });
}
