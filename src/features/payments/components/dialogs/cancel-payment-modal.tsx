'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, XCircle } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCancelPayment } from '../../hooks/use-cancel-payment';

interface CancelPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
}

export function CancelPaymentModal({ open, onOpenChange, paymentId }: CancelPaymentModalProps) {
  const [cancellationReason, setCancellationReason] = useState('');

  const { mutate, isPending } = useCancelPayment();

  const handleSubmit = () => {
    if (!cancellationReason.trim()) {
      return;
    }

    mutate(
      { id: paymentId, data: { cancellationReason: cancellationReason.trim() } },
      {
        onSuccess: () => {
          setCancellationReason('');
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setCancellationReason('');
      onOpenChange(false);
    }
  };

  const isValid = cancellationReason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="text-destructive h-5 w-5" />
            Cancelar Pago
          </DialogTitle>
          <DialogDescription>
            Esta acción cancelará el pago y revertirá los cambios en el saldo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Advertencia:</strong> Al cancelar este pago, el saldo de la deuda volverá a
              como estaba antes de registrar el pago. Esta acción no se puede deshacer.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="cancellationReason">
              Razón de cancelación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancellationReason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Ingrese la razón por la cual se cancela este pago..."
              disabled={isPending}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Volver
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Confirmar Cancelación
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
