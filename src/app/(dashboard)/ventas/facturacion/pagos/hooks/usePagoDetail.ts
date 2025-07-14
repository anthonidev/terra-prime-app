'use client';

import {
  approvePaymentDetail,
  getPaymentDetail,
  rejectPaymentDetail,
  completePaymentDetail
} from '@infrastructure/server-actions/sales.actions';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { PaymentApproveRejectResponse } from '@infrastructure/types/sales/api-response.types';
import { ApprovePaymentDTO } from '@application/dtos/approve-payment.dto';

export function usePagoDetail(paymentId: number) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [approveResponse, setApproveResponse] = useState<PaymentApproveRejectResponse | null>(null);
  const [rejectResponse, setRejectResponse] = useState<PaymentApproveRejectResponse | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState<boolean>(false);

  const fetchPagoDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const paymentData = await getPaymentDetail(paymentId);
      setPayment(paymentData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar los detalles del pago';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [paymentId]);

  const openApproveModal = useCallback(() => {
    setIsApproveModalOpen(true);
  }, []);

  const openRejectModal = useCallback(() => {
    setIsRejectModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setRejectionReason('');
  }, []);

  const handleApprovePayment = useCallback(
    async (approvalData: ApprovePaymentDTO) => {
      try {
        setIsSubmitting(true);

        const response = await approvePaymentDetail(paymentId, approvalData);

        setApproveResponse(response);
        closeModals();
        setIsResponseModalOpen(true);

        fetchPagoDetail();

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al aprobar el pago';
        toast.error(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [paymentId, closeModals, fetchPagoDetail]
  );

  const handleRejectPayment = useCallback(async () => {
    try {
      if (!rejectionReason.trim()) {
        toast.error('Debe ingresar un motivo de rechazo');
        return null;
      }

      setIsSubmitting(true);

      const response = await rejectPaymentDetail(paymentId, { rejectionReason });

      setRejectResponse(response);
      closeModals();
      setIsResponseModalOpen(true);

      fetchPagoDetail();

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar el pago';

      toast.error(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [paymentId, rejectionReason, closeModals, fetchPagoDetail]);

  const handleUpdatePayment = useCallback(
    async (updateData: { codeOperation: string; numberTicket: string }) => {
      try {
        setIsSubmitting(true);

        await completePaymentDetail(paymentId, updateData);

        toast.success('Información del pago actualizada correctamente');
        fetchPagoDetail();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al actualizar la información del pago';

        toast.error(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [paymentId, fetchPagoDetail]
  );

  const navigateToPaymentsList = useCallback(() => {
    router.push('/ventas/facturacion/pagos');
  }, [router]);

  const closeResponseModal = useCallback(() => {
    setIsResponseModalOpen(false);
    setApproveResponse(null);
    setRejectResponse(null);
  }, []);

  useEffect(() => {
    fetchPagoDetail();
  }, [fetchPagoDetail]);

  return {
    payment,
    isLoading,
    error,
    refetch: fetchPagoDetail,

    isApproveModalOpen,
    isRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    isSubmitting,

    openApproveModal,
    openRejectModal,
    closeModals,

    handleApprovePayment,
    handleRejectPayment,
    handleUpdatePayment,

    approveResponse,
    rejectResponse,
    isResponseModalOpen,
    closeResponseModal,
    navigateToPaymentsList
  };
}
