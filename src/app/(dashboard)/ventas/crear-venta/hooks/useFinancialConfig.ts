import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Amortization } from '@domain/entities/sales/amortization.entity';
import { calculateAmortization } from '@infrastructure/server-actions/sales.actions';
import { AmortizationCalculationData } from '../validations/saleValidation';

interface UseFinancialConfigProps {
  reservationAmount: number | undefined;
  amortizationForm: UseFormReturn<AmortizationCalculationData>;
  onAmortizationCalculated: (installments: Amortization[]) => void;
}

interface UseFinancialConfigReturn {
  amortizationTable: Amortization[];
  isCalculating: boolean;
  showAmortization: boolean;
  handleCalculateAmortization: () => Promise<void>;
}

export function useFinancialConfig({
  reservationAmount,
  amortizationForm,
  onAmortizationCalculated
}: UseFinancialConfigProps): UseFinancialConfigReturn {
  const [amortizationTable, setAmortizationTable] = useState<Amortization[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  const handleCalculateAmortization = useCallback(async () => {
    const isAmortizationValid = await amortizationForm.trigger();
    if (!isAmortizationValid) {
      toast.error('Complete todos los campos de financiamiento');
      return;
    }

    const values = amortizationForm.getValues();

    setIsCalculating(true);
    try {
      const result = await calculateAmortization({
        totalAmount: values.totalAmount,
        initialAmount: values.initialAmount,
        reservationAmount: reservationAmount ?? 0,
        interestRate: values.interestRate,
        numberOfPayments: values.quantitySaleCoutes,
        firstPaymentDate: values.firstPaymentDate,
        includeDecimals: true
      });

      setAmortizationTable(result.installments);
      setShowAmortization(true);

      // Notificar al componente padre
      onAmortizationCalculated(result.installments);

      toast.success('Cronograma de pagos calculado correctamente');
    } catch (error) {
      console.error('Error calculating amortization:', error);
      toast.error('Error al calcular el cronograma de pagos');
    } finally {
      setIsCalculating(false);
    }
  }, [amortizationForm, onAmortizationCalculated, reservationAmount]);

  return {
    amortizationTable,
    isCalculating,
    showAmortization,
    handleCalculateAmortization
  };
}
