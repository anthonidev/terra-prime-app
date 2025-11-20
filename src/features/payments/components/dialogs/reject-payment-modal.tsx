'use client';

import { useState } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRejectPayment } from '../../hooks/use-reject-payment';
import type { RejectPaymentInput } from '../../types';

interface RejectPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
}

export function RejectPaymentModal({ open, onOpenChange, paymentId }: RejectPaymentModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useRejectPayment();

  const handleChange = (value: string) => {
    setRejectionReason(value);
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!rejectionReason.trim()) {
      setError('La razón de rechazo es requerida');
      return false;
    }

    if (rejectionReason.trim().length < 10) {
      setError('La razón de rechazo debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData: RejectPaymentInput = {
      rejectionReason: rejectionReason.trim(),
    };

    mutate(
      { id: paymentId, data: submitData },
      {
        onSuccess: () => {
          // Reset form and close modal
          setRejectionReason('');
          setError(null);
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setRejectionReason('');
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="text-destructive h-5 w-5" />
            Rechazar Pago
          </DialogTitle>
          <DialogDescription>
            Proporciona la razón por la cual estás rechazando este pago. Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Razón de Rechazo (Requerido) */}
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">
              Razón de Rechazo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Explica el motivo del rechazo (mínimo 10 caracteres)"
              disabled={isPending}
              className={error ? 'border-destructive' : ''}
              rows={4}
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
            <p className="text-muted-foreground text-xs">{rejectionReason.length} caracteres</p>
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
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending || !rejectionReason.trim()}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar Pago
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
