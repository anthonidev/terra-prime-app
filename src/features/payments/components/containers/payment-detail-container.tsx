'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, FileText, Eye, Send, XCircle, FilePlus2, FileMinus2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePaymentDetail } from '../../hooks/use-payment-detail';
import { useInvoiceByPayment } from '@/features/invoices/hooks/use-invoice-by-payment';
import { PaymentDetailSkeleton } from '../skeletons/payment-detail-skeleton';
import { PaymentDetailError } from '../detail/payment-detail-error';
import { PaymentDetailHeader } from '../detail/payment-detail-header';
import { PaymentInfoSection } from '../detail/payment-info-section';
import { ClientLotSection } from '../detail/client-lot-section';
import { VouchersSection } from '../detail/vouchers-section';
import { PaymentActions } from '../detail/payment-actions';
import { CompletePaymentModal } from '../dialogs/complete-payment-modal';
import { CancelPaymentModal } from '../dialogs/cancel-payment-modal';
import { SunatInvoiceModal } from '@/features/invoices/components/dialogs/sunat-invoice-modal';
import { InvoiceSuccessModal } from '@/features/invoices/components/dialogs/invoice-success-modal';
import { InvoiceDetailModal } from '@/features/invoices/components/dialogs/invoice-detail-modal';
import { CreateDebitNoteModal } from '@/features/invoices/components/dialogs/create-debit-note-modal';
import { CreateCreditNoteModal } from '@/features/invoices/components/dialogs/create-credit-note-modal';
import { NoteSuccessModal } from '@/features/invoices/components/dialogs/note-success-modal';
import { StatusPayment } from '../../types';
import { InvoiceStatus, type Invoice } from '@/features/invoices/types';

interface PaymentDetailContainerProps {
  paymentId: string;
}

export function PaymentDetailContainer({ paymentId }: PaymentDetailContainerProps) {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [sunatModalOpen, setSunatModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] = useState(false);
  const [debitNoteModalOpen, setDebitNoteModalOpen] = useState(false);
  const [creditNoteModalOpen, setCreditNoteModalOpen] = useState(false);
  const [noteSuccessModalOpen, setNoteSuccessModalOpen] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [createdNote, setCreatedNote] = useState<Invoice | null>(null);

  const { data: payment, isLoading, isError } = usePaymentDetail(paymentId);
  const { data: existingInvoice, isLoading: isLoadingInvoice } = useInvoiceByPayment(paymentId);
  const { user } = useAuth();

  // Handle successful invoice creation
  const handleInvoiceSuccess = (invoice: Invoice) => {
    setCreatedInvoice(invoice);
    setSuccessModalOpen(true);
  };

  // Handle successful note creation
  const handleNoteSuccess = (invoice: Invoice) => {
    setCreatedNote(invoice);
    setNoteSuccessModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return <PaymentDetailSkeleton />;
  }

  // Error state
  if (isError || !payment) {
    return <PaymentDetailError />;
  }

  // Check if user has FAC or ADM role
  const hasAdminRole = user?.role?.code === 'FAC' || user?.role?.code === 'ADM';

  // Check if payment is cancelled
  const isCancelled = payment.status === StatusPayment.CANCELLED;

  // Check if user can approve/reject (role code "FAC" or "ADM" and status PENDING)
  const canReview = hasAdminRole && payment.status === StatusPayment.PENDING;

  // Check if user can update approved payment (role code "FAC" or "ADM" and status APPROVED or COMPLETED)
  const canUpdate =
    hasAdminRole &&
    (payment.status === StatusPayment.APPROVED || payment.status === StatusPayment.COMPLETED);

  // Check if user can cancel payment (role code "FAC" or "ADM" and status APPROVED or COMPLETED)
  const canCancel =
    hasAdminRole &&
    (payment.status === StatusPayment.APPROVED || payment.status === StatusPayment.COMPLETED);

  // Check if any action button should be shown
  const showActionsBar = hasAdminRole && (canUpdate || canCancel || !isCancelled);

  // Check if invoice exists for debit/credit notes
  const hasInvoice = existingInvoice && existingInvoice.pdfUrl;

  // Check if can create notes (invoice exists and is not rejected)
  const canCreateNotes = hasInvoice && existingInvoice.status !== InvoiceStatus.REJECTED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PaymentDetailHeader payment={payment} />
      </motion.div>

      {/* Actions (if applicable) */}
      {canReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <PaymentActions paymentId={paymentId} payment={payment} />
        </motion.div>
      )}

      {/* Actions Bar - Icon buttons with labels */}
      {showActionsBar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TooltipProvider>
            <div className="flex flex-wrap gap-3">
              {/* Update Payment Button */}
              {canUpdate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCompleteModalOpen(true)}
                      className="group bg-card hover:border-primary hover:bg-primary/5 flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                        <Edit className="text-primary h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        Actualizar
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Actualizar información del pago</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Cancel Payment Button */}
              {canCancel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="group bg-card hover:border-destructive hover:bg-destructive/5 flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="bg-destructive/10 group-hover:bg-destructive/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                        <XCircle className="text-destructive h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        Cancelar
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>El saldo volverá a como estaba antes del pago</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* SUNAT Invoice Button */}
              {isLoadingInvoice ? (
                <div className="bg-card flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 opacity-50">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText className="text-muted-foreground h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">Cargando...</span>
                </div>
              ) : existingInvoice && existingInvoice.pdfUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setInvoiceDetailModalOpen(true)}
                      className="group bg-card flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all hover:border-green-500 hover:bg-green-500/5 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 transition-colors group-hover:bg-green-500/20">
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        Comprobante
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{existingInvoice.fullNumber}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => !isCancelled && setSunatModalOpen(true)}
                      disabled={isCancelled}
                      className={`group bg-card flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all ${
                        isCancelled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:border-blue-500 hover:bg-blue-500/5 hover:shadow-md'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          isCancelled ? 'bg-muted' : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                        }`}
                      >
                        <Send
                          className={`h-5 w-5 ${isCancelled ? 'text-muted-foreground' : 'text-blue-600'}`}
                        />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        SUNAT
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isCancelled ? (
                      <p>No disponible para pagos cancelados</p>
                    ) : (
                      <p>Generar comprobante electrónico</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Debit Note Button - Only show if invoice exists and is not rejected */}
              {canCreateNotes && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDebitNoteModalOpen(true)}
                      className="group bg-card flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all hover:border-orange-500 hover:bg-orange-500/5 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 transition-colors group-hover:bg-orange-500/20">
                        <FilePlus2 className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        Nota Débito
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Crear nota de débito</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Credit Note Button - Only show if invoice exists and is not rejected */}
              {canCreateNotes && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCreditNoteModalOpen(true)}
                      className="group bg-card flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 shadow-sm transition-all hover:border-purple-500 hover:bg-purple-500/5 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                        <FileMinus2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                        Nota Crédito
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Crear nota de crédito</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PaymentInfoSection payment={payment} />
        </motion.div>

        {/* Client and Lot Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <ClientLotSection payment={payment} />
        </motion.div>

        {/* Vouchers Section - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <VouchersSection payment={payment} />
        </motion.div>
      </div>

      {/* Complete Payment Modal */}
      <CompletePaymentModal
        open={completeModalOpen}
        onOpenChange={setCompleteModalOpen}
        paymentId={paymentId}
        initialData={{
          numberTicket: payment.numberTicket,
          observation: payment.observation,
          dateOperation: payment.dateOperation,
        }}
      />

      {/* Cancel Payment Modal */}
      <CancelPaymentModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        paymentId={paymentId}
      />

      {/* SUNAT Invoice Modal */}
      <SunatInvoiceModal
        open={sunatModalOpen}
        onOpenChange={setSunatModalOpen}
        payment={payment}
        onSuccess={handleInvoiceSuccess}
      />

      {/* Invoice Success Modal */}
      <InvoiceSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        invoice={createdInvoice}
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        open={invoiceDetailModalOpen}
        onOpenChange={setInvoiceDetailModalOpen}
        invoice={existingInvoice ?? null}
      />

      {/* Create Debit Note Modal */}
      {existingInvoice && (
        <CreateDebitNoteModal
          open={debitNoteModalOpen}
          onOpenChange={setDebitNoteModalOpen}
          relatedInvoice={existingInvoice}
          paymentId={paymentId}
          onSuccess={handleNoteSuccess}
        />
      )}

      {/* Create Credit Note Modal */}
      {existingInvoice && (
        <CreateCreditNoteModal
          open={creditNoteModalOpen}
          onOpenChange={setCreditNoteModalOpen}
          relatedInvoice={existingInvoice}
          paymentId={paymentId}
          onSuccess={handleNoteSuccess}
        />
      )}

      {/* Note Success Modal */}
      <NoteSuccessModal
        open={noteSuccessModalOpen}
        onOpenChange={setNoteSuccessModalOpen}
        invoice={createdNote}
      />
    </div>
  );
}
