'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, X } from 'lucide-react';
import { useValidatePin } from '../../hooks/useValidatePin';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPinValidated: (isValid: boolean) => void;
}

export default function ValidatePinModal({ isOpen, onClose, onPinValidated }: Props) {
  const [pinDigits, setPinDigits] = useState<string[]>(Array(5).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading, onValidatePin } = useValidatePin(pinDigits.join(''));

  const handleValidate = async () => {
    const isValid = await onValidatePin();
    if (isValid) toast.success('Pin validado correctamente');
    onPinValidated(isValid);
  };

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newPinDigits = [...pinDigits];
    newPinDigits[index] = value;
    setPinDigits(newPinDigits);

    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  useEffect(() => {
    if (isOpen) {
      setPinDigits(Array(5).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-auto w-sm max-w-2xl flex-col p-0">
        <DialogHeader className="flex-shrink-0 rounded-t-md border-b border-gray-100 bg-white px-4 py-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12 dark:bg-green-900/60">
              <Bell className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6 dark:text-slate-100" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold sm:text-xl dark:text-slate-100">
                Notificación
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ingrese el PIN de 5 dígitos para continuar
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white text-2xl font-medium dark:bg-gray-900">
              <CardContent className="flex justify-center space-x-2 p-4">
                {pinDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="h-12 w-12 rounded-md border text-center text-xl font-medium focus:border-blue-500 focus:outline-none"
                    value={digit}
                    onChange={(e) => handlePinChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    type="text"
                    pattern="[A-Z0-9]"
                    inputMode="text"
                    autoComplete="off"
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 rounded-b-md border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <X className="h-4 w-4" />
              <span className="">Cerrar</span>
            </Button>
            <Button
              onClick={handleValidate}
              disabled={pinDigits.some((d) => d === '') || isLoading}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              {isLoading ? (
                'Validando...'
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Validar
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
