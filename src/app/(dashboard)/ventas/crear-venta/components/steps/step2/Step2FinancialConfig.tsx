'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';

import { AmortizationItem } from '@/types/sales';

import AmountConfiguration from './AmountConfiguration';
import FinancingConfiguration from './FinancingConfiguration';
import FinancialSummary from './FinancialSummary';
import AmortizationTable from './AmortizationTable';
import {
  AmortizationCalculationData,
  amortizationCalculationSchema,
  CreateSaleFormData,
  Step2FormData,
  step2Schema
} from '../../../validations/saleValidation';
import { useFinancialConfig } from '../../../hooks/useFinancialConfig';
import { useFormSynchronization } from '../../../hooks/useFormSynchronization';

interface Step2Props {
  formData: Partial<CreateSaleFormData> & {
    financingInstallments?: any[];
    initialAmount?: number;
    interestRate?: number;
    quantitySaleCoutes?: number;
  };
  updateFormData: (
    data: Partial<CreateSaleFormData> & {
      financingInstallments?: any[];
      initialAmount?: number;
      interestRate?: number;
      quantitySaleCoutes?: number;
    }
  ) => void;
  updateStepValidation: (step: 'step2', isValid: boolean) => void;
}

export default function Step2FinancialConfig({
  formData,
  updateFormData,
  updateStepValidation
}: Step2Props) {
  const isFinanced = formData.saleType === 'FINANCED';
  const hasUrbanization = (formData.totalAmountUrbanDevelopment || 0) > 0;

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      saleType: formData.saleType || 'DIRECT_PAYMENT',
      totalAmount: formData.totalAmount || 0,
      totalAmountUrbanDevelopment: formData.totalAmountUrbanDevelopment || 0,
      firstPaymentDateHu: formData.firstPaymentDateHu || '',
      initialAmountUrbanDevelopment: formData.initialAmountUrbanDevelopment || 0,
      quantityHuCuotes: formData.quantityHuCuotes || 0,
      // Campos de financiamiento - siempre presentes
      initialAmount: formData.initialAmount || 0,
      interestRate: formData.interestRate || 12,
      quantitySaleCoutes: formData.quantitySaleCoutes || 12,
      financingInstallments: formData.financingInstallments || []
    }
  });

  // Formulario separado para el cálculo de amortización
  const amortizationForm = useForm<AmortizationCalculationData>({
    resolver: zodResolver(amortizationCalculationSchema),
    defaultValues: {
      totalAmount: 0,
      initialAmount: 0,
      interestRate: 12,
      quantitySaleCoutes: 12,
      firstPaymentDate: ''
    }
  });

  // Hook para manejar el cálculo de amortización
  const { amortizationTable, isCalculating, showAmortization, handleCalculateAmortization } =
    useFinancialConfig({
      amortizationForm,
      onAmortizationCalculated: (installments: AmortizationItem[]) => {
        // Actualizar formulario principal con las cuotas calculadas
        form.setValue('financingInstallments', installments);
      }
    });

  // Hook para sincronización de formularios
  useFormSynchronization({
    form,
    amortizationForm,
    isFinanced,
    updateFormData,
    updateStepValidation
  });

  // Obtener valores actuales para el resumen
  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Configuración Financiera
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure los montos y condiciones de pago
        </p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Configuración de montos */}
          <AmountConfiguration
            control={form.control}
            errors={form.formState.errors}
            hasUrbanization={hasUrbanization}
          />

          {/* Configuración de Financiamiento - Solo para ventas financiadas */}
          {isFinanced && (
            <FinancingConfiguration
              control={form.control}
              errors={form.formState.errors}
              amortizationForm={amortizationForm}
              isCalculating={isCalculating}
              onCalculateAmortization={handleCalculateAmortization}
            />
          )}

          {/* Resumen - Ocupa toda la fila */}
          <div className="lg:col-span-2">
            <FinancialSummary
              totalAmount={watchedValues.totalAmount || 0}
              totalAmountUrbanDevelopment={watchedValues.totalAmountUrbanDevelopment || 0}
              isFinanced={isFinanced}
              hasUrbanization={hasUrbanization}
              initialAmount={watchedValues.initialAmount}
              interestRate={watchedValues.interestRate}
              quantitySaleCoutes={watchedValues.quantitySaleCoutes}
            />
          </div>
        </div>
      </Form>

      {/* Tabla de Amortización */}
      <AmortizationTable installments={amortizationTable} visible={showAmortization} />
    </div>
  );
}
