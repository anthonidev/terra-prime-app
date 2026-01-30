'use client';

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Decimal from 'decimal.js';
import { createAmendment } from '../lib/mutations';

import type {
  FinancingDetail,
  AmendmentInstallmentLocal,
  AmendmentInstallmentStatus,
  CreateAmendmentInput,
} from '../types';
import {
  getTodayDateInputValue,
  parseDateInputValue,
  formatDateToInputValue,
} from '@/shared/utils/date-formatter';

// Configure Decimal.js for financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

// Generate unique ID
const generateId = () => crypto.randomUUID();

// Helper to convert to number with 2 decimal places
const toFixedNumber = (value: Decimal): number => {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
};

interface UseAmendmentProps {
  saleId: string;
  financingId: string;
  financing: FinancingDetail;
}

export function useAmendment({ saleId, financingId, financing }: UseAmendmentProps) {
  const queryClient = useQueryClient();

  // Amendment mode state
  const [isAmendmentMode, setIsAmendmentMode] = useState(false);
  const [installments, setInstallments] = useState<AmendmentInstallmentLocal[]>([]);
  const [additionalAmount, setAdditionalAmount] = useState(0);

  // Calculate the total paid (first installment amount)
  const totalPaidAmount = useMemo(() => {
    const totalPaid = new Decimal(financing.totalPaid);
    const totalLateFeePaid = new Decimal(financing.totalLateFeePaid);
    return toFixedNumber(totalPaid.plus(totalLateFeePaid));
  }, [financing.totalPaid, financing.totalLateFeePaid]);

  // Calculate the total debt (what needs to be covered by new installments)
  const totalDebt = useMemo(() => {
    const totalCouteAmount = new Decimal(financing.totalCouteAmount);
    const totalLateFee = new Decimal(financing.totalLateFee);
    return toFixedNumber(totalCouteAmount.plus(totalLateFee));
  }, [financing.totalCouteAmount, financing.totalLateFee]);

  // Calculate sum of all installment amounts
  const totalInstallmentsAmount = useMemo(() => {
    const sum = installments.reduce(
      (acc, inst) => acc.plus(new Decimal(inst.amount)),
      new Decimal(0)
    );
    return toFixedNumber(sum);
  }, [installments]);

  // Calculate expected total (what should be covered)
  // additionalAmount positive = additional charge (increases debt)
  // additionalAmount negative = discount (reduces debt)
  const expectedTotal = useMemo(() => {
    const debt = new Decimal(totalDebt);
    const additional = new Decimal(additionalAmount);
    const paid = new Decimal(totalPaidAmount);
    return toFixedNumber(debt.plus(additional).minus(paid));
  }, [totalDebt, additionalAmount, totalPaidAmount]);

  // Calculate pending installments total (excluding first paid one)
  const pendingInstallmentsTotal = useMemo(() => {
    const sum = installments
      .filter((inst) => inst.status !== 'PAID')
      .reduce((acc, inst) => acc.plus(new Decimal(inst.amount)), new Decimal(0));
    return toFixedNumber(sum);
  }, [installments]);

  // Validation: check if balance is correct
  const isBalanceValid = useMemo(() => {
    const pending = new Decimal(pendingInstallmentsTotal);
    const expected = new Decimal(expectedTotal);
    const difference = pending.minus(expected).abs();
    return difference.lessThan(0.01);
  }, [pendingInstallmentsTotal, expectedTotal]);

  // Difference for display
  const balanceDifference = useMemo(() => {
    const pending = new Decimal(pendingInstallmentsTotal);
    const expected = new Decimal(expectedTotal);
    return toFixedNumber(pending.minus(expected));
  }, [pendingInstallmentsTotal, expectedTotal]);

  // Start amendment mode - creates initial paid installment
  const startAmendmentMode = useCallback(() => {
    const today = getTodayDateInputValue();
    const initialInstallment: AmendmentInstallmentLocal = {
      id: generateId(),
      numberCuote: 1,
      dueDate: today,
      amount: totalPaidAmount,
      status: 'PAID' as AmendmentInstallmentStatus,
    };
    setInstallments([initialInstallment]);
    setAdditionalAmount(0);
    setIsAmendmentMode(true);
  }, [totalPaidAmount]);

  // Cancel amendment mode
  const cancelAmendmentMode = useCallback(() => {
    setIsAmendmentMode(false);
    setInstallments([]);
    setAdditionalAmount(0);
  }, []);

  // Add new installments
  const addInstallments = useCallback(
    (quantity: number, totalAmount: number, startDate: string) => {
      const total = new Decimal(totalAmount);
      const qty = new Decimal(quantity);

      // Calculate amount per installment with proper precision
      const amountPerInstallment = total.dividedBy(qty).toDecimalPlaces(2, Decimal.ROUND_DOWN);

      // Calculate the sum of all installments except the last one
      const sumExceptLast = amountPerInstallment.times(qty.minus(1));

      // Last installment gets the remainder to ensure total matches exactly
      const lastInstallmentAmount = total.minus(sumExceptLast);

      const currentMaxNumber =
        installments.length > 0 ? Math.max(...installments.map((i) => i.numberCuote)) : 0;

      const newInstallments: AmendmentInstallmentLocal[] = [];
      const baseDate = parseDateInputValue(startDate) ?? new Date(startDate);

      for (let i = 0; i < quantity; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        const isLastInstallment = i === quantity - 1;
        const amount = isLastInstallment
          ? toFixedNumber(lastInstallmentAmount)
          : toFixedNumber(amountPerInstallment);

        newInstallments.push({
          id: generateId(),
          numberCuote: currentMaxNumber + i + 1,
          dueDate: formatDateToInputValue(dueDate),
          amount,
          status: 'PENDING' as AmendmentInstallmentStatus,
        });
      }

      setInstallments((prev) => [...prev, ...newInstallments]);
    },
    [installments]
  );

  // Update a single installment
  const updateInstallment = useCallback(
    (id: string, updates: Partial<Omit<AmendmentInstallmentLocal, 'id'>>) => {
      setInstallments((prev) =>
        prev.map((inst) => {
          if (inst.id !== id) return inst;

          // If amount is being updated, ensure it's properly rounded
          if (updates.amount !== undefined) {
            const roundedAmount = toFixedNumber(new Decimal(updates.amount));
            return { ...inst, ...updates, amount: roundedAmount };
          }

          return { ...inst, ...updates };
        })
      );
    },
    []
  );

  // Delete an installment (except the first paid one)
  const deleteInstallment = useCallback((id: string) => {
    setInstallments((prev) => {
      const filtered = prev.filter((inst) => inst.id !== id);
      // Renumber the installments
      return filtered.map((inst, index) => ({
        ...inst,
        numberCuote: index + 1,
      }));
    });
  }, []);

  // Clear all pending installments (keep the paid one)
  const clearPendingInstallments = useCallback(() => {
    setInstallments((prev) => prev.filter((inst) => inst.status === 'PAID'));
  }, []);

  // Mutation for saving amendment
  const mutation = useMutation({
    mutationFn: (data: CreateAmendmentInput) => createAmendment(saleId, financingId, data),
    onSuccess: (data) => {
      toast.success(data.message || 'Adenda creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['financing-detail', saleId, financingId] });
      cancelAmendmentMode();
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Error al crear la adenda');
    },
  });

  // Save amendment
  const saveAmendment = useCallback(
    (observation?: string) => {
      if (!isBalanceValid) {
        toast.error('El balance no es válido. Verifique los montos.');
        return;
      }

      const data: CreateAmendmentInput = {
        additionalAmount: toFixedNumber(new Decimal(additionalAmount)),
        observation,
        installments: installments.map((inst) => ({
          numberCuote: inst.numberCuote,
          dueDate: inst.dueDate,
          amount: toFixedNumber(new Decimal(inst.amount)),
          status: inst.status,
        })),
      };

      mutation.mutate(data);
    },
    [additionalAmount, installments, isBalanceValid, mutation]
  );

  return {
    // State
    isAmendmentMode,
    installments,
    additionalAmount,

    // Calculated values
    totalPaidAmount,
    totalDebt,
    totalInstallmentsAmount,
    expectedTotal,
    pendingInstallmentsTotal,
    isBalanceValid,
    balanceDifference,

    // Actions
    startAmendmentMode,
    cancelAmendmentMode,
    addInstallments,
    updateInstallment,
    deleteInstallment,
    clearPendingInstallments,
    setAdditionalAmount,
    saveAmendment,

    // Mutation state
    isSaving: mutation.isPending,
  };
}
