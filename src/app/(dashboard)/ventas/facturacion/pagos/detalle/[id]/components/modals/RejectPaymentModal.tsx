'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, XCircle } from 'lucide-react';
import { CurrencyType, PaymentDetailItem } from '@/lib/domain/entities/sales/payment.entity';
import { PaymentApproveRejectResponse } from '@infrastructure/types/sales/api-response.types';

interface RejectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => Promise<PaymentApproveRejectResponse | null>;
  payment: PaymentDetailItem | null;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  isSubmitting: boolean;
}

export function RejectPaymentModal({
  isOpen,
  onClose,
  onReject,
  payment,
  rejectionReason,
  setRejectionReason,
  isSubmitting
}: RejectPaymentModalProps) {
  if (!payment) return null;

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Confirmar Rechazo de Pago
          </DialogTitle>
          <DialogDescription>
            Por favor, ingrese el motivo por el cual está rechazando este pago.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">ID de Pago:</span>
              <span className="font-mono">#{payment.id}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Monto:</span>
              <span className="font-semibold text-red-700 dark:text-red-400">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Usuario:</span>
              <span>{payment.user.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason" className="text-sm font-medium">
              Motivo de rechazo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ingrese el motivo por el cual está rechazando este pago"
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            {rejectionReason.trim() === '' && (
              <p className="mt-1 text-xs text-red-500">El motivo de rechazo es obligatorio</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isSubmitting || rejectionReason.trim() === ''}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Rechazar Pago'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
