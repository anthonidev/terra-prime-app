'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FormDialog } from '@/shared/components/form-dialog';
import { useValidateAdminToken } from '../../hooks/use-validate-admin-token';

interface RequestEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RequestEditModal({ open, onOpenChange, onSuccess }: RequestEditModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate: validateToken, isPending } = useValidateAdminToken();

  const handleChange = (value: string) => {
    setPin(value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (pin.length !== 5) {
      setError('El PIN debe tener 5 dígitos');
      return;
    }

    validateToken(pin, {
      onSuccess: (data) => {
        if (data) {
          // Token válido
          setPin('');
          setError(null);
          onOpenChange(false);
          onSuccess();
        } else {
          // Token inválido
          setError('PIN incorrecto. Intenta nuevamente.');
          setPin('');
        }
      },
      onError: () => {
        setError('Error al validar el PIN. Intenta nuevamente.');
        setPin('');
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setPin('');
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={handleClose}
      title="Solicitar Edición"
      description="Ingresa el PIN de administrador de 5 dígitos para habilitar la edición de los montos totales."
      onSubmit={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
        handleSubmit();
      }}
      submitLabel="Validar PIN"
      isPending={isPending}
      maxWidth="sm"
    >
      <div className="flex flex-col items-center space-y-4 py-4">
        <InputOTP maxLength={5} value={pin} onChange={handleChange} disabled={isPending}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <div className="text-destructive flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {!error && pin.length === 5 && !isPending && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <CheckCircle className="text-primary h-4 w-4" />
            <span>PIN completo. Presiona Validar para continuar.</span>
          </div>
        )}
      </div>
    </FormDialog>
  );
}
