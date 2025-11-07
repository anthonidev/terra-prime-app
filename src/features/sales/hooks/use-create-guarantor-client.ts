'use client';

import { useMutation } from '@tanstack/react-query';
import { createGuarantorClient } from '../lib/mutations';
import { toast } from 'sonner';

export function useCreateGuarantorClient() {
  return useMutation({
    mutationFn: createGuarantorClient,
    onSuccess: () => {
      toast.success('Cliente y garante creados exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear cliente y garante');
      console.error('Error creating guarantor client:', error);
    },
  });
}
