'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useDeleteSale } from '../../hooks/use-delete-sale';
import { useValidateAdminToken } from '../../hooks/use-validate-admin-token';

interface DeleteSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
  clientName: string;
}

export function DeleteSaleModal({ open, onOpenChange, saleId, clientName }: DeleteSaleModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const { mutate: validateToken, isPending: isValidating } = useValidateAdminToken();
  const { mutate: deleteSale, isPending: isDeleting } = useDeleteSale();

  const handleChange = (value: string) => {
    setPin(value);
    if (error) {
      setError(null);
    }
    if (isValidated) {
      setIsValidated(false);
    }
  };

  const handleValidate = () => {
    if (pin.length !== 5) {
      setError('El PIN debe tener 5 dígitos');
      return;
    }

    validateToken(pin, {
      onSuccess: (data) => {
        if (data) {
          // Token válido
          setError(null);
          setIsValidated(true);
        } else {
          // Token inválido
          setError('PIN incorrecto. Intenta nuevamente.');
          setPin('');
          setIsValidated(false);
        }
      },
      onError: () => {
        setError('Error al validar el PIN. Intenta nuevamente.');
        setPin('');
        setIsValidated(false);
      },
    });
  };

  const handleDelete = () => {
    if (!isValidated) {
      setError('Primero debes validar el PIN');
      return;
    }

    deleteSale(
      { saleId, data: { token: pin } },
      {
        onSuccess: () => {
          setPin('');
          setError(null);
          setIsValidated(false);
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isValidating && !isDeleting) {
      setPin('');
      setError(null);
      setIsValidated(false);
      onOpenChange(false);
    }
  };

  const isPending = isValidating || isDeleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Eliminar Venta
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La venta de <strong>{clientName}</strong> será
            eliminada permanentemente.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Advertencia:</strong> Esta acción eliminará todos los datos asociados a esta
            venta.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <p className="mb-2 text-sm font-medium">
                  Ingresa el PIN de administrador para confirmar
                </p>
              </div>

              <InputOTP
                maxLength={5}
                value={pin}
                onChange={handleChange}
                disabled={isPending || isValidated}
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
                <div className="text-destructive flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {isValidated && (
                <div className="text-primary flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>PIN validado. Puedes proceder con la eliminación.</span>
                </div>
              )}

              {!isValidated && pin.length === 5 && !isPending && !error && (
                <Button type="button" onClick={handleValidate} variant="outline" size="sm">
                  Validar PIN
                </Button>
              )}
            </div>
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || !isValidated}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Venta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
