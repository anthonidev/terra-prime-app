'use client';

import { Control, FieldErrors, UseFormReturn } from 'react-hook-form';
import { DollarSign, Percent, Calendar as CalendarDays, Calculator } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormInputField from '@/components/common/form/FormInputField';
import { Step2FormData, AmortizationCalculationData } from '../../../validations/saleValidation';

interface FinancingConfigurationProps {
  control: Control<Step2FormData>;
  errors: FieldErrors<Step2FormData>;
  amortizationForm: UseFormReturn<AmortizationCalculationData>;
  isCalculating: boolean;
  onCalculateAmortization: () => void;
}

export default function FinancingConfiguration({
  control,
  errors,
  amortizationForm,
  isCalculating,
  onCalculateAmortization
}: FinancingConfigurationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
        Configuración de Financiamiento
      </h3>

      <FormInputField<Step2FormData>
        name="initialAmount"
        label="Monto Inicial"
        placeholder="0.00"
        type="number"
        icon={<DollarSign className="h-4 w-4" />}
        control={control}
        errors={errors}
      />

      <FormInputField<Step2FormData>
        name="interestRate"
        label="Tasa de Interés (%)"
        placeholder="12.0"
        type="number"
        icon={<Percent className="h-4 w-4" />}
        control={control}
        errors={errors}
      />

      <FormInputField<Step2FormData>
        name="quantitySaleCoutes"
        label="Cantidad de Cuotas (máx. 74)"
        placeholder="12"
        type="number"
        icon={<CalendarDays className="h-4 w-4" />}
        control={control}
        errors={errors}
      />

      <Form {...amortizationForm}>
        <FormInputField<AmortizationCalculationData>
          name="firstPaymentDate"
          label="Fecha Primer Pago"
          placeholder="YYYY-MM-DD"
          type="date"
          icon={<CalendarDays className="h-4 w-4" />}
          control={amortizationForm.control}
          errors={amortizationForm.formState.errors}
        />
      </Form>

      <Button
        type="button"
        onClick={onCalculateAmortization}
        disabled={isCalculating}
        className="flex w-full items-center gap-2"
      >
        {isCalculating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Calculando...
          </>
        ) : (
          <>
            <Calculator className="h-4 w-4" />
            Calcular Cronograma
          </>
        )}
      </Button>
    </div>
  );
}
