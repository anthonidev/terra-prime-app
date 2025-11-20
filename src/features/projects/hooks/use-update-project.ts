'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../lib/mutations';
import { toast } from 'sonner';
import type { UpdateProjectInput } from '../types';

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) => updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proyecto actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el proyecto');
      console.error('Error updating project:', error);
    },
  });
}
