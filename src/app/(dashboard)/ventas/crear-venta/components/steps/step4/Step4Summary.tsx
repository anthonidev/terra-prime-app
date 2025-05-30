'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import DateConfiguration from './DateConfiguration';
import SaleSummaryCards from './SaleSummaryCards';
import PaymentScheduleSummary from './PaymentScheduleSummary';
import ConfirmationMessage from './ConfirmationMessage';
import {
  CreateSaleFormData,
  Step4FormData,
  step4Schema
} from '../../../validations/saleValidation';

interface Step4Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step4', isValid: boolean) => void;
}

export default function Step4Summary({
  formData,
  updateFormData,
  updateStepValidation
}: Step4Props) {
  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      saleDate: formData.saleDate || '',
      contractDate: formData.contractDate || '',
      paymentDate: formData.paymentDate || ''
    }
  });

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = !!(value.saleDate && value.contractDate && value.paymentDate);

      updateStepValidation('step4', isValid);

      if (isValid) {
        updateFormData({
          saleDate: value.saleDate,
          contractDate: value.contractDate,
          paymentDate: value.paymentDate
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation]);

  // Cálculos derivados
  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;
  const totalAmount = (formData.totalAmount || 0) + (formData.totalAmountUrbanDevelopment || 0);
  const installmentsCount = formData.financingInstallments?.length || 0;

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
        {/* Resumen de la Venta */}
        <SaleSummaryCards
          formData={formData}
          isFinanced={isFinanced}
          hasUrbanization={hasUrbanization}
          totalAmount={totalAmount}
        />

        {/* Configuración de Fechas */}
        <div className="space-y-4">
          <Form {...form}>
            <DateConfiguration control={form.control} errors={form.formState.errors} />
          </Form>

          {/* Resumen de Cronograma (solo para ventas financiadas) */}
          <PaymentScheduleSummary
            isFinanced={isFinanced}
            financingInstallments={formData.financingInstallments}
          />
        </div>
      </div>

      {/* Mensaje de confirmación */}
      <ConfirmationMessage isFinanced={isFinanced} installmentsCount={installmentsCount} />
    </div>
  );
}
