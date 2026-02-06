'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import Decimal from 'decimal.js';
import { format, addMonths } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDialog } from '@/shared/components/form-dialog';
import { formatCurrency } from '@/shared/utils/currency-formatter';

const addInstallmentsSchema = z.object({
  quantity: z.number().min(1, 'Debe agregar al menos 1 cuota').max(120, 'Máximo 120 cuotas'),
  lotTotal: z.number().min(0.01, 'El monto lote debe ser mayor a 0'),
  huTotal: z.number().min(0, 'El monto HU no puede ser negativo'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
});

type AddInstallmentsFormData = z.infer<typeof addInstallmentsSchema>;

interface AddAmortizationInstallmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasUrbanization: boolean;
  currency: 'USD' | 'PEN';
  lotBalanceDifference: number;
  huBalanceDifference: number;
  onAdd: (qty: number, lotTotal: number, huTotal: number, startDate: string) => void;
}

export function AddAmortizationInstallmentsDialog({
  open,
  onOpenChange,
  hasUrbanization,
  currency,
  lotBalanceDifference,
  huBalanceDifference,
  onAdd,
}: AddAmortizationInstallmentsDialogProps) {
  const suggestedLot = Math.abs(lotBalanceDifference);
  const suggestedHu = Math.abs(huBalanceDifference);

  const form = useForm<AddInstallmentsFormData>({
    resolver: zodResolver(addInstallmentsSchema),
    defaultValues: {
      quantity: 1,
      lotTotal: suggestedLot > 0 ? suggestedLot : 0,
      huTotal: suggestedHu > 0 ? suggestedHu : 0,
      startDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    },
  });

  const watchedQty = form.watch('quantity');
  const watchedLotTotal = form.watch('lotTotal');
  const watchedHuTotal = form.watch('huTotal');

  const lotPerInstallment =
    watchedQty > 0
      ? new Decimal(watchedLotTotal || 0)
          .dividedBy(watchedQty)
          .toDecimalPlaces(2, Decimal.ROUND_DOWN)
          .toNumber()
      : 0;

  const huPerInstallment =
    watchedQty > 0 && hasUrbanization
      ? new Decimal(watchedHuTotal || 0)
          .dividedBy(watchedQty)
          .toDecimalPlaces(2, Decimal.ROUND_DOWN)
          .toNumber()
      : 0;

  const handleSubmit = (data: AddInstallmentsFormData) => {
    onAdd(data.quantity, data.lotTotal, hasUrbanization ? data.huTotal : 0, data.startDate);
    onOpenChange(false);
    form.reset();
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Agregar Cuotas"
      description="Agregue nuevas cuotas a la tabla de amortización"
      icon={Plus}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitLabel="Agregar cuotas"
    >
      <div className="space-y-4">
        {(lotBalanceDifference < -0.01 || huBalanceDifference < -0.01) && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              El balance actual tiene un faltante. Se sugieren los montos para cubrirlo.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad de cuotas</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="120"
            {...form.register('quantity', { valueAsNumber: true })}
          />
          {form.formState.errors.quantity && (
            <p className="text-destructive text-sm">{form.formState.errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lotTotal">Monto total Lote a distribuir</Label>
          <Input
            id="lotTotal"
            type="number"
            step="0.01"
            min="0"
            {...form.register('lotTotal', { valueAsNumber: true })}
          />
          {form.formState.errors.lotTotal && (
            <p className="text-destructive text-sm">{form.formState.errors.lotTotal.message}</p>
          )}
          {watchedQty > 0 && watchedLotTotal > 0 && (
            <p className="text-muted-foreground text-xs">
              Aprox. {formatCurrency(lotPerInstallment, currency)} por cuota
            </p>
          )}
        </div>

        {hasUrbanization && (
          <div className="space-y-2">
            <Label htmlFor="huTotal">Monto total HU a distribuir</Label>
            <Input
              id="huTotal"
              type="number"
              step="0.01"
              min="0"
              {...form.register('huTotal', { valueAsNumber: true })}
            />
            {form.formState.errors.huTotal && (
              <p className="text-destructive text-sm">{form.formState.errors.huTotal.message}</p>
            )}
            {watchedQty > 0 && watchedHuTotal > 0 && (
              <p className="text-muted-foreground text-xs">
                Aprox. {formatCurrency(huPerInstallment, currency)} por cuota
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de primera cuota</Label>
          <Input id="startDate" type="date" {...form.register('startDate')} />
          {form.formState.errors.startDate && (
            <p className="text-destructive text-sm">{form.formState.errors.startDate.message}</p>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
