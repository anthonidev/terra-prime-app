'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../lib/mutations';
import { toast } from 'sonner';
import type { CreateUserInput } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear el usuario');
      console.error('Error creating user:', error);
    },
  });
}
