'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Download,
  FileText,
  User,
  DollarSign,
  Calendar,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { SaleResponse } from '@/types/sales';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: SaleResponse;
}

export default function SaleSuccessModal({ isOpen, onClose, saleData }: SaleSuccessModalProps) {
  const handleDownloadContract = () => {
    // Aquí iría la lógica para descargar el contrato
    console.log('Downloading contract for sale:', saleData.id);
  };

  const handleViewDetails = () => {
    // Aquí iría la navegación a los detalles de la venta
    console.log('Viewing sale details:', saleData.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-green-800 dark:text-green-200">
                ¡Venta Creada Exitosamente!
              </DialogTitle>
              <p className="text-sm text-green-600 dark:text-green-400">
                La venta se ha registrado correctamente en el sistema
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="space-y-6">
            {/* Información Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Información de la Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Garante:</span>
                      <span className="font-medium">
                        {saleData.guarantor.firstName} {saleData.guarantor.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Dirección:</span>
                      <span className="text-xs font-medium">{saleData.client.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Vendedor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Información del Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Vendedor:</span>
                      <span className="font-medium">
                        {saleData.vendor.firstName} {saleData.vendor.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Documento:</span>
                      <span className="font-medium">{saleData.vendor.document}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Financiamiento (solo si aplica) */}
            {saleData.financing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    Información de Financiamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Monto Inicial:</span>
                        <span className="font-medium">
                          S/ {saleData.financing.initialAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tasa de Interés:</span>
                        <span className="font-medium">{saleData.financing.interestRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cantidad de Cuotas:
                        </span>
                        <span className="font-medium">{saleData.financing.quantityCoutes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">ID Financiamiento:</span>
                        <span className="font-mono text-xs">{saleData.financing.id}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información de Reserva (si aplica) */}
            {saleData.reservation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Información de Reserva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monto de Reserva:</span>
                    <span className="font-medium">S/ {saleData.reservation.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje de éxito */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Venta registrada exitosamente
                  </h4>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    {saleData.financing
                      ? `Se ha creado el cronograma de ${saleData.financing.quantityCoutes} cuotas de financiamiento automáticamente.`
                      : 'El pago directo ha sido registrado correctamente.'}
                  </p>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    Puedes generar el contrato y gestionar los pagos desde el panel de ventas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3 border-t pt-6">
            <Button
              variant="outline"
              onClick={handleDownloadContract}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar Contrato
            </Button>
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Ver Detalles
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
