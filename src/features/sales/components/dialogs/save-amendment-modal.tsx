'use client';

import { useState } from 'react';
import { AlertTriangle, Save } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/shared/lib/utils';
import type { AmendmentInstallmentLocal } from '../../types';

interface SaveAmendmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (observation?: string) => void;
  isLoading: boolean;
  installments: AmendmentInstallmentLocal[];
  additionalAmount: number;
  totalPaidAmount: number;
}

export function SaveAmendmentModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  installments,
  additionalAmount,
  totalPaidAmount,
}: SaveAmendmentModalProps) {
  const [observation, setObservation] = useState('');

  const pendingInstallments = installments.filter((i) => i.status === 'PENDING');
  const totalPending = pendingInstallments.reduce((sum, i) => sum + i.amount, 0);

  const handleConfirm = () => {
    onConfirm(observation.trim() || undefined);
  };

  const handleClose = () => {
    if (!isLoading) {
      setObservation('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Adenda
          </DialogTitle>
          <DialogDescription>
            Esta acción modificará el cronograma de pagos del financiamiento. Por favor revise los
            cambios antes de confirmar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
            <h4 className="font-medium">Resumen de la Adenda</h4>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cuota inicial (pagada):</span>
              </div>
              <div className="text-right font-medium text-green-600">
                {formatCurrency(totalPaidAmount)}
              </div>

              <div>
                <span className="text-muted-foreground">Cuotas nuevas:</span>
              </div>
              <div className="text-right font-medium">{pendingInstallments.length}</div>

              <div>
                <span className="text-muted-foreground">Total cuotas pendientes:</span>
              </div>
              <div className="text-right font-medium">{formatCurrency(totalPending)}</div>

              {additionalAmount !== 0 && (
                <>
                  <div>
                    <span className="text-muted-foreground">
                      {additionalAmount > 0 ? 'Monto adicional:' : 'Descuento:'}
                    </span>
                  </div>
                  <div
                    className={`text-right font-medium ${additionalAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}
                  >
                    {additionalAmount > 0 ? '+' : ''}
                    {formatCurrency(additionalAmount)}
                  </div>
                </>
              )}

              <div className="col-span-2 border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total cuotas:</span>
                  <span>{installments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-medium">Advertencia</p>
              <p>
                Esta acción eliminará el cronograma actual y lo reemplazará con el nuevo. Esta
                operación no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observación (opcional)</Label>
            <Textarea
              id="observation"
              placeholder="Ingrese una observación o motivo de la adenda..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Confirmar Adenda
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
