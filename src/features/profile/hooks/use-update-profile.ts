'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../lib/mutations';
import { toast } from 'sonner';
import type { UpdateProfileInput } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(response.message || 'Perfil actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    },
  });
}
