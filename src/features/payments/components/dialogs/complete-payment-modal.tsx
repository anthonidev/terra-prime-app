'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useCompletePayment } from '../../hooks/use-complete-payment';
import type { CompletePaymentInput } from '../../types';
import { formatIsoToDateInputValue } from '@/shared/utils/date-formatter';

interface CompletePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
  initialData?: {
    numberTicket?: string | null;
    observation?: string | null;
    dateOperation?: string | null;
  };
}

export function CompletePaymentModal({
  open,
  onOpenChange,
  paymentId,
  initialData,
}: CompletePaymentModalProps) {
  const [formData, setFormData] = useState<CompletePaymentInput>({
    numberTicket: '',
    observation: '',
    dateOperation: '',
  });

  // Initialize form with existing payment data when modal opens
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        numberTicket: initialData.numberTicket || '',
        observation: initialData.observation || '',
        dateOperation: formatIsoToDateInputValue(initialData.dateOperation),
      });
    }
  }, [open, initialData]);

  const { mutate, isPending } = useCompletePayment();

  const handleChange = (field: keyof CompletePaymentInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Clean up empty optional fields
    const submitData: CompletePaymentInput = {
      numberTicket: formData.numberTicket,
    };

    if (formData.observation?.trim()) {
      submitData.observation = formData.observation;
    }

    if (formData.dateOperation?.trim()) {
      submitData.dateOperation = formData.dateOperation;
    }

    // Only submit if there's at least the required field
    if (!submitData.numberTicket?.trim()) {
      return;
    }

    mutate(
      { id: paymentId, data: submitData },
      {
        onSuccess: () => {
          // Reset form and close modal
          setFormData({
            numberTicket: '',
            observation: '',
            dateOperation: '',
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
        observation: '',
        dateOperation: '',
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

          {/* Fecha de Operación (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="dateOperation">Fecha de Operación</Label>
            <Input
              id="dateOperation"
              type="date"
              value={formData.dateOperation}
              onChange={(e) => handleChange('dateOperation', e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Observación (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observación</Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => handleChange('observation', e.target.value)}
              placeholder="Ingrese una observación (opcional)"
              disabled={isPending}
              rows={3}
            />
          </div>

          {!hasData && (
            <p className="text-muted-foreground text-xs">
              * El número de ticket es requerido para actualizar el pago.
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
