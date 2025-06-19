'use client';

import { useEffect } from 'react';
import { CreateSaleFormData } from '../../../validations/saleValidation';
import ConfirmationMessage from './ConfirmationMessage';
import PaymentScheduleSummary from './PaymentScheduleSummary';
import SaleSummaryCards from './SaleSummaryCards';

interface Step4Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step4', isValid: boolean) => void;
}

export default function Step4Summary({ formData, updateStepValidation }: Step4Props) {
  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;
  const totalAmount = (formData.totalAmount || 0) + (formData.totalAmountUrbanDevelopment || 0);
  const installmentsCount = formData.financingInstallments?.length || 0;

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

      <ConfirmationMessage isFinanced={isFinanced} installmentsCount={installmentsCount} />
    </div>
  );
}
