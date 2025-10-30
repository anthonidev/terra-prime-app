'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { validateExcel, bulkCreateProject } from '../lib/mutations';

export function useValidateExcel() {
  return useMutation({
    mutationFn: validateExcel,
    onError: (error) => {
      console.error('Error validating Excel:', error);
      toast.error('Error al validar el archivo Excel');
    },
  });
}

export function useBulkCreateProject() {
  const router = useRouter();

  return useMutation({
    mutationFn: bulkCreateProject,
    onSuccess: (data) => {
      toast.success(data.message || 'Proyecto creado exitosamente');
      router.push(`/proyectos/detalle/${data.project.id}`);
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error('Error al crear el proyecto');
    },
  });
}
