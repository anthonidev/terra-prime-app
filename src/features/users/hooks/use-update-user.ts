'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../lib/mutations';
import { toast } from 'sonner';
import type { UpdateUserInput } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el usuario');
      console.error('Error updating user:', error);
    },
  });
}
