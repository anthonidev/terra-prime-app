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

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

const isFinancedFormData = (
  data: Step2FormData
): data is Step2FormData & {
  saleType: 'FINANCED';
  initialAmount: number;
  interestRate: number;
  quantitySaleCoutes: number;
  financingInstallments: Array<{
    couteAmount: number;
    expectedPaymentDate: string;
  }>;
} => {
  return data.saleType === 'FINANCED';
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
    (value: Step2FormData) => {
      if (isValidatingRef.current) return; // Evitar validaciones concurrentes
      isValidatingRef.current = true;

      try {
        let isValid = false;

        if (value.saleType === 'DIRECT_PAYMENT') {
          const totalAmount = safeNumber(value.totalAmount);
          isValid = totalAmount > 0;
        } else if (value.saleType === 'FINANCED' && isFinancedFormData(value)) {
          const totalAmount = safeNumber(value.totalAmount);
          const initialAmount = safeNumber(value.initialAmount);
          const interestRate = safeNumber(value.interestRate);
          const quantitySaleCoutes = safeNumber(value.quantitySaleCoutes);
          const financingInstallments = value.financingInstallments;

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

        // Construir datos para updateFormData de manera type-safe
        const formDataUpdate: Partial<CreateSaleFormData> = {
          totalAmount: safeNumber(value.totalAmount),
          totalAmountUrbanDevelopment: safeNumber(value.totalAmountUrbanDevelopment),
          firstPaymentDateHu: value.firstPaymentDateHu,
          initialAmountUrbanDevelopment: safeNumber(value.initialAmountUrbanDevelopment),
          quantityHuCuotes: safeNumber(value.quantityHuCuotes)
        };

        // Agregar campos de financiamiento solo si es financiado
        if (isFinancedFormData(value)) {
          formDataUpdate.initialAmount = safeNumber(value.initialAmount);
          formDataUpdate.interestRate = safeNumber(value.interestRate);
          formDataUpdate.quantitySaleCoutes = safeNumber(value.quantitySaleCoutes);
          formDataUpdate.financingInstallments = value.financingInstallments;
        }

        updateFormData(formDataUpdate);
      } finally {
        isValidatingRef.current = false;
      }
    },
    [updateFormData, updateStepValidation, form]
  );

  // Validar formulario cuando cambie - solo una vez
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        validateForm(value as Step2FormData);
      }
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
      if (!values) return;

      // Sincronizar totalAmount
      if (values.totalAmount !== undefined) {
        amortizationForm.setValue('totalAmount', safeNumber(values.totalAmount), {
          shouldValidate: false
        });
      }

      // Solo sincronizar campos de financiamiento si es un formulario financiado
      if (isFinancedFormData(values as Step2FormData)) {
        const financedValues = values as Step2FormData & {
          saleType: 'FINANCED';
          initialAmount: number;
          interestRate: number;
          quantitySaleCoutes: number;
          financingInstallments: Array<{
            couteAmount: number;
            expectedPaymentDate: string;
          }>;
        };
        amortizationForm.setValue('initialAmount', safeNumber(financedValues.initialAmount), {
          shouldValidate: false
        });

        amortizationForm.setValue('interestRate', safeNumber(financedValues.interestRate), {
          shouldValidate: false
        });

        amortizationForm.setValue(
          'quantitySaleCoutes',
          safeNumber(financedValues.quantitySaleCoutes),
          {
            shouldValidate: false
          }
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [isFinanced, form, amortizationForm]);
}
