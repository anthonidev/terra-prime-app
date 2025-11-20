'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createStage,
  updateStage,
  createBlock,
  updateBlock,
  createLot,
  updateLot,
} from '../lib/mutations';
import type {
  CreateStageInput,
  UpdateStageInput,
  CreateBlockInput,
  UpdateBlockInput,
  CreateLotInput,
  UpdateLotInput,
} from '../types';

// Stage Hooks
export function useCreateStage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStageInput) => createStage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Etapa creada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear la etapa');
      console.error('Error creating stage:', error);
    },
  });
}

export function useUpdateStage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStageInput }) => updateStage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Etapa actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la etapa');
      console.error('Error updating stage:', error);
    },
  });
}

// Block Hooks
export function useCreateBlock(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlockInput) => createBlock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Manzana creada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear la manzana');
      console.error('Error creating block:', error);
    },
  });
}

export function useUpdateBlock(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlockInput }) => updateBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Manzana actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la manzana');
      console.error('Error updating block:', error);
    },
  });
}

// Lot Hooks
export function useCreateLot(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLotInput) => createLot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-lots', projectId] });
      toast.success('Lote creado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear el lote');
      console.error('Error creating lot:', error);
    },
  });
}

export function useUpdateLot(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLotInput }) => updateLot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-lots', projectId] });
      toast.success('Lote actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el lote');
      console.error('Error updating lot:', error);
    },
  });
}
