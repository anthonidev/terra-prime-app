import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { AmortizationItem } from '@/types/sales';
import { calculateAmortization } from '../action';
import { AmortizationCalculationData } from '../validations/saleValidation';

interface UseFinancialConfigProps {
  amortizationForm: UseFormReturn<AmortizationCalculationData>;
  onAmortizationCalculated: (installments: AmortizationItem[]) => void;
}

interface UseFinancialConfigReturn {
  amortizationTable: AmortizationItem[];
  isCalculating: boolean;
  showAmortization: boolean;
  handleCalculateAmortization: () => Promise<void>;
}

export function useFinancialConfig({
  amortizationForm,
  onAmortizationCalculated
}: UseFinancialConfigProps): UseFinancialConfigReturn {
  const [amortizationTable, setAmortizationTable] = useState<AmortizationItem[]>([]);
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
        reservationAmount: 0, // Siempre 0 según especificaciones
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
  }, [amortizationForm, onAmortizationCalculated]);

  return {
    amortizationTable,
    isCalculating,
    showAmortization,
    handleCalculateAmortization
  };
}
