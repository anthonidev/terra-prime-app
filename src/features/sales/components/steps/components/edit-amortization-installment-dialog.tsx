'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDialog } from '@/shared/components/form-dialog';
import type { EditableInstallment } from '../../../types';

const editInstallmentSchema = z.object({
  lotInstallmentAmount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  huInstallmentAmount: z.number().min(0, 'El monto no puede ser negativo'),
  expectedPaymentDate: z.string().min(1, 'La fecha es requerida'),
});

type EditInstallmentFormData = z.infer<typeof editInstallmentSchema>;

interface EditAmortizationInstallmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installment: EditableInstallment | null;
  hasUrbanization: boolean;
  onSave: (
    id: string,
    updates: {
      lotInstallmentAmount?: number;
      huInstallmentAmount?: number;
      expectedPaymentDate?: string;
    }
  ) => void;
}

export function EditAmortizationInstallmentDialog({
  open,
  onOpenChange,
  installment,
  hasUrbanization,
  onSave,
}: EditAmortizationInstallmentDialogProps) {
  const form = useForm<EditInstallmentFormData>({
    resolver: zodResolver(editInstallmentSchema),
    values: installment
      ? {
          lotInstallmentAmount: installment.lotInstallmentAmount,
          huInstallmentAmount: installment.huInstallmentAmount,
          expectedPaymentDate: installment.expectedPaymentDate,
        }
      : {
          lotInstallmentAmount: 0,
          huInstallmentAmount: 0,
          expectedPaymentDate: '',
        },
  });

  const handleSubmit = (data: EditInstallmentFormData) => {
    if (!installment) return;
    onSave(installment.id, {
      lotInstallmentAmount: data.lotInstallmentAmount,
      huInstallmentAmount: data.huInstallmentAmount,
      expectedPaymentDate: data.expectedPaymentDate,
    });
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Editar Cuota #${installment?.lotInstallmentNumber ?? ''}`}
      description="Modifique los montos o la fecha de pago de esta cuota"
      isEditing
      icon={Pencil}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitLabel="Guardar cambios"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lotInstallmentAmount">Monto Cuota Lote</Label>
          <Input
            id="lotInstallmentAmount"
            type="number"
            step="0.01"
            min="0"
            {...form.register('lotInstallmentAmount', { valueAsNumber: true })}
          />
          {form.formState.errors.lotInstallmentAmount && (
            <p className="text-destructive text-sm">
              {form.formState.errors.lotInstallmentAmount.message}
            </p>
          )}
        </div>

        {hasUrbanization && (
          <div className="space-y-2">
            <Label htmlFor="huInstallmentAmount">Monto Cuota HU</Label>
            <Input
              id="huInstallmentAmount"
              type="number"
              step="0.01"
              min="0"
              {...form.register('huInstallmentAmount', { valueAsNumber: true })}
            />
            {form.formState.errors.huInstallmentAmount && (
              <p className="text-destructive text-sm">
                {form.formState.errors.huInstallmentAmount.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="expectedPaymentDate">Fecha de Pago</Label>
          <Input id="expectedPaymentDate" type="date" {...form.register('expectedPaymentDate')} />
          {form.formState.errors.expectedPaymentDate && (
            <p className="text-destructive text-sm">
              {form.formState.errors.expectedPaymentDate.message}
            </p>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
