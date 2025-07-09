'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { FileText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { usePagoDetail } from '../../hooks/usePagoDetail';
import * as React from 'react';
import PaymentActionButtons from './components/PaymentActionButtons';
import PaymentInfoSection from './components/PaymentInfoSection';
import PaymentUserSection from './components/PaymentUserSection';
import PaymentImagesSection from './components/PaymentImagesSection';
import { UpdatePaymentDetailsModal } from './components/UpdatePaymentDetailsModal';
import { StatusPayment } from '@/lib/domain/entities/sales/payment.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import { PaymentDetailSkeleton } from './components/PaymentDetailSkeleton';
import NotFound from './not-found';
import PaymentClientSection from './components/PaymentClientSection';
import PaymentLotSection from './components/PaymentLotSection';
import PaymentDetailModals from './components/PaymentDetailModals';

export default function PagoDetailPage() {
  const params = useParams<{ id: string }>();
  const paymentId = Number(params.id);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState<boolean>(false);

  const {
    payment,
    isLoading,
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
  } = usePagoDetail(paymentId);

  const handleImageClick = (url: string) => setSelectedImageUrl(url);
  const handleCloseImageViewer = () => setSelectedImageUrl(null);
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const handleUpdateAndClose = async (updateData: {
    codeOperation: string;
    numberTicket: string;
  }) => {
    const success = await handleUpdatePayment(updateData);
    if (success) closeUpdateModal();
  };

  if (isLoading) return <PaymentDetailSkeleton />;
  if (!payment) return <NotFound />;

  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${payment.id}`}
        subtitle="Información detallada del pago administrativo"
        variant="gradient"
        icon={FileText}
        backUrl="/ventas/facturacion/pagos"
        actions={
          <>
            <StatusBadge status={payment.status} />
            <PaymentActionButtons
              status={payment.status}
              onApprove={payment.status === StatusPayment.PENDING ? openApproveModal : undefined}
              onReject={payment.status === StatusPayment.PENDING ? openRejectModal : undefined}
              onUpdate={
                payment.status === StatusPayment.APPROVED ||
                payment.status === StatusPayment.COMPLETED
                  ? openUpdateModal
                  : undefined
              }
            />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PaymentInfoSection payment={payment} />
          <PaymentUserSection payment={payment} />
          <PaymentClientSection payment={payment} />
          <PaymentLotSection lot={payment.lot} />
        </div>

        <PaymentImagesSection
          images={payment.vouchers}
          onImageClick={handleImageClick}
          currencyType={payment.currency}
        />

        <PaymentDetailModals
          payment={payment}
          isApproveModalOpen={isApproveModalOpen}
          isRejectModalOpen={isRejectModalOpen}
          isResponseModalOpen={isResponseModalOpen}
          isSubmitting={isSubmitting}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          selectedImageUrl={selectedImageUrl}
          closeModals={closeModals}
          handleApprovePayment={handleApprovePayment}
          handleRejectPayment={handleRejectPayment}
          closeResponseModal={closeResponseModal}
          navigateToPaymentsList={navigateToPaymentsList}
          approveResponse={approveResponse}
          rejectResponse={rejectResponse}
          onCloseImageViewer={handleCloseImageViewer}
        />

        <UpdatePaymentDetailsModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onUpdate={handleUpdateAndClose}
          payment={payment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
