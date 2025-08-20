'use client';

import { useEffect } from 'react';
import { CreateSaleFormData } from '../../../validations/saleValidation';
import ConfirmationMessage from './ConfirmationMessage';
import PaymentScheduleSummary from './PaymentScheduleSummary';
import SaleSummaryCards from './SaleSummaryCards';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface Step4Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step4', isValid: boolean) => void;
}

export default function Step4Summary({ formData, updateFormData, updateStepValidation }: Step4Props) {
  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;
  const totalAmount = (formData.totalAmount || 0) + (formData.totalAmountUrbanDevelopment || 0);
  const installmentsCount = formData.financingInstallments?.length || 0;

  const handleNotesChange = (notes: string) => {
    updateFormData({ notes });
  };

  useEffect(() => {
    const isValid = !!formData.clientId;
    updateStepValidation('step4', isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.clientId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Resumen y Finalización
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Revisa todos los detalles y configura las fechas finales de la venta
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SaleSummaryCards
          formData={formData}
          isFinanced={isFinanced}
          hasUrbanization={hasUrbanization}
          totalAmount={totalAmount}
        />
        <div className="space-y-4">
          <PaymentScheduleSummary
            isFinanced={isFinanced}
            financingInstallments={formData.financingInstallments}
          />
        </div>
      </div>

      {/* Sección de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Notas Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas de la venta (opcional)
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Agregue cualquier información adicional o comentarios sobre esta venta
            </p>
            <Textarea
              id="notes"
              placeholder="Escriba sus notas aquí..."
              value={formData.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmationMessage isFinanced={isFinanced} installmentsCount={installmentsCount} />
    </div>
  );
}
