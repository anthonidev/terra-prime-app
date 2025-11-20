'use client';

import { useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
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
import { useExtendReservation } from '../../hooks/use-extend-reservation';
import type { ExtendReservationInput } from '../../types';

interface ExtendReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
}

export function ExtendReservationModal({
  open,
  onOpenChange,
  saleId,
}: ExtendReservationModalProps) {
  const [additionalDays, setAdditionalDays] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useExtendReservation();

  const handleChange = (value: string) => {
    setAdditionalDays(value);
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const days = parseInt(additionalDays);

    if (!additionalDays || isNaN(days)) {
      setError('Ingrese un número válido de días');
      return false;
    }

    if (days <= 0) {
      setError('El número de días debe ser mayor a 0');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const data: ExtendReservationInput = {
      additionalDays: parseInt(additionalDays),
    };

    mutate(
      { saleId, data },
      {
        onSuccess: () => {
          setAdditionalDays('');
          setError(null);
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setAdditionalDays('');
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" />
            Extender Reserva
          </DialogTitle>
          <DialogDescription>
            Ingresa el número de días adicionales para extender el período de reserva.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="additionalDays">
              Días Adicionales <span className="text-destructive">*</span>
            </Label>
            <Input
              id="additionalDays"
              type="number"
              min="1"
              value={additionalDays}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Ej: 15"
              disabled={isPending}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
            <p className="text-muted-foreground text-xs">
              Los días adicionales se sumarán al período actual de reserva.
            </p>
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
            disabled={isPending || !additionalDays}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extendiendo...
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Extender Reserva
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
