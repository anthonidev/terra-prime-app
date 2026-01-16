'use client';

import { useEffect, useState } from 'react';
import { Edit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateVoucher } from '../../hooks/use-payment-detail';
import type { PaymentVoucher, UpdateVoucherInput, StatusPayment } from '../../types';

interface EditVoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucher: PaymentVoucher | null;
  paymentId: string;
  paymentStatus: StatusPayment;
}

export function EditVoucherModal({
  open,
  onOpenChange,
  voucher,
  paymentId,
  paymentStatus,
}: EditVoucherModalProps) {
  const [formData, setFormData] = useState<UpdateVoucherInput>({
    bankName: '',
    transactionReference: '',
    transactionDate: '',
    codeOperation: '',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { mutate, isPending } = useUpdateVoucher(paymentId);

  // Helper to convert ISO date to input format (YYYY-MM-DD)
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Initialize form with voucher data
  useEffect(() => {
    if (voucher && open) {
      setFormData({
        bankName: voucher.bankName || '',
        transactionReference: voucher.transactionReference || '',
        transactionDate: formatDateForInput(voucher.transactionDate),
        codeOperation: voucher.codeOperation || '',
      });
    }
  }, [voucher, open]);

  const handleChange = (field: keyof UpdateVoucherInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const performUpdate = () => {
    if (!voucher) return;

    // Build update data with only changed fields
    const updateData: UpdateVoucherInput = {};
    const originalDate = formatDateForInput(voucher.transactionDate);

    if (formData.bankName !== voucher.bankName) {
      updateData.bankName = formData.bankName;
    }
    if (formData.transactionReference !== voucher.transactionReference) {
      updateData.transactionReference = formData.transactionReference;
    }
    if (formData.transactionDate !== originalDate) {
      updateData.transactionDate = formData.transactionDate;
    }
    if (formData.codeOperation !== (voucher.codeOperation || '')) {
      updateData.codeOperation = formData.codeOperation;
    }

    // Only submit if there are changes
    if (Object.keys(updateData).length === 0) {
      onOpenChange(false);
      return;
    }

    mutate(
      { id: voucher.id, data: updateData },
      {
        onSuccess: () => {
          setShowConfirmDialog(false);
          onOpenChange(false);
        },
      }
    );
  };

  const handleSubmit = () => {
    // If payment status is PENDING, update directly
    if (paymentStatus === 'PENDING') {
      performUpdate();
    } else {
      // Show confirmation dialog for non-PENDING status
      setShowConfirmDialog(true);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setFormData({
        bankName: '',
        transactionReference: '',
        transactionDate: '',
        codeOperation: '',
      });
      onOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    if (!isPending) {
      setShowConfirmDialog(false);
    }
  };

  const hasChanges =
    voucher &&
    (formData.bankName !== voucher.bankName ||
      formData.transactionReference !== voucher.transactionReference ||
      formData.transactionDate !== formatDateForInput(voucher.transactionDate) ||
      formData.codeOperation !== (voucher.codeOperation || ''));

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="text-primary h-5 w-5" />
              Editar Comprobante
            </DialogTitle>
            <DialogDescription>
              Actualiza la información del comprobante #{voucher?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Banco */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Banco</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="Nombre del banco"
                disabled={isPending}
              />
            </div>

            {/* Referencia de Transacción */}
            <div className="space-y-2">
              <Label htmlFor="transactionReference">Referencia de Transacción</Label>
              <Input
                id="transactionReference"
                value={formData.transactionReference}
                onChange={(e) => handleChange('transactionReference', e.target.value)}
                placeholder="Referencia de la transacción"
                disabled={isPending}
              />
            </div>

            {/* Fecha de Transacción */}
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Fecha de Transacción</Label>
              <Input
                id="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleChange('transactionDate', e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Código de Operación */}
            <div className="space-y-2">
              <Label htmlFor="codeOperation">Código de Operación</Label>
              <Input
                id="codeOperation"
                value={formData.codeOperation}
                onChange={(e) => handleChange('codeOperation', e.target.value)}
                placeholder="Código de operación"
                disabled={isPending}
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
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !hasChanges}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for non-PENDING status */}
      <AlertDialog open={showConfirmDialog} onOpenChange={handleConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar actualización</AlertDialogTitle>
            <AlertDialogDescription>
              Este pago ya no está en estado pendiente. ¿Estás seguro de que deseas actualizar la
              información del comprobante?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={performUpdate} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Confirmar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
