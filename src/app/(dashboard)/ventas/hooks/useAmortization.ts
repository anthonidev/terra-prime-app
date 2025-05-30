'use client';

import { calculateAmortization } from '@/lib/actions/sales/amortizationAction';
import { AmortizationDTO, AmortizationItem } from '@/types/sales';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface TData {
  data: AmortizationItem[];
  meta: {
    totalCouteAmountSum: number;
  };
  isLoading: boolean;
  calculateAmortization: () => Promise<void>;
}

export function useAmortization(params: AmortizationDTO): TData {
  const [data, setData] = useState<AmortizationItem[]>([]);
  const [meta, setMeta] = useState<{ totalCouteAmountSum: number }>({ totalCouteAmountSum: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await calculateAmortization(params);
      setData(response.installments);
      setMeta(response.meta);

      console.log(response);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  return {
    data,
    meta,
    isLoading,
    calculateAmortization: fetchData
  };
}
