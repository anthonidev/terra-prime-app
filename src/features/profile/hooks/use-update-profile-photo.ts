'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfilePhoto } from '../lib/mutations';
import { toast } from 'sonner';

export function useUpdateProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateProfilePhoto(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(response.message || 'Foto actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la foto de perfil');
      console.error('Error updating profile photo:', error);
    },
  });
}
