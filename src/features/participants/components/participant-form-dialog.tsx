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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useCreateParticipant } from '../hooks/use-create-participant';
import { useUpdateParticipant } from '../hooks/use-update-participant';
import {
  createParticipantSchema,
  updateParticipantSchema,
  type CreateParticipantFormData,
  type UpdateParticipantFormData,
} from '../lib/validation';
import { ParticipantType, DocumentType } from '../types';
import { PARTICIPANT_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../constants';
import type { Participant } from '../types';

interface ParticipantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant?: Participant | null;
}

export function ParticipantFormDialog({
  open,
  onOpenChange,
  participant,
}: ParticipantFormDialogProps) {
  const isEditing = !!participant;
  const { mutate: createParticipant, isPending: isCreating } = useCreateParticipant();
  const { mutate: updateParticipant, isPending: isUpdating } = useUpdateParticipant();

  const form = useForm<CreateParticipantFormData | UpdateParticipantFormData>({
    resolver: zodResolver(isEditing ? updateParticipantSchema : createParticipantSchema),
    defaultValues: isEditing && participant
      ? {
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email || '',
          document: participant.document,
          documentType: participant.documentType,
          phone: participant.phone,
          address: participant.address,
          participantType: participant.participantType,
          isActive: participant.isActive,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          document: '',
          documentType: DocumentType.DNI,
          phone: '',
          address: '',
          participantType: ParticipantType.TELEMARKETER,
        },
  });

  // Reset form cuando cambia el participant o se abre/cierra
  useEffect(() => {
    if (open) {
      if (isEditing && participant) {
        form.reset({
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email || '',
          document: participant.document,
          documentType: participant.documentType,
          phone: participant.phone,
          address: participant.address,
          participantType: participant.participantType,
          isActive: participant.isActive,
        });
      } else {
        form.reset({
          firstName: '',
          lastName: '',
          email: '',
          document: '',
          documentType: DocumentType.DNI,
          phone: '',
          address: '',
          participantType: ParticipantType.TELEMARKETER,
        });
      }
    }
  }, [open, participant, isEditing, form]);

  const onSubmit = (data: CreateParticipantFormData | UpdateParticipantFormData) => {
    if (isEditing && participant) {
      updateParticipant(
        { id: participant.id, data: data as UpdateParticipantFormData },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } else {
      createParticipant(data as CreateParticipantFormData, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar participante' : 'Crear nuevo participante'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la información del participante'
              : 'Completa el formulario para crear un nuevo participante'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombres */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Documento */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Número de documento</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Teléfono */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Principal 123, Distrito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de participante */}
            <FormField
              control={form.control}
              name="participantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de participante</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(PARTICIPANT_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado (solo en edición) */}
            {isEditing && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estado</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? 'Participante activo' : 'Participante inactivo'}
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
            )}

            {/* Botones */}
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
                {isPending
                  ? 'Guardando...'
                  : isEditing
                    ? 'Actualizar'
                    : 'Crear participante'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
