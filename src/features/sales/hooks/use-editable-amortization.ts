'use client';

import { useState, useCallback, useMemo } from 'react';
import Decimal from 'decimal.js';
import { parseDateInputValue, formatDateToInputValue } from '@/shared/utils/date-formatter';
import type {
  AmortizationResponse,
  AmortizationMeta,
  CombinedInstallment,
  EditableInstallment,
} from '../types';

// Configure Decimal.js for financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const generateId = () => crypto.randomUUID();

const toFixedNumber = (value: Decimal): number => {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
};

interface UseEditableAmortizationProps {
  interestRate: number;
}

export function useEditableAmortization({ interestRate }: UseEditableAmortizationProps) {
  const [installments, setInstallments] = useState<EditableInstallment[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [originalMeta, setOriginalMeta] = useState<AmortizationMeta | null>(null);

  const canAddDelete = interestRate === 0;

  // Expected totals from the original API meta
  const expectedLotTotal = originalMeta?.lotTotalAmount ?? 0;
  const expectedHuTotal = originalMeta?.huTotalAmount ?? 0;

  // Initialize from API response
  const initializeFromAmortization = useCallback((data: AmortizationResponse) => {
    const editables: EditableInstallment[] = data.installments.map((inst) => ({
      ...inst,
      id: generateId(),
    }));
    setInstallments(editables);
    setOriginalMeta(data.meta);
    setInitialized(true);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setInstallments([]);
    setOriginalMeta(null);
    setInitialized(false);
  }, []);

  // Update a single installment
  const updateInstallment = useCallback(
    (
      id: string,
      updates: Partial<
        Pick<
          CombinedInstallment,
          'lotInstallmentAmount' | 'huInstallmentAmount' | 'expectedPaymentDate'
        >
      >
    ) => {
      setInstallments((prev) =>
        prev.map((inst) => {
          if (inst.id !== id) return inst;

          const newInst = { ...inst };

          if (updates.lotInstallmentAmount !== undefined) {
            newInst.lotInstallmentAmount = toFixedNumber(new Decimal(updates.lotInstallmentAmount));
          }
          if (updates.huInstallmentAmount !== undefined) {
            newInst.huInstallmentAmount = toFixedNumber(new Decimal(updates.huInstallmentAmount));
          }
          if (updates.expectedPaymentDate !== undefined) {
            newInst.expectedPaymentDate = updates.expectedPaymentDate;
          }

          // Recalculate total
          newInst.totalInstallmentAmount = toFixedNumber(
            new Decimal(newInst.lotInstallmentAmount).plus(new Decimal(newInst.huInstallmentAmount))
          );

          return newInst;
        })
      );
    },
    []
  );

  // Delete installments by ids and renumber
  const deleteInstallments = useCallback((ids: Set<string>) => {
    setInstallments((prev) => {
      const filtered = prev.filter((inst) => !ids.has(inst.id));
      return filtered.map((inst, index) => ({
        ...inst,
        lotInstallmentNumber: index + 1,
        huInstallmentNumber: inst.huInstallmentAmount > 0 ? index + 1 : 0,
      }));
    });
  }, []);

  // Add installments with uniform distribution
  const addInstallments = useCallback(
    (qty: number, lotTotal: number, huTotal: number, startDate: string) => {
      const qtyDec = new Decimal(qty);

      // Lot distribution
      const lotPerInst = new Decimal(lotTotal)
        .dividedBy(qtyDec)
        .toDecimalPlaces(2, Decimal.ROUND_DOWN);
      const lotSumExceptLast = lotPerInst.times(qtyDec.minus(1));
      const lotLast = new Decimal(lotTotal).minus(lotSumExceptLast);

      // HU distribution
      const huPerInst =
        huTotal > 0
          ? new Decimal(huTotal).dividedBy(qtyDec).toDecimalPlaces(2, Decimal.ROUND_DOWN)
          : new Decimal(0);
      const huSumExceptLast = huPerInst.times(qtyDec.minus(1));
      const huLast = huTotal > 0 ? new Decimal(huTotal).minus(huSumExceptLast) : new Decimal(0);

      setInstallments((prev) => {
        const currentMax = prev.length;
        const baseDate = parseDateInputValue(startDate) ?? new Date(startDate);

        const newInstallments: EditableInstallment[] = [];

        for (let i = 0; i < qty; i++) {
          const dueDate = new Date(baseDate);
          dueDate.setMonth(dueDate.getMonth() + i);

          const isLast = i === qty - 1;
          const lotAmt = isLast ? toFixedNumber(lotLast) : toFixedNumber(lotPerInst);
          const huAmt = isLast ? toFixedNumber(huLast) : toFixedNumber(huPerInst);

          newInstallments.push({
            id: generateId(),
            lotInstallmentNumber: currentMax + i + 1,
            lotInstallmentAmount: lotAmt,
            huInstallmentNumber: huTotal > 0 ? currentMax + i + 1 : 0,
            huInstallmentAmount: huAmt,
            expectedPaymentDate: formatDateToInputValue(dueDate),
            totalInstallmentAmount: toFixedNumber(new Decimal(lotAmt).plus(new Decimal(huAmt))),
          });
        }

        return [...prev, ...newInstallments];
      });
    },
    []
  );

  // Bulk update lot amount distributed across selected installments
  const bulkUpdateLotAmount = useCallback((ids: Set<string>, total: number) => {
    const qty = new Decimal(ids.size);
    const perInst = new Decimal(total).dividedBy(qty).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    const sumExceptLast = perInst.times(qty.minus(1));
    const lastAmt = new Decimal(total).minus(sumExceptLast);

    setInstallments((prev) => {
      const selectedIds = Array.from(ids);
      let selectedIndex = 0;

      return prev.map((inst) => {
        if (!ids.has(inst.id)) return inst;

        const isLast = selectedIndex === selectedIds.length - 1;
        const lotAmt = isLast ? toFixedNumber(lastAmt) : toFixedNumber(perInst);
        selectedIndex++;

        const newTotal = toFixedNumber(
          new Decimal(lotAmt).plus(new Decimal(inst.huInstallmentAmount))
        );
        return { ...inst, lotInstallmentAmount: lotAmt, totalInstallmentAmount: newTotal };
      });
    });
  }, []);

  // Bulk update HU amount distributed across selected installments
  const bulkUpdateHuAmount = useCallback((ids: Set<string>, total: number) => {
    const qty = new Decimal(ids.size);
    const perInst = new Decimal(total).dividedBy(qty).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    const sumExceptLast = perInst.times(qty.minus(1));
    const lastAmt = new Decimal(total).minus(sumExceptLast);

    setInstallments((prev) => {
      const selectedIds = Array.from(ids);
      let selectedIndex = 0;

      return prev.map((inst) => {
        if (!ids.has(inst.id)) return inst;

        const isLast = selectedIndex === selectedIds.length - 1;
        const huAmt = isLast ? toFixedNumber(lastAmt) : toFixedNumber(perInst);
        selectedIndex++;

        const newTotal = toFixedNumber(
          new Decimal(inst.lotInstallmentAmount).plus(new Decimal(huAmt))
        );
        return { ...inst, huInstallmentAmount: huAmt, totalInstallmentAmount: newTotal };
      });
    });
  }, []);

  // Bulk update dates with monthly increments
  const bulkUpdateDates = useCallback((ids: Set<string>, startDate: string) => {
    const baseDate = parseDateInputValue(startDate) ?? new Date(startDate);

    setInstallments((prev) => {
      let dateIndex = 0;
      return prev.map((inst) => {
        if (!ids.has(inst.id)) return inst;

        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + dateIndex);
        dateIndex++;

        return { ...inst, expectedPaymentDate: formatDateToInputValue(dueDate) };
      });
    });
  }, []);

  // Calculated meta (current state)
  const meta: AmortizationMeta = useMemo(() => {
    const lotTotal = installments.reduce(
      (acc, inst) => acc.plus(new Decimal(inst.lotInstallmentAmount)),
      new Decimal(0)
    );
    const huTotal = installments.reduce(
      (acc, inst) => acc.plus(new Decimal(inst.huInstallmentAmount)),
      new Decimal(0)
    );
    const lotCount = installments.filter((i) => i.lotInstallmentAmount > 0).length;
    const huCount = installments.filter((i) => i.huInstallmentAmount > 0).length;

    return {
      lotInstallmentsCount: lotCount,
      lotTotalAmount: toFixedNumber(lotTotal),
      huInstallmentsCount: huCount,
      huTotalAmount: toFixedNumber(huTotal),
      totalInstallmentsCount: Math.max(lotCount, huCount),
      totalAmount: toFixedNumber(lotTotal.plus(huTotal)),
    };
  }, [installments]);

  // Balance validation against original API meta
  const lotBalanceDifference = useMemo(() => {
    return toFixedNumber(new Decimal(meta.lotTotalAmount).minus(new Decimal(expectedLotTotal)));
  }, [meta.lotTotalAmount, expectedLotTotal]);

  const huBalanceDifference = useMemo(() => {
    return toFixedNumber(new Decimal(meta.huTotalAmount).minus(new Decimal(expectedHuTotal)));
  }, [meta.huTotalAmount, expectedHuTotal]);

  const isLotBalanceValid = useMemo(() => {
    return new Decimal(lotBalanceDifference).abs().lessThan(0.01);
  }, [lotBalanceDifference]);

  const isHuBalanceValid = useMemo(() => {
    if (expectedHuTotal === 0) return true;
    return new Decimal(huBalanceDifference).abs().lessThan(0.01);
  }, [huBalanceDifference, expectedHuTotal]);

  const isValid = isLotBalanceValid && isHuBalanceValid && installments.length > 0;

  // Adjust balance by cascading from last installment backwards (no negatives)
  const adjustLastInstallment = useCallback(() => {
    if (installments.length === 0) return;

    setInstallments((prev) => {
      const result = prev.map((inst) => ({ ...inst }));

      // Adjust lot amounts
      let lotRemaining = new Decimal(lotBalanceDifference);
      if (lotRemaining.greaterThan(0)) {
        // Excess: subtract cascading from last to first
        for (let i = result.length - 1; i >= 0 && lotRemaining.greaterThan(0); i--) {
          const current = new Decimal(result[i].lotInstallmentAmount);
          if (current.greaterThanOrEqualTo(lotRemaining)) {
            result[i].lotInstallmentAmount = toFixedNumber(current.minus(lotRemaining));
            lotRemaining = new Decimal(0);
          } else {
            lotRemaining = lotRemaining.minus(current);
            result[i].lotInstallmentAmount = 0;
          }
        }
      } else if (lotRemaining.lessThan(0)) {
        // Deficit: add to last installment
        const last = result[result.length - 1];
        last.lotInstallmentAmount = toFixedNumber(
          new Decimal(last.lotInstallmentAmount).minus(lotRemaining)
        );
      }

      // Adjust HU amounts
      if (expectedHuTotal > 0) {
        let huRemaining = new Decimal(huBalanceDifference);
        if (huRemaining.greaterThan(0)) {
          for (let i = result.length - 1; i >= 0 && huRemaining.greaterThan(0); i--) {
            const current = new Decimal(result[i].huInstallmentAmount);
            if (current.greaterThanOrEqualTo(huRemaining)) {
              result[i].huInstallmentAmount = toFixedNumber(current.minus(huRemaining));
              huRemaining = new Decimal(0);
            } else {
              huRemaining = huRemaining.minus(current);
              result[i].huInstallmentAmount = 0;
            }
          }
        } else if (huRemaining.lessThan(0)) {
          const last = result[result.length - 1];
          last.huInstallmentAmount = toFixedNumber(
            new Decimal(last.huInstallmentAmount).minus(huRemaining)
          );
        }
      }

      // Recalculate totals
      return result.map((inst) => ({
        ...inst,
        totalInstallmentAmount: toFixedNumber(
          new Decimal(inst.lotInstallmentAmount).plus(new Decimal(inst.huInstallmentAmount))
        ),
      }));
    });
  }, [installments.length, lotBalanceDifference, huBalanceDifference, expectedHuTotal]);

  // Export clean data without local id
  const toAmortizationResponse = useCallback((): AmortizationResponse => {
    const cleanInstallments: CombinedInstallment[] = installments.map((inst) => ({
      lotInstallmentAmount: inst.lotInstallmentAmount,
      lotInstallmentNumber: inst.lotInstallmentNumber,
      huInstallmentAmount: inst.huInstallmentAmount,
      huInstallmentNumber: inst.huInstallmentNumber,
      expectedPaymentDate: inst.expectedPaymentDate,
      totalInstallmentAmount: inst.totalInstallmentAmount,
    }));

    return {
      installments: cleanInstallments,
      meta,
    };
  }, [installments, meta]);

  return {
    // State
    installments,
    initialized,
    canAddDelete,

    // Actions
    initializeFromAmortization,
    reset,
    updateInstallment,
    deleteInstallments,
    addInstallments,
    bulkUpdateLotAmount,
    bulkUpdateHuAmount,
    bulkUpdateDates,
    adjustLastInstallment,

    // Calculated
    meta,
    lotBalanceDifference,
    huBalanceDifference,
    isLotBalanceValid,
    isHuBalanceValid,
    isValid,
    expectedLotTotal,
    expectedHuTotal,

    // Export
    toAmortizationResponse,
  };
}
