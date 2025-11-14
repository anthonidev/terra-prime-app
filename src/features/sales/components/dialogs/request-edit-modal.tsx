'use client';

import { useState } from 'react';
import { Key, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useValidateAdminToken } from '../../hooks/use-validate-admin-token';

interface RequestEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RequestEditModal({
  open,
  onOpenChange,
  onSuccess,
}: RequestEditModalProps) {
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Solicitar Edición
          </DialogTitle>
          <DialogDescription>
            Ingresa el PIN de administrador de 5 dígitos para habilitar la edición de los montos totales.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={5}
              value={pin}
              onChange={handleChange}
              disabled={isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {!error && pin.length === 5 && !isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>PIN completo. Presiona Validar para continuar.</span>
              </div>
            )}
          </div>
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
            disabled={isPending || pin.length !== 5}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Validar PIN
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
