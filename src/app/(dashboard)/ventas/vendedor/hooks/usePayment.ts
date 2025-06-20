'use client';

import { useCallback, useState } from 'react';
import { PaymentImageModalType } from '../../validations/suscription.zod';
import { ProcessPaymentDto } from '@application/dtos/create-payment.dto';
import { createPayment } from '@infrastructure/server-actions/sales.actions';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { toast } from 'sonner';

export function usePayment(sale: SaleList) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);
  const resetPayments = useCallback(() => {
    setPayments([]);
  }, []);

  const requiredAmount =
    sale.type === 'FINANCED' ? Number(sale.financing?.initialAmount) : Number(sale.totalAmount);

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = Math.max(0, requiredAmount - totalPaid);
  const isAmountReached = totalPaid >= (requiredAmount || 0);
  const isPaymentComplete = totalPaid === requiredAmount && payments.length > 0;

  const addPayment = (payment: Omit<PaymentImageModalType, 'fileIndex'>) => {
    const updatedPayments: PaymentImageModalType[] = [
      ...payments,
      {
        ...payment,
        bankName: payment.bankName ?? '',
        fileIndex: payments.length
      }
    ];
    setPayments(updatedPayments);
  };

  const deletePayment = (index: number) => {
    const updatedPayments: PaymentImageModalType[] = payments
      .filter((_, i) => i !== index)
      .map((payment, newIndex) => ({
        ...payment,
        fileIndex: newIndex
      }));
    setPayments(updatedPayments);
  };

  const editPayment = (index: number, updatedPayment: Omit<PaymentImageModalType, 'fileIndex'>) => {
    const updatedPayments: PaymentImageModalType[] = [...payments];
    updatedPayments[index] = {
      ...updatedPayment,
      bankName: updatedPayment.bankName ?? '',
      fileIndex: index
    };
    setPayments(updatedPayments);
  };

  const handleAction = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (totalPaid > requiredAmount) {
        toast.warning('El monto total excede el requerido');
        return false;
      }

      const validItems = payments.filter((item) => item.file !== null);
      const dto: ProcessPaymentDto = {
        payments: validItems.map((item, index) => ({
          bankName: item.bankName ?? '',
          transactionReference: item.transactionReference,
          transactionDate: item.transactionDate,
          amount: item.amount,
          fileIndex: index
        })),
        files: validItems.map((item) => item.file as File)
      };

      await createPayment(sale.id, dto);

      console.log(dto);

      toast.success('Pago enviado correctamente');
      return true;
    } catch (error) {
      if (error instanceof Error) toast.warning(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [payments, sale, requiredAmount, totalPaid]);

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
