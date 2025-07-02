'use client';

import { useCallback, useState } from 'react';
import { PaymentImageModalType } from '../validations/suscription.zod';
import { PaidInstallmentsDTO } from '@application/dtos/cobranza';
import { toast } from 'sonner';
import { SalesCollector, UrbanFinancing } from '@domain/entities/cobranza';
import { paidInstallments } from '@infrastructure/server-actions/cobranza.actions';

export function usePaidCollection(
  isUrban: boolean,
  urbanFinancing: UrbanFinancing | undefined,
  sale: SalesCollector
) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);

  const resetPayments = useCallback(() => {
    setPayments([]);
  }, []);

  const requiredAmount = isUrban
    ? Number(urbanFinancing?.financing.initialAmount) || 0
    : Number(sale.financing.initialAmount) || 0;

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = Math.max(0, requiredAmount - totalPaid);
  const isAmountReached = totalPaid >= requiredAmount;
  const isPaymentComplete = payments.length > 0 && totalPaid <= requiredAmount;

  const addPayment = useCallback(
    (payment: Omit<PaymentImageModalType, 'fileIndex'>) => {
      const newTotal = totalPaid + payment.amount;

      if (newTotal > requiredAmount) {
        toast.warning(
          `El monto ingresado excede el límite. Máximo permitido: ${new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: sale.currency
          }).format(remainingAmount)}`
        );
        return false;
      }

      const updatedPayments: PaymentImageModalType[] = [
        ...payments,
        {
          ...payment,
          bankName: payment.bankName ?? '',
          fileIndex: payments.length
        }
      ];
      setPayments(updatedPayments);
      return true;
    },
    [payments, requiredAmount, totalPaid, remainingAmount, sale.currency]
  );

  const deletePayment = useCallback(
    (index: number) => {
      const updatedPayments: PaymentImageModalType[] = payments
        .filter((_, i) => i !== index)
        .map((payment, newIndex) => ({
          ...payment,
          fileIndex: newIndex
        }));
      setPayments(updatedPayments);
    },
    [payments]
  );

  const editPayment = useCallback(
    (index: number, updatedPayment: Omit<PaymentImageModalType, 'fileIndex'>) => {
      const totalWithoutEditedPayment = payments
        .filter((_, i) => i !== index)
        .reduce((sum, payment) => sum + payment.amount, 0);

      const newTotal = totalWithoutEditedPayment + updatedPayment.amount;

      if (newTotal > requiredAmount) {
        const maxAllowed = requiredAmount - totalWithoutEditedPayment;
        toast.warning(
          `El monto ingresado excede el límite. Máximo permitido: ${new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: sale.currency
          }).format(maxAllowed)}`
        );
        return false;
      }

      const updatedPayments: PaymentImageModalType[] = [...payments];
      updatedPayments[index] = {
        ...updatedPayment,
        bankName: updatedPayment.bankName ?? '',
        fileIndex: index
      };
      setPayments(updatedPayments);
      return true;
    },
    [payments, requiredAmount, sale.currency]
  );

  const handleAction = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (totalPaid === 0) {
        toast.warning('Debe agregar al menos un pago');
        return false;
      }

      const validItems = payments.filter((item) => item.file !== null);

      if (validItems.length === 0) {
        toast.warning('No hay comprobantes válidos para procesar');
        return false;
      }

      const dto: PaidInstallmentsDTO = {
        payments: validItems.map((item, index) => ({
          bankName: item.bankName ?? '',
          transactionReference: item.transactionReference,
          transactionDate: item.transactionDate,
          amount: item.amount,
          fileIndex: index
        })),
        files: validItems.map((item) => item.file as File),
        amountPaid: totalPaid
      };

      const paymentId = isUrban ? urbanFinancing?.financing.id : sale.financing.id;

      if (!paymentId) {
        toast.error('No se encontró el ID del financiamiento');
        return false;
      }

      await paidInstallments(paymentId, dto);

      const isFullPayment = totalPaid === requiredAmount;
      toast.success(
        isFullPayment
          ? 'Pago completo registrado correctamente'
          : `Pago parcial registrado correctamente. Restante: ${new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: sale.currency
            }).format(remainingAmount)}`
      );
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [payments, sale, urbanFinancing, requiredAmount, totalPaid, isUrban, remainingAmount]);

  return {
    requiredAmount,
    totalPaid,
    isAmountReached,
    isSubmitting,
    payments,
    remainingAmount,
    isPaymentComplete,
    resetPayments,
    addPayment,
    deletePayment,
    editPayment,
    handleAction
  };
}
