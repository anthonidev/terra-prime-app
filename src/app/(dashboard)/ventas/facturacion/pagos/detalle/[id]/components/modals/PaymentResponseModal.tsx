'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { PaymentApproveRejectResponse } from '@infrastructure/types/sales/api-response.types';
import { format } from 'date-fns';
import { CheckCircle2, ListChecks, XCircle } from 'lucide-react';

interface PaymentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  approveResponse: PaymentApproveRejectResponse | null;
  rejectResponse: PaymentApproveRejectResponse | null;
  onViewAllPayments: () => void;
}

export function PaymentResponseModal({
  isOpen,
  onClose,
  approveResponse,
  rejectResponse,
  onViewAllPayments
}: PaymentResponseModalProps) {
  const response = approveResponse || rejectResponse;

  if (!response) return null;

  const isApproved = !!approveResponse;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApproved ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Pago Aprobado Exitosamente
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Pago Rechazado Exitosamente
              </>
            )}
          </DialogTitle>
          <DialogDescription>{response.status}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div
            className={`rounded-lg border p-4 ${
              isApproved
                ? 'border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID de Pago:</span>
                <span className="font-mono">#{response.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Procesado por:</span>
                <span>{'---'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Fecha:</span>
                <span>{format(new Date(response.createdAt), 'dd/MM/yyyy HH:mm:ss')}</span>
              </div>

              {/* {response.user && (
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Datos del Usuario</span>
                  </div>

                  <div className="grid gap-2 pl-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Nombre:</span>
                      <span className="text-sm">No disponible</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Email:</span>
                      <span className="text-sm">{'No disponible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Teléfono:</span>
                      <span className="text-sm">{'No disponible'}</span>
                    </div>
                  </div>
                </div>
              )} */}

              {!isApproved && rejectResponse && (
                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <p className="mb-1 text-sm font-medium">Motivo de rechazo:</p>
                  <p className="rounded bg-red-100/50 p-2 text-sm dark:bg-red-900/30">--</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="default" onClick={onViewAllPayments} className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Ver todos los pagos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
