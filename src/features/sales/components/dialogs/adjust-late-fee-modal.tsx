'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormDialog } from '@/shared/components/form-dialog';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { useAdjustLateFee } from '../../hooks/use-adjust-late-fee';
import type { CurrencyType } from '../../types';

const adjustLateFeeSchema = z.object({
  action: z.enum(['ADD', 'REMOVE']),
  amount: z.number({ message: 'Ingrese un monto válido' }).min(0.01, 'El monto debe ser mayor a 0'),
});

type AdjustLateFeeFormValues = z.infer<typeof adjustLateFeeSchema>;

interface AdjustLateFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentId: string;
  saleId: string;
  currentLateFee: number;
  currency: CurrencyType;
}

export function AdjustLateFeeModal({
  open,
  onOpenChange,
  installmentId,
  saleId,
  currentLateFee,
  currency,
}: AdjustLateFeeModalProps) {
  const { mutate: adjustLateFee, isPending } = useAdjustLateFee(saleId);

  const form = useForm<AdjustLateFeeFormValues>({
    resolver: zodResolver(adjustLateFeeSchema),
    defaultValues: {
      action: 'ADD',
      amount: 0,
    },
  });

  const watchAction = form.watch('action');

  useEffect(() => {
    if (open) {
      form.reset({ action: 'ADD', amount: 0 });
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit((values) => {
    if (values.action === 'REMOVE' && values.amount > currentLateFee) {
      form.setError('amount', {
        message: `El monto no puede ser mayor a la mora actual (${formatCurrency(currentLateFee, currency)})`,
      });
      return;
    }

    adjustLateFee(
      { installmentId, data: values },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ajustar Mora"
      description="Agregar o quitar monto de mora a esta cuota"
      icon={AlertTriangle}
      isEditing
      isPending={isPending}
      onSubmit={handleSubmit}
      submitLabel="Ajustar Mora"
      form={form}
    >
      {/* Current late fee info */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
        <p className="text-xs text-amber-700 dark:text-amber-300">Mora Actual</p>
        <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
          {formatCurrency(currentLateFee, currency)}
        </p>
      </div>

      {/* Action select */}
      <div className="space-y-2">
        <Label>Acción</Label>
        <Select
          value={watchAction}
          onValueChange={(value: 'ADD' | 'REMOVE') => {
            form.setValue('action', value);
            form.clearErrors('amount');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar acción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADD">Agregar Mora</SelectItem>
            <SelectItem value="REMOVE">Quitar Mora</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.action && (
          <p className="text-destructive text-sm">{form.formState.errors.action.message}</p>
        )}
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <Label htmlFor="adjust-late-fee-amount">Monto</Label>
        <Input
          id="adjust-late-fee-amount"
          type="number"
          step="0.01"
          min="0.01"
          max={watchAction === 'REMOVE' ? currentLateFee : undefined}
          placeholder="0.00"
          {...form.register('amount', { valueAsNumber: true })}
        />
        {form.formState.errors.amount && (
          <p className="text-destructive text-sm">{form.formState.errors.amount.message}</p>
        )}
        {watchAction === 'REMOVE' && currentLateFee > 0 && (
          <p className="text-muted-foreground text-xs">
            Máximo: {formatCurrency(currentLateFee, currency)}
          </p>
        )}
      </div>
    </FormDialog>
  );
}
