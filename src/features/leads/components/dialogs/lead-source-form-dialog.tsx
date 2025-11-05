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

import { useCreateLeadSource, useUpdateLeadSource } from '../../hooks/use-mutations';
import { leadSourceSchema, type LeadSourceFormData } from '../../lib/validation';
import type { LeadSource } from '../../types';

interface LeadSourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadSource?: LeadSource | null;
}

export function LeadSourceFormDialog({
  open,
  onOpenChange,
  leadSource,
}: LeadSourceFormDialogProps) {
  const isEditing = !!leadSource;
  const { mutate: createLeadSource, isPending: isCreating } = useCreateLeadSource();
  const { mutate: updateLeadSource, isPending: isUpdating } = useUpdateLeadSource();

  const form = useForm<{ name: string; isActive: boolean }>({
    resolver: zodResolver(leadSourceSchema),
    defaultValues: {
      name: leadSource?.name || '',
      isActive: leadSource?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: leadSource?.name || '',
        isActive: leadSource?.isActive ?? true,
      });
    }
  }, [open, leadSource, form]);

  const onSubmit = (data: { name: string; isActive: boolean }) => {
    if (isEditing && leadSource) {
      updateLeadSource(
        { id: leadSource.id, data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createLeadSource(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar' : 'Nueva'} fuente de lead
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información de la fuente de lead'
              : 'Crea una nueva fuente de generación de leads'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la fuente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Facebook, Google, Referido" {...field} />
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
                    <div className="text-sm text-muted-foreground">
                      {field.value ? 'Fuente activa' : 'Fuente inactiva'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                {isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear fuente'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
