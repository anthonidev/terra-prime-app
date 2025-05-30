import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  AmortizationCalculationData,
  CreateSaleFormData,
  Step2FormData
} from '../validations/saleValidation';

interface UseFormSynchronizationProps {
  form: UseFormReturn<Step2FormData>;
  amortizationForm: UseFormReturn<AmortizationCalculationData>;
  isFinanced: boolean;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step2', isValid: boolean) => void;
}

// Función helper para convertir valores a números de manera segura
const safeNumber = (value: any): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

export function useFormSynchronization({
  form,
  amortizationForm,
  isFinanced,
  updateFormData,
  updateStepValidation
}: UseFormSynchronizationProps) {
  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      let isValid = false;

      if (value.saleType === 'DIRECT_PAYMENT') {
        const totalAmount = safeNumber(value.totalAmount);
        isValid = totalAmount > 0;
      } else if (value.saleType === 'FINANCED') {
        const totalAmount = safeNumber(value.totalAmount);
        const initialAmount = safeNumber((value as any).initialAmount);
        const interestRate = safeNumber((value as any).interestRate);
        const quantitySaleCoutes = safeNumber((value as any).quantitySaleCoutes);
        const financingInstallments = (value as any).financingInstallments;

        isValid = !!(
          totalAmount > 0 &&
          initialAmount >= 0 &&
          interestRate > 0 &&
          quantitySaleCoutes > 0 &&
          financingInstallments &&
          financingInstallments.length > 0
        );
      }

      updateStepValidation('step2', isValid);

      if (value) {
        updateFormData({
          totalAmount: safeNumber(value.totalAmount),
          totalAmountUrbanDevelopment: safeNumber(value.totalAmountUrbanDevelopment),
          firstPaymentDateHu: value.firstPaymentDateHu,
          initialAmountUrbanDevelopment: safeNumber(value.initialAmountUrbanDevelopment),
          quantityHuCuotes: safeNumber(value.quantityHuCuotes),
          initialAmount: safeNumber((value as any).initialAmount),
          interestRate: safeNumber((value as any).interestRate),
          quantitySaleCoutes: safeNumber((value as any).quantitySaleCoutes),
          financingInstallments: (value as any).financingInstallments
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation, isFinanced]);

  // Sincronizar datos para el cálculo de amortización
  useEffect(() => {
    if (isFinanced) {
      const subscription = form.watch((values) => {
        if (values.totalAmount !== undefined) {
          amortizationForm.setValue('totalAmount', safeNumber(values.totalAmount));
        }
        if (
          values.saleType === 'FINANCED' &&
          'initialAmount' in values &&
          values.initialAmount !== undefined
        ) {
          amortizationForm.setValue('initialAmount', safeNumber(values.initialAmount));
        }
        if (
          values.saleType === 'FINANCED' &&
          'interestRate' in values &&
          values.interestRate !== undefined
        ) {
          amortizationForm.setValue('interestRate', safeNumber(values.interestRate));
        }
        if (
          values.saleType === 'FINANCED' &&
          'quantitySaleCoutes' in values &&
          values.quantitySaleCoutes !== undefined
        ) {
          amortizationForm.setValue('quantitySaleCoutes', safeNumber(values.quantitySaleCoutes));
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isFinanced, form, amortizationForm]);
}
