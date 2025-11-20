'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateLead } from '../../hooks/use-update-lead';
import { updateLeadSchema, type UpdateLeadFormData } from '../../lib/validation';
import type { Lead } from '../../types';

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLeadModal({ lead, isOpen, onClose }: EditLeadModalProps) {
  const updateLead = useUpdateLead(lead?.id || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateLeadFormData>({
    resolver: zodResolver(updateLeadSchema),
  });

  // Load current lead data when modal opens
  useEffect(() => {
    if (lead) {
      setValue('firstName', lead.firstName);
      setValue('lastName', lead.lastName);
      setValue('document', lead.document);
      setValue('documentType', lead.documentType);
      setValue('email', lead.email || '');
      setValue('phone', lead.phone || '');
      setValue('phone2', lead.phone2 || '');
      setValue('age', lead.age || undefined);
    }
  }, [lead, setValue]);

  const onSubmit = async (data: UpdateLeadFormData) => {
    if (!lead) return;

    // Filter out undefined and empty string values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    ) as Partial<UpdateLeadFormData>;

    await updateLead.mutateAsync(filteredData);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input id="firstName" {...register('firstName')} placeholder="Ingrese el nombre" />
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Apellido <span className="text-destructive">*</span>
              </Label>
              <Input id="lastName" {...register('lastName')} placeholder="Ingrese el apellido" />
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName.message}</p>
              )}
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select
                value={watch('documentType')}
                onValueChange={(value) =>
                  setValue('documentType', value as 'DNI' | 'CE' | 'PASSPORT' | 'RUC')
                }
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                  <SelectItem value="RUC">RUC</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-destructive text-sm">{errors.documentType.message}</p>
              )}
            </div>

            {/* Document */}
            <div className="space-y-2">
              <Label htmlFor="document">Documento</Label>
              <Input id="document" {...register('document')} placeholder="Ingrese el documento" />
              {errors.document && (
                <p className="text-destructive text-sm">{errors.document.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Ingrese el email"
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="Ingrese la edad"
              />
              {errors.age && <p className="text-destructive text-sm">{errors.age.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono Principal</Label>
              <Input id="phone" {...register('phone')} placeholder="Ingrese el teléfono" />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>

            {/* Phone 2 */}
            <div className="space-y-2">
              <Label htmlFor="phone2">Teléfono Secundario</Label>
              <Input
                id="phone2"
                {...register('phone2')}
                placeholder="Ingrese el teléfono secundario"
              />
              {errors.phone2 && <p className="text-destructive text-sm">{errors.phone2.message}</p>}
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              {...register('observations')}
              placeholder="Ingrese observaciones adicionales"
              rows={4}
            />
            {errors.observations && (
              <p className="text-destructive text-sm">{errors.observations.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateLead.isPending}>
              {updateLead.isPending ? 'Actualizando...' : 'Actualizar Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
