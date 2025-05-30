'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, CheckCircle, DollarSign, Download, FileText, User } from 'lucide-react';

import { SaleResponse } from '@/types/sales';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: SaleResponse;
}

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

export default function SaleSuccessModal({ isOpen, onClose, saleData }: SaleSuccessModalProps) {
  const handleDownloadContract = () => {
    console.log('Downloading contract for sale:', saleData.id);
  };

  const handleViewDetails = () => {
    console.log('Viewing sale details:', saleData.id);
  };

  // Convertir valores a números de manera segura
  const totalAmount = safeNumber(saleData.totalAmount);
  const lotPrice = safeNumber(saleData.lot?.lotPrice);
  const initialAmount = saleData.financing ? safeNumber(saleData.financing.initialAmount) : 0;
  const interestRate = saleData.financing ? safeNumber(saleData.financing.interestRate) : 0;
  const quantityCoutes = saleData.financing ? safeNumber(saleData.financing.quantityCoutes) : 0;
  const reservationAmount = saleData.reservation ? safeNumber(saleData.reservation.amount) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] max-h-[800px] w-[95vw] max-w-2xl flex-col p-0 sm:h-auto sm:max-h-[85vh]">
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-green-800 sm:text-xl dark:text-green-200">
                ¡Venta Creada Exitosamente!
              </DialogTitle>
              <p className="text-sm text-green-600 dark:text-green-400">
                La venta se ha registrado correctamente en el sistema
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Información de la Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tipo de Venta:
                      </span>
                      <Badge variant={saleData.type === 'FINANCED' ? 'default' : 'secondary'}>
                        {saleData.type === 'FINANCED' ? 'Financiada' : 'Pago Directo'}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monto Total:</span>
                      <span className="font-medium">S/ {totalAmount.toFixed(2)}</span>
                    </div>
                    {saleData.guarantor && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Garante:</span>
                        <span className="text-right font-medium">
                          {saleData.guarantor.firstName} {saleData.guarantor.lastName}
                        </span>
                      </div>
                    )}
                    {saleData.client && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cliente:</span>
                        <span className="text-right font-medium">
                          {saleData.client.firstName} {saleData.client.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {saleData.lot && (
                      <>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Lote:</span>
                          <span className="text-right font-medium">{saleData.lot.name}</span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Precio Lote:
                          </span>
                          <span className="text-right font-medium">S/ {lotPrice.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {saleData.client?.address && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Dirección:</span>
                        <span className="text-right text-xs font-medium break-words">
                          {saleData.client.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {saleData.vendor && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Información del Vendedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vendedor:</span>
                        <span className="text-right font-medium">
                          {saleData.vendor.firstName} {saleData.vendor.lastName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Documento:</span>
                        <span className="text-right font-medium">{saleData.vendor.document}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {saleData.financing && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    Información de Financiamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Monto Inicial:
                        </span>
                        <span className="text-right font-medium">
                          S/ {initialAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tasa de Interés:
                        </span>
                        <span className="text-right font-medium">{interestRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Cantidad de Cuotas:
                        </span>
                        <span className="text-right font-medium">{quantityCoutes}</span>
                      </div>
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ID Financiamiento:
                        </span>
                        <span className="text-right font-mono text-xs break-all">
                          {saleData.financing.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {saleData.reservation && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Información de Reserva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Monto de Reserva:
                    </span>
                    <span className="text-right font-medium">
                      S/ {reservationAmount.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Venta registrada exitosamente
                  </h4>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    {saleData.financing
                      ? `Se ha creado el cronograma de ${quantityCoutes} cuotas de financiamiento automáticamente.`
                      : 'El pago directo ha sido registrado correctamente.'}
                  </p>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    Puedes generar el contrato y gestionar los pagos desde el panel de ventas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadContract}
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar Contrato</span>
              <span className="sm:hidden">Contrato</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Detalles</span>
              <span className="sm:hidden">Detalles</span>
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
