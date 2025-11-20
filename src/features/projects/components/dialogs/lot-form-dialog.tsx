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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useCreateLot, useUpdateLot } from '../../hooks/use-mutations';
import {
  lotSchema,
  updateLotSchema,
  type LotFormData,
  type UpdateLotFormData,
} from '../../lib/validation';
import type { Lot } from '../../types';

interface LotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  blockId: string;
  blockName: string;
  lot?: Lot | null;
}

export function LotFormDialog({
  open,
  onOpenChange,
  projectId,
  blockId,
  blockName,
  lot,
}: LotFormDialogProps) {
  const isEditing = !!lot;
  const { mutate: createLot, isPending: isCreating } = useCreateLot(projectId);
  const { mutate: updateLot, isPending: isUpdating } = useUpdateLot(projectId);

  const form = useForm<LotFormData | UpdateLotFormData>({
    resolver: zodResolver(isEditing ? updateLotSchema : lotSchema),
    defaultValues:
      isEditing && lot
        ? {
            name: lot.name,
            area: parseFloat(lot.area),
            lotPrice: parseFloat(lot.lotPrice),
            urbanizationPrice: parseFloat(lot.urbanizationPrice),
            status: lot.status,
          }
        : {
            name: '',
            area: 0,
            lotPrice: 0,
            urbanizationPrice: 0,
          },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && lot
          ? {
              name: lot.name,
              area: parseFloat(lot.area),
              lotPrice: parseFloat(lot.lotPrice),
              urbanizationPrice: parseFloat(lot.urbanizationPrice),
              status: lot.status,
            }
          : {
              name: '',
              area: 0,
              lotPrice: 0,
              urbanizationPrice: 0,
            }
      );
    }
  }, [open, lot, isEditing, form]);

  const onSubmit = (data: LotFormData | UpdateLotFormData) => {
    if (isEditing && lot) {
      updateLot(
        { id: lot.id, data: data as UpdateLotFormData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createLot({ ...(data as LotFormData), blockId }, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nuevo'} lote</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del lote'
              : `Crea un nuevo lote para la manzana ${blockName}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del lote</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1, 2, 3..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 250.50"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lotPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio del lote</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 50000.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urbanizationPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de urbanización</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 10000.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Separado">Separado</SelectItem>
                        <SelectItem value="Vendido">Vendido</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                {isPending ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear lote'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
