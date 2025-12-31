'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';

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
import { formatCurrency } from '@/shared/lib/utils';

const addInstallmentsSchema = z.object({
  quantity: z.number().min(1, 'Mínimo 1 cuota').max(120, 'Máximo 120 cuotas'),
  totalAmount: z.number().min(1, 'El monto debe ser mayor a 0'),
  startDate: z.string().min(1, 'La fecha es requerida'),
});

type AddInstallmentsForm = z.infer<typeof addInstallmentsSchema>;

interface AddInstallmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (quantity: number, totalAmount: number, startDate: string) => void;
  suggestedAmount: number;
}

export function AddInstallmentsModal({
  open,
  onOpenChange,
  onAdd,
  suggestedAmount,
}: AddInstallmentsModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddInstallmentsForm>({
    resolver: zodResolver(addInstallmentsSchema),
    defaultValues: {
      quantity: 12,
      totalAmount: suggestedAmount > 0 ? suggestedAmount : 0,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  // Reset form when modal opens with current suggested amount
  useEffect(() => {
    if (open) {
      reset({
        quantity: 12,
        totalAmount: suggestedAmount > 0 ? suggestedAmount : 0,
        startDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [open, suggestedAmount, reset]);

  const quantity = watch('quantity');
  const totalAmount = watch('totalAmount');

  // Update preview when values change
  const amountPerInstallment = quantity > 0 && totalAmount > 0 ? totalAmount / quantity : 0;

  const onSubmit = (data: AddInstallmentsForm) => {
    onAdd(data.quantity, data.totalAmount, data.startDate);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Cuotas
          </DialogTitle>
          <DialogDescription>
            Ingrese la cantidad de cuotas, el monto total y la fecha de inicio. El monto se dividirá
            automáticamente entre las cuotas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad de Cuotas</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={120}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-destructive text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Monto Total</Label>
            <Input
              id="totalAmount"
              type="number"
              step="0.01"
              min={0}
              {...register('totalAmount', { valueAsNumber: true })}
            />
            {errors.totalAmount && (
              <p className="text-destructive text-sm">{errors.totalAmount.message}</p>
            )}
            {suggestedAmount > 0 && (
              <p className="text-muted-foreground text-xs">
                Monto sugerido: {formatCurrency(suggestedAmount)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input id="startDate" type="date" {...register('startDate')} />
            {errors.startDate && (
              <p className="text-destructive text-sm">{errors.startDate.message}</p>
            )}
          </div>

          {/* Preview */}
          {amountPerInstallment > 0 && (
            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Vista previa:</p>
              <p className="font-medium">
                {quantity} cuotas de {formatCurrency(amountPerInstallment)} cada una
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Cuotas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
