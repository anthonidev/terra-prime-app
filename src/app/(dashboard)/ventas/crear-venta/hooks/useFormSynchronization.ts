import { useCallback, useEffect, useRef } from 'react';
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
  // Usar ref para evitar llamadas múltiples
  const lastValidationRef = useRef<boolean | null>(null);
  const isValidatingRef = useRef(false);

  // Función para validar el formulario usando useCallback para evitar recreaciones
  const validateForm = useCallback(
    (value: any) => {
      if (isValidatingRef.current) return; // Evitar validaciones concurrentes
      isValidatingRef.current = true;

      try {
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

        // Solo actualizar si el estado de validación realmente cambió
        if (lastValidationRef.current !== isValid) {
          lastValidationRef.current = isValid;
          updateStepValidation('step2', isValid);
        }

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
      } finally {
        isValidatingRef.current = false;
      }
    },
    [updateFormData, updateStepValidation]
  );

  // Validar formulario cuando cambie - solo una vez
  useEffect(() => {
    const subscription = form.watch((value) => {
      validateForm(value);
    });

    return () => subscription.unsubscribe();
  }, [form, validateForm]);

  // Validación inicial - solo una vez y con delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentValues = form.getValues();
      validateForm(currentValues);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []); // Solo se ejecuta una vez

  // Sincronizar datos para el cálculo de amortización - solo cuando sea necesario
  useEffect(() => {
    if (!isFinanced) return;

    const subscription = form.watch((values) => {
      if (values.totalAmount !== undefined) {
        amortizationForm.setValue('totalAmount', safeNumber(values.totalAmount), {
          shouldValidate: false
        });
      }
      if (
        values.saleType === 'FINANCED' &&
        'initialAmount' in values &&
        values.initialAmount !== undefined
      ) {
        amortizationForm.setValue('initialAmount', safeNumber(values.initialAmount), {
          shouldValidate: false
        });
      }
      if (
        values.saleType === 'FINANCED' &&
        'interestRate' in values &&
        values.interestRate !== undefined
      ) {
        amortizationForm.setValue('interestRate', safeNumber(values.interestRate), {
          shouldValidate: false
        });
      }
      if (
        values.saleType === 'FINANCED' &&
        'quantitySaleCoutes' in values &&
        values.quantitySaleCoutes !== undefined
      ) {
        amortizationForm.setValue('quantitySaleCoutes', safeNumber(values.quantitySaleCoutes), {
          shouldValidate: false
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [isFinanced, form, amortizationForm]);
}
