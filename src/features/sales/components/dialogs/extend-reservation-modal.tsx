'use client';

import { useState } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';

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
    <FormDialog
      open={open}
      onOpenChange={handleClose}
      title="Extender Reserva"
      description="Ingresa el número de días adicionales para extender el período de reserva."
      submitLabel="Extender Reserva"
      cancelLabel="Cancelar"
      onSubmit={() => handleSubmit()}
      isPending={isPending}
    >
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
    </FormDialog>
  );
}
