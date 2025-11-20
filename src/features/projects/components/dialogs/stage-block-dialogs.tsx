'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import {
  useCreateStage,
  useUpdateStage,
  useCreateBlock,
  useUpdateBlock,
} from '../../hooks/use-mutations';
import {
  stageSchema,
  blockSchema,
  type StageFormData,
  type BlockFormData,
} from '../../lib/validation';
import type { Stage, Block } from '../../types';

// Stage Dialog
interface StageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  stage?: Stage | null;
}

export function StageFormDialog({ open, onOpenChange, projectId, stage }: StageFormDialogProps) {
  const isEditing = !!stage;
  const { mutate: createStage, isPending: isCreating } = useCreateStage(projectId);
  const { mutate: updateStage, isPending: isUpdating } = useUpdateStage(projectId);

  const form = useForm<StageFormData>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: stage?.name || '',
      isActive: stage?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: stage?.name || '',
        isActive: stage?.isActive ?? true,
      });
    }
  }, [open, stage, form]);

  const onSubmit = (data: StageFormData) => {
    if (isEditing && stage) {
      updateStage({ id: stage.id, data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createStage({ ...data, projectId }, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} etapa</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información de la etapa'
              : 'Crea una nueva etapa para el proyecto'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la etapa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Etapa 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <div className="text-muted-foreground text-sm">
                      {field.value ? 'Etapa activa' : 'Etapa inactiva'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear etapa'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Block Dialog
interface BlockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  stageId: string;
  stageName: string;
  block?: Block | null;
}

export function BlockFormDialog({
  open,
  onOpenChange,
  projectId,
  stageId,
  stageName,
  block,
}: BlockFormDialogProps) {
  const isEditing = !!block;
  const { mutate: createBlock, isPending: isCreating } = useCreateBlock(projectId);
  const { mutate: updateBlock, isPending: isUpdating } = useUpdateBlock(projectId);

  const form = useForm<BlockFormData>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: block?.name || '',
      isActive: block?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: block?.name || '',
        isActive: block?.isActive ?? true,
      });
    }
  }, [open, block, form]);

  const onSubmit = (data: BlockFormData) => {
    if (isEditing && block) {
      updateBlock({ id: block.id, data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createBlock({ ...data, stageId }, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} manzana</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información de la manzana'
              : `Crea una nueva manzana para ${stageName}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la manzana</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: A, B, C..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <div className="text-muted-foreground text-sm">
                      {field.value ? 'Manzana activa' : 'Manzana inactiva'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear manzana'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
