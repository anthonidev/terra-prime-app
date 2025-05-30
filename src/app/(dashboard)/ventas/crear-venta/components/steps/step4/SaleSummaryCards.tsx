'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, DollarSign, User } from 'lucide-react';
import { CreateSaleFormData } from '../../../validations/saleValidation';

interface SaleSummaryCardsProps {
  formData: Partial<CreateSaleFormData>;
  isFinanced: boolean;
  hasUrbanization: boolean;
  totalAmount: number;
}

export default function SaleSummaryCards({
  formData,
  isFinanced,
  hasUrbanization,
  totalAmount
}: SaleSummaryCardsProps) {
  // Convertir valores a números de manera segura
  const totalAmountNum = Number(formData.totalAmount) || 0;
  const totalAmountUrbanDevelopmentNum = Number(formData.totalAmountUrbanDevelopment) || 0;
  const initialAmountNum = Number(formData.initialAmount) || 0;
  const interestRateNum = Number(formData.interestRate) || 0;
  const quantitySaleCoutesNum = Number(formData.quantitySaleCoutes) || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Resumen de la Venta</h3>

      {/* Información del Lote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4" />
            Información del Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tipo de Venta:</span>
            <Badge variant={isFinanced ? 'default' : 'secondary'}>
              {isFinanced ? 'Financiada' : 'Pago Directo'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información Financiera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            Información Financiera
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Monto del Lote:</span>
            <span className="font-medium">S/ {totalAmountNum.toFixed(2)}</span>
          </div>
          {hasUrbanization && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Habilitación Urbana:</span>
              <span className="font-medium">S/ {totalAmountUrbanDevelopmentNum.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Total:</span>
            <span className="text-lg font-bold">S/ {totalAmount.toFixed(2)}</span>
          </div>

          {isFinanced && (
            <div className="space-y-1 border-t pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Monto Inicial:</span>
                <span className="font-medium">S/ {initialAmountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tasa de Interés:</span>
                <span className="font-medium">{interestRateNum}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Número de Cuotas:</span>
                <span className="font-medium">{quantitySaleCoutesNum}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Cliente ID:</span>
            <span className="font-medium">{formData.clientId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Garante ID:</span>
            <span className="font-medium">{formData.guarantorId}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
