'use client';

import { useState } from 'react';
import { Edit, Loader2 } from 'lucide-react';
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
import { useCompletePayment } from '../../hooks/use-complete-payment';
import type { CompletePaymentInput } from '../../types';

interface CompletePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
}

export function CompletePaymentModal({ open, onOpenChange, paymentId }: CompletePaymentModalProps) {
  const [formData, setFormData] = useState<CompletePaymentInput>({
    numberTicket: '',
  });

  const { mutate, isPending } = useCompletePayment();

  const handleChange = (field: keyof CompletePaymentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Clean up empty optional fields
    const submitData: CompletePaymentInput = {
      numberTicket: formData.numberTicket,
    };

    if (formData.numberTicket?.trim()) {
      submitData.numberTicket = formData.numberTicket;
    }

    // Only submit if there's at least one value
    if (!submitData.numberTicket) {
      return;
    }

    mutate(
      { id: paymentId, data: submitData },
      {
        onSuccess: () => {
          // Reset form and close modal
          setFormData({
            numberTicket: '',
          });
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setFormData({
        numberTicket: '',
      });
      onOpenChange(false);
    }
  };

  const hasData = !!formData.numberTicket?.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="text-primary h-5 w-5" />
            Actualizar Pago
          </DialogTitle>
          <DialogDescription>
            Actualiza la información adicional del pago aprobado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Número de Ticket (Requerido) */}
          <div className="space-y-2">
            <Label htmlFor="numberTicket">
              Número de Ticket <span className="text-destructive">*</span>
            </Label>
            <Input
              id="numberTicket"
              value={formData.numberTicket}
              onChange={(e) => handleChange('numberTicket', e.target.value)}
              placeholder="Ingrese el número de ticket"
              disabled={isPending}
            />
          </div>

          {!hasData && (
            <p className="text-muted-foreground text-xs">
              * Al menos uno de los campos debe tener un valor para actualizar el pago.
            </p>
          )}
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
            disabled={isPending || !hasData}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Actualizar Pago
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
