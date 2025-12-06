'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
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
import { useApprovePayment } from '../../hooks/use-approve-payment';
import type { ApprovePaymentInput } from '../../types';

interface ApprovePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
}

export function ApprovePaymentModal({ open, onOpenChange, paymentId }: ApprovePaymentModalProps) {
  const [formData, setFormData] = useState<ApprovePaymentInput>({
    dateOperation: '',
    numberTicket: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ApprovePaymentInput, string>>>({});
  const { mutate, isPending } = useApprovePayment();

  const handleChange = (field: keyof ApprovePaymentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ApprovePaymentInput, string>> = {};

    if (!formData.dateOperation) {
      newErrors.dateOperation = 'La fecha de operación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Clean up empty optional fields
    const submitData: ApprovePaymentInput = {
      dateOperation: formData.dateOperation,
    };

    if (formData.numberTicket?.trim()) {
      submitData.numberTicket = formData.numberTicket;
    }

    mutate(
      { id: paymentId, data: submitData },
      {
        onSuccess: () => {
          // Reset form and close modal
          setFormData({
            dateOperation: '',
            numberTicket: '',
          });
          setErrors({});
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setFormData({
        dateOperation: '',
        numberTicket: '',
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary h-5 w-5" />
            Aprobar Pago
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos de la operación bancaria para aprobar el pago.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Fecha de Operación (Requerido) */}
          <div className="space-y-2">
            <Label htmlFor="dateOperation">
              Fecha de Operación <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dateOperation"
              type="date"
              value={formData.dateOperation}
              onChange={(e) => handleChange('dateOperation', e.target.value)}
              disabled={isPending}
              className={errors.dateOperation ? 'border-destructive' : ''}
            />
            {errors.dateOperation && (
              <p className="text-destructive text-xs">{errors.dateOperation}</p>
            )}
          </div>

          {/* Número de Ticket (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="numberTicket">
              Número de Ticket <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="numberTicket"
              value={formData.numberTicket}
              onChange={(e) => handleChange('numberTicket', e.target.value)}
              placeholder="Ingrese el número de ticket"
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
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aprobando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar Pago
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
