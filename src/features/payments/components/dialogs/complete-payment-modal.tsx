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

export function CompletePaymentModal({
  open,
  onOpenChange,
  paymentId,
}: CompletePaymentModalProps) {
  const [formData, setFormData] = useState<CompletePaymentInput>({
    codeOperation: '',
    numberTicket: '',
  });

  const { mutate, isPending } = useCompletePayment();

  const handleChange = (field: keyof CompletePaymentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Clean up empty optional fields
    const submitData: CompletePaymentInput = {};

    if (formData.codeOperation?.trim()) {
      submitData.codeOperation = formData.codeOperation;
    }

    if (formData.numberTicket?.trim()) {
      submitData.numberTicket = formData.numberTicket;
    }

    // Only submit if there's at least one value
    if (Object.keys(submitData).length === 0) {
      return;
    }

    mutate(
      { id: paymentId, data: submitData },
      {
        onSuccess: () => {
          // Reset form and close modal
          setFormData({
            codeOperation: '',
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
        codeOperation: '',
        numberTicket: '',
      });
      onOpenChange(false);
    }
  };

  const hasData = formData.codeOperation?.trim() || formData.numberTicket?.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Actualizar Pago
          </DialogTitle>
          <DialogDescription>
            Actualiza la información adicional del pago aprobado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Código de Operación (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="codeOperation">
              Código de Operación <span className="text-xs text-muted-foreground">(Opcional)</span>
            </Label>
            <Input
              id="codeOperation"
              value={formData.codeOperation}
              onChange={(e) => handleChange('codeOperation', e.target.value)}
              placeholder="Ingrese el código de operación"
              disabled={isPending}
            />
          </div>

          {/* Número de Ticket (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="numberTicket">
              Número de Ticket <span className="text-xs text-muted-foreground">(Opcional)</span>
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
            <p className="text-xs text-muted-foreground">
              * Al menos uno de los campos debe tener un valor para actualizar el pago.
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Actualizar Pago
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
