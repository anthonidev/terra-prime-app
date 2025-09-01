'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Participant } from '@domain/entities/sales/participant.entity';
import {
  createParticipant,
  updateParticipant
} from '@infrastructure/server-actions/participant.actions';
import { ParticipantSchema, ParticipantType } from '../../validations/participant.zod';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant?: Participant;
}

const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carné de Extranjería' },
  { value: 'RUC', label: 'Ruc' }
];

const PARTICIPANT_TYPES = [
  { value: 'LINER', label: 'Liner' },
  { value: 'TELEMARKETING_SUPERVISOR', label: 'Supervisor de Telemarketing' },
  { value: 'TELEMARKETING_CONFIRMER', label: 'Supervisor Confirmador' },
  { value: 'TELEMARKETER', label: 'Telemarketer' },
  { value: 'FIELD_MANAGER', label: 'Jefe de Campo' },
  { value: 'FIELD_SUPERVISOR', label: 'Supervisor de Campo' },
  { value: 'FIELD_SELLER', label: 'Vendedor de Campo' },
  { value: 'SALES_MANAGER', label: 'Gerente de Ventas' },
  { value: 'SALES_GENERAL_MANAGER', label: 'Gerente General de Ventas' },
  { value: 'POST_SALE', label: 'Post Venta' },
  { value: 'CLOSER', label: 'Closer' }
];

export default function ParticipantModal({ isOpen, onClose, participant }: ParticipantModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!participant;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ParticipantType>({
    resolver: zodResolver(ParticipantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      document: '',
      documentType: 'DNI',
      phone: '',
      address: '',
      participantType: 'LINER'
    }
  });

  const documentType = watch('documentType');
  const participantType = watch('participantType');

  useEffect(() => {
    if (participant && isOpen) {
      reset({
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        document: participant.document,
        documentType: participant.documentType,
        phone: participant.phone,
        address: participant.address,
        participantType: participant.participantType
      });
    } else if (!participant && isOpen) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        document: '',
        documentType: 'DNI',
        phone: '',
        address: '',
        participantType: 'LINER'
      });
    }
  }, [participant, isOpen, reset]);

  const onSubmit = async (data: ParticipantType) => {
    setIsSubmitting(true);
    try {
      if (isEdit && participant) {
        await updateParticipant(participant.id, data);
        toast.success('Participante actualizado exitosamente');
      } else {
        await createParticipant(data);
        toast.success('Participante creado exitosamente');
      }

      router.refresh();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Error al ${isEdit ? 'actualizar' : 'crear'} el participante`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Participante' : 'Nuevo Participante'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres *</Label>
              <Input
                className="bg-white dark:bg-gray-900"
                id="firstName"
                {...register('firstName')}
                placeholder="Ingrese los nombres"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos *</Label>
              <Input
                className="bg-white dark:bg-gray-900"
                id="lastName"
                {...register('lastName')}
                placeholder="Ingrese los apellidos"
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                className="bg-white dark:bg-gray-900"
                id="email"
                type="email"
                {...register('email')}
                placeholder="correo@ejemplo.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                className="bg-white dark:bg-gray-900"
                id="phone"
                {...register('phone')}
                placeholder="987654321"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento *</Label>
              <Select
                value={documentType}
                onValueChange={(value) => setValue('documentType', value as 'DNI' | 'CE' | 'RUC')}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-sm text-red-500">{errors.documentType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Número de Documento *</Label>
              <Input
                className="bg-white dark:bg-gray-900"
                id="document"
                {...register('document')}
                placeholder="12345678"
                disabled={isSubmitting}
              />
              {errors.document && <p className="text-sm text-red-500">{errors.document.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="participantType">Tipo de Participante *</Label>
              <Select
                value={participantType}
                onValueChange={(value) => setValue('participantType', value as 'LINER')}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PARTICIPANT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.participantType && (
                <p className="text-sm text-red-500">{errors.participantType.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                className="bg-white dark:bg-gray-900"
                id="address"
                {...register('address')}
                placeholder="Ingrese la dirección completa"
                rows={3}
                disabled={isSubmitting}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEdit
                  ? 'Actualizar'
                  : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
