'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layers, DollarSign, CalendarDays } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormDialog } from '@/shared/components/form-dialog';
import { cn } from '@/lib/utils';

const bulkAmountsSchema = z.object({
  lotTotal: z.number().min(0, 'El monto no puede ser negativo'),
  huTotal: z.number().min(0, 'El monto no puede ser negativo'),
});

const bulkDatesSchema = z.object({
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
});

type BulkAmountsFormData = z.infer<typeof bulkAmountsSchema>;
type BulkDatesFormData = z.infer<typeof bulkDatesSchema>;

type TabMode = 'amounts' | 'dates';

interface BulkEditAmortizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  hasUrbanization: boolean;
  onBulkUpdateAmounts: (lotTotal: number, huTotal: number) => void;
  onBulkUpdateDates: (startDate: string) => void;
}

export function BulkEditAmortizationDialog({
  open,
  onOpenChange,
  selectedCount,
  hasUrbanization,
  onBulkUpdateAmounts,
  onBulkUpdateDates,
}: BulkEditAmortizationDialogProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('amounts');

  const amountsForm = useForm<BulkAmountsFormData>({
    resolver: zodResolver(bulkAmountsSchema),
    defaultValues: { lotTotal: 0, huTotal: 0 },
  });

  const datesForm = useForm<BulkDatesFormData>({
    resolver: zodResolver(bulkDatesSchema),
    defaultValues: { startDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd') },
  });

  const handleAmountsSubmit = (data: BulkAmountsFormData) => {
    onBulkUpdateAmounts(data.lotTotal, hasUrbanization ? data.huTotal : 0);
    onOpenChange(false);
    amountsForm.reset();
  };

  const handleDatesSubmit = (data: BulkDatesFormData) => {
    onBulkUpdateDates(data.startDate);
    onOpenChange(false);
    datesForm.reset();
  };

  const activeForm = activeTab === 'amounts' ? amountsForm : datesForm;
  const handleSubmit =
    activeTab === 'amounts'
      ? amountsForm.handleSubmit(handleAmountsSubmit)
      : datesForm.handleSubmit(handleDatesSubmit);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Editar ${selectedCount} cuotas`}
      description="Modifique montos o fechas de las cuotas seleccionadas"
      isEditing
      icon={Layers}
      form={activeForm}
      onSubmit={handleSubmit}
      submitLabel={activeTab === 'amounts' ? 'Distribuir montos' : 'Actualizar fechas'}
    >
      <div className="space-y-4">
        {/* Tab switcher */}
        <div className="bg-muted flex rounded-lg p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('flex-1 gap-2', activeTab === 'amounts' && 'bg-background shadow-sm')}
            onClick={() => setActiveTab('amounts')}
          >
            <DollarSign className="h-4 w-4" />
            Editar Montos
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('flex-1 gap-2', activeTab === 'dates' && 'bg-background shadow-sm')}
            onClick={() => setActiveTab('dates')}
          >
            <CalendarDays className="h-4 w-4" />
            Editar Fechas
          </Button>
        </div>

        {activeTab === 'amounts' ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              El monto total se distribuirá equitativamente entre las {selectedCount} cuotas
              seleccionadas.
            </p>

            <div className="space-y-2">
              <Label htmlFor="lotTotal">Monto total Lote a distribuir</Label>
              <Input
                id="lotTotal"
                type="number"
                step="0.01"
                min="0"
                {...amountsForm.register('lotTotal', { valueAsNumber: true })}
              />
              {amountsForm.formState.errors.lotTotal && (
                <p className="text-destructive text-sm">
                  {amountsForm.formState.errors.lotTotal.message}
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
                  {...amountsForm.register('huTotal', { valueAsNumber: true })}
                />
                {amountsForm.formState.errors.huTotal && (
                  <p className="text-destructive text-sm">
                    {amountsForm.formState.errors.huTotal.message}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Las fechas se asignarán con incremento mensual a partir de la fecha seleccionada para
              las {selectedCount} cuotas seleccionadas.
            </p>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input id="startDate" type="date" {...datesForm.register('startDate')} />
              {datesForm.formState.errors.startDate && (
                <p className="text-destructive text-sm">
                  {datesForm.formState.errors.startDate.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </FormDialog>
  );
}
