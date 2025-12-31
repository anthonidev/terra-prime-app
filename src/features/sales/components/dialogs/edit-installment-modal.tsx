'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AmendmentInstallmentLocal } from '../../types';

const editInstallmentSchema = z.object({
  amount: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  dueDate: z.string().min(1, 'La fecha es requerida'),
});

type EditInstallmentForm = z.infer<typeof editInstallmentSchema>;

interface EditInstallmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installment: AmendmentInstallmentLocal | null;
  onSave: (id: string, updates: Partial<AmendmentInstallmentLocal>) => void;
}

export function EditInstallmentModal({
  open,
  onOpenChange,
  installment,
  onSave,
}: EditInstallmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditInstallmentForm>({
    resolver: zodResolver(editInstallmentSchema),
  });

  // Reset form when installment changes
  useEffect(() => {
    if (installment) {
      reset({
        amount: installment.amount,
        dueDate: installment.dueDate,
      });
    }
  }, [installment, reset]);

  const onSubmit = (data: EditInstallmentForm) => {
    if (!installment) return;
    onSave(installment.id, {
      amount: data.amount,
      dueDate: data.dueDate,
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!installment) return null;

  const isFirstPaidInstallment = installment.status === 'PAID';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar Cuota #{installment.numberCuote}
          </DialogTitle>
          <DialogDescription>
            {isFirstPaidInstallment
              ? 'Esta es la cuota inicial pagada. Solo puede modificar la fecha.'
              : 'Modifique el monto y/o la fecha de vencimiento de la cuota.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={0}
              disabled={isFirstPaidInstallment}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
            {isFirstPaidInstallment && (
              <p className="text-muted-foreground text-xs">
                El monto de la cuota pagada no puede ser modificado.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
            {errors.dueDate && <p className="text-destructive text-sm">{errors.dueDate.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
