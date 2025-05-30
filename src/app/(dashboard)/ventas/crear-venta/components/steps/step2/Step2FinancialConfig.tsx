'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import { AmortizationItem } from '@/types/sales';

import { useFinancialConfig } from '../../../hooks/useFinancialConfig';
import { useFormSynchronization } from '../../../hooks/useFormSynchronization';
import {
  AmortizationCalculationData,
  amortizationCalculationSchema,
  CreateSaleFormData,
  Step2FormData,
  step2Schema
} from '../../../validations/saleValidation';
import AmortizationTable from './AmortizationTable';
import AmountConfiguration from './AmountConfiguration';
import FinancialSummary from './FinancialSummary';
import FinancingConfiguration from './FinancingConfiguration';

interface Step2Props {
  formData: Partial<CreateSaleFormData> & {
    financingInstallments?: {
      couteAmount: number;
      expectedPaymentDate: string;
    }[];
    initialAmount?: number;
    interestRate?: number;
    quantitySaleCoutes?: number;
  };
  updateFormData: (
    data: Partial<CreateSaleFormData> & {
      financingInstallments?: {
        couteAmount: number;
        expectedPaymentDate: string;
      }[];
      initialAmount?: number;
      interestRate?: number;
      quantitySaleCoutes?: number;
    }
  ) => void;
  updateStepValidation: (step: 'step2', isValid: boolean) => void;
}

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};
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
      totalAmount: safeNumber(formData.totalAmount),
      totalAmountUrbanDevelopment: safeNumber(formData.totalAmountUrbanDevelopment),
      firstPaymentDateHu: formData.firstPaymentDateHu || '',
      initialAmountUrbanDevelopment: safeNumber(formData.initialAmountUrbanDevelopment),
      quantityHuCuotes: safeNumber(formData.quantityHuCuotes),
      initialAmount: safeNumber(formData.initialAmount),
      interestRate: safeNumber(formData.interestRate) || 12,
      quantitySaleCoutes: safeNumber(formData.quantitySaleCoutes) || 12,
      financingInstallments: formData.financingInstallments || []
    }
  });

  const amortizationForm = useForm<AmortizationCalculationData>({
    resolver: zodResolver(amortizationCalculationSchema),
    defaultValues: {
      totalAmount: safeNumber(formData.totalAmount),
      initialAmount: safeNumber(formData.initialAmount),
      interestRate: safeNumber(formData.interestRate) || 12,
      quantitySaleCoutes: safeNumber(formData.quantitySaleCoutes) || 12,
      firstPaymentDate: ''
    }
  });

  useEffect(() => {
    const currentTotalAmount = form.getValues('totalAmount');
    const newTotalAmount = safeNumber(formData.totalAmount);

    if (currentTotalAmount !== newTotalAmount && newTotalAmount > 0) {
      form.setValue('totalAmount', newTotalAmount, { shouldValidate: false });
    }

    form.setValue('totalAmountUrbanDevelopment', safeNumber(formData.totalAmountUrbanDevelopment), {
      shouldValidate: false
    });
    form.setValue('firstPaymentDateHu', formData.firstPaymentDateHu || '', {
      shouldValidate: false
    });
    form.setValue(
      'initialAmountUrbanDevelopment',
      safeNumber(formData.initialAmountUrbanDevelopment),
      { shouldValidate: false }
    );
    form.setValue('quantityHuCuotes', safeNumber(formData.quantityHuCuotes), {
      shouldValidate: false
    });

    if (isFinanced) {
      form.setValue('initialAmount', safeNumber(formData.initialAmount), { shouldValidate: false });
      form.setValue('interestRate', safeNumber(formData.interestRate) || 12, {
        shouldValidate: false
      });
      form.setValue('quantitySaleCoutes', safeNumber(formData.quantitySaleCoutes) || 12, {
        shouldValidate: false
      });
      form.setValue('financingInstallments', formData.financingInstallments || [], {
        shouldValidate: false
      });

      const currentAmortizationTotal = amortizationForm.getValues('totalAmount');
      if (currentAmortizationTotal !== newTotalAmount && newTotalAmount > 0) {
        amortizationForm.setValue('totalAmount', newTotalAmount, { shouldValidate: false });
      }
      amortizationForm.setValue('initialAmount', safeNumber(formData.initialAmount), {
        shouldValidate: false
      });
      amortizationForm.setValue('interestRate', safeNumber(formData.interestRate) || 12, {
        shouldValidate: false
      });
      amortizationForm.setValue(
        'quantitySaleCoutes',
        safeNumber(formData.quantitySaleCoutes) || 12,
        { shouldValidate: false }
      );
    }
  }, [formData.totalAmount, formData.totalAmountUrbanDevelopment]);

  const { amortizationTable, isCalculating, showAmortization, handleCalculateAmortization } =
    useFinancialConfig({
      amortizationForm,
      onAmortizationCalculated: (installments: AmortizationItem[]) => {
        form.setValue('financingInstallments', installments);
      }
    });

  useFormSynchronization({
    form,
    amortizationForm,
    isFinanced,
    updateFormData,
    updateStepValidation
  });

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
          <AmountConfiguration
            control={form.control}
            errors={form.formState.errors}
            hasUrbanization={hasUrbanization}
          />

          {isFinanced && (
            <FinancingConfiguration
              control={form.control}
              errors={form.formState.errors}
              amortizationForm={amortizationForm}
              isCalculating={isCalculating}
              onCalculateAmortization={handleCalculateAmortization}
            />
          )}

          <div className="lg:col-span-2">
            <FinancialSummary
              totalAmount={watchedValues.totalAmount || 0}
              totalAmountUrbanDevelopment={watchedValues.totalAmountUrbanDevelopment || 0}
              isFinanced={isFinanced}
              hasUrbanization={hasUrbanization}
              initialAmount={'initialAmount' in watchedValues ? watchedValues.initialAmount : 0}
              interestRate={'interestRate' in watchedValues ? watchedValues.interestRate : 0}
              quantitySaleCoutes={
                'quantitySaleCoutes' in watchedValues ? watchedValues.quantitySaleCoutes : 0
              }
            />
          </div>
        </div>
      </Form>

      <AmortizationTable installments={amortizationTable} visible={showAmortization} />
    </div>
  );
}
