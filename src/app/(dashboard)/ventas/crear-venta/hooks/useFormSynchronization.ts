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
        isValid = !!(value.totalAmount && value.totalAmount > 0);
      } else if (value.saleType === 'FINANCED') {
        isValid = !!(
          value.totalAmount &&
          value.totalAmount > 0 &&
          (value as any).initialAmount !== undefined &&
          (value as any).initialAmount >= 0 &&
          (value as any).interestRate &&
          (value as any).interestRate > 0 &&
          (value as any).quantitySaleCoutes &&
          (value as any).quantitySaleCoutes > 0 &&
          (value as any).financingInstallments &&
          (value as any).financingInstallments.length > 0
        );
      }

      updateStepValidation('step2', isValid);

      if (value) {
        updateFormData({
          totalAmount: value.totalAmount,
          totalAmountUrbanDevelopment: value.totalAmountUrbanDevelopment,
          firstPaymentDateHu: value.firstPaymentDateHu,
          initialAmountUrbanDevelopment: value.initialAmountUrbanDevelopment,
          quantityHuCuotes: value.quantityHuCuotes,
          initialAmount: (value as any).initialAmount,
          interestRate: (value as any).interestRate,
          quantitySaleCoutes: (value as any).quantitySaleCoutes,
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
          amortizationForm.setValue('totalAmount', values.totalAmount);
        }
        if (
          values.saleType === 'FINANCED' &&
          'initialAmount' in values &&
          values.initialAmount !== undefined
        ) {
          amortizationForm.setValue('initialAmount', values.initialAmount);
        }
        if (
          values.saleType === 'FINANCED' &&
          'interestRate' in values &&
          values.interestRate !== undefined
        ) {
          amortizationForm.setValue('interestRate', values.interestRate);
        }
        if (
          values.saleType === 'FINANCED' &&
          'quantitySaleCoutes' in values &&
          values.quantitySaleCoutes !== undefined
        ) {
          amortizationForm.setValue('quantitySaleCoutes', values.quantitySaleCoutes);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isFinanced, form, amortizationForm]);
}
