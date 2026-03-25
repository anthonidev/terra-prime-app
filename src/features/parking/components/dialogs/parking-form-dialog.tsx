'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormDialog } from '@/shared/components/form-dialog';
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

import { useCreateParking, useUpdateParking } from '../../hooks/use-parking-mutations';
import {
  parkingSchema,
  updateParkingSchema,
  type ParkingFormData,
  type UpdateParkingFormData,
} from '../../lib/validation';
import type { Parking } from '../../types';

interface ParkingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  parking?: Parking | null;
}

export function ParkingFormDialog({
  open,
  onOpenChange,
  projectId,
  parking,
}: ParkingFormDialogProps) {
  const isEditing = !!parking;
  const { mutate: createParking, isPending: isCreating } = useCreateParking(projectId);
  const { mutate: updateParking, isPending: isUpdating } = useUpdateParking(projectId);

  const form = useForm<ParkingFormData | UpdateParkingFormData>({
    resolver: zodResolver(isEditing ? updateParkingSchema : parkingSchema),
    defaultValues: isEditing
      ? {
          name: parking.name,
          area: parseFloat(parking.area),
          price: parseFloat(parking.price),
          status: parking.status,
        }
      : {
          name: '',
          area: 0,
          price: 0,
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing && parking
          ? {
              name: parking.name,
              area: parseFloat(parking.area),
              price: parseFloat(parking.price),
              status: parking.status,
            }
          : {
              name: '',
              area: 0,
              price: 0,
            }
      );
    }
  }, [open, parking, isEditing, form]);

  const onSubmit = (data: ParkingFormData | UpdateParkingFormData) => {
    if (isEditing && parking) {
      updateParking(
        { id: parking.id, data: data as UpdateParkingFormData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createParking(
        { ...(data as ParkingFormData), projectId },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar cochera' : 'Nueva cochera'}
      description={
        isEditing
          ? 'Actualiza la información de la cochera'
          : 'Crea una nueva cochera para el proyecto'
      }
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel={isEditing ? 'Actualizar' : 'Crear cochera'}
      isEditing={isEditing}
      maxWidth="md"
    >
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Nombre de la cochera</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: C-01, C-02..." {...field} />
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
                      placeholder="Ej: 12.50"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 25000.00"
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
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
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
          </div>
        </div>
      </Form>
    </FormDialog>
  );
}
