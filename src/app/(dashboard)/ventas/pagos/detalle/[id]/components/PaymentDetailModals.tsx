import { ApprovePaymentDTO } from '@/lib/application/dtos/approve-payment.dto';
import { PaymentImageViewer } from '../components/PaymentImageViewer';

import { ApprovePaymentModal } from '../components/modals/ApprovePaymentModal';
import { PaymentResponseModal } from '../components/modals/PaymentResponseModal';
import { RejectPaymentModal } from '../components/modals/RejectPaymentModal';
import { PaymentDetailItem } from '@/lib/domain/entities/sales/payment.entity';
import { PaymentApproveRejectResponse } from '@/lib/infrastructure/types/sales/api-response.types';

interface props {
  payment: PaymentDetailItem;
  isApproveModalOpen: boolean;
  isRejectModalOpen: boolean;
  isResponseModalOpen: boolean;
  isSubmitting: boolean;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  selectedImageUrl: string | null;
  approveResponse: PaymentApproveRejectResponse | null;
  rejectResponse: PaymentApproveRejectResponse | null;
  closeModals: () => void;
  handleApprovePayment: (
    approvalData: ApprovePaymentDTO
  ) => Promise<PaymentApproveRejectResponse | null>;
  handleRejectPayment: () => Promise<PaymentApproveRejectResponse | null>;
  closeResponseModal: () => void;
  navigateToPaymentsList: () => void;
  onCloseImageViewer: () => void;
}

export default function PaymentDetailModals({
  payment,
  isApproveModalOpen,
  isRejectModalOpen,
  isResponseModalOpen,
  isSubmitting,
  rejectionReason,
  setRejectionReason,
  selectedImageUrl,
  approveResponse,
  rejectResponse,
  closeModals,
  handleApprovePayment,
  handleRejectPayment,
  closeResponseModal,
  navigateToPaymentsList,
  onCloseImageViewer
}: props) {
  return (
    <>
      <ApprovePaymentModal
        isOpen={isApproveModalOpen}
        onClose={closeModals}
        onApprove={handleApprovePayment}
        payment={payment}
        isSubmitting={isSubmitting}
      />

      <RejectPaymentModal
        isOpen={isRejectModalOpen}
        onClose={closeModals}
        onReject={handleRejectPayment}
        payment={payment}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isSubmitting={isSubmitting}
      />

      <PaymentResponseModal
        isOpen={isResponseModalOpen}
        onClose={closeResponseModal}
        approveResponse={approveResponse}
        rejectResponse={rejectResponse}
        onViewAllPayments={navigateToPaymentsList}
      />

      {selectedImageUrl && (
        <PaymentImageViewer imageUrl={selectedImageUrl} onClose={onCloseImageViewer} />
      )}
    </>
  );
}
