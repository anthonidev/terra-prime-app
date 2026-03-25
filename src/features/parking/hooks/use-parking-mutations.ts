'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createParking, updateParking, deleteParking } from '../lib/mutations';
import type { CreateParkingInput, UpdateParkingInput } from '../types';

export function useCreateParking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParkingInput) => createParking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkings'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Cochera creada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear la cochera');
      console.error('Error creating parking:', error);
    },
  });
}

export function useUpdateParking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParkingInput }) => updateParking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkings'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Cochera actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la cochera');
      console.error('Error updating parking:', error);
    },
  });
}

export function useDeleteParking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteParking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkings'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Cochera desactivada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al desactivar la cochera');
      console.error('Error deleting parking:', error);
    },
  });
}
