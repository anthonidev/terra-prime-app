'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePaymentDetail } from '../../hooks/use-payment-detail';
import { PaymentDetailSkeleton } from '../skeletons/payment-detail-skeleton';
import { PaymentDetailError } from '../detail/payment-detail-error';
import { PaymentDetailHeader } from '../detail/payment-detail-header';
import { PaymentInfoSection } from '../detail/payment-info-section';
import { ClientLotSection } from '../detail/client-lot-section';
import { VouchersSection } from '../detail/vouchers-section';
import { PaymentActions } from '../detail/payment-actions';
import { CompletePaymentModal } from '../dialogs/complete-payment-modal';
import { StatusPayment } from '../../types';

// TODO: Habilitar cuando SUNAT esté listo para producción
// import { FileText, Eye, Send } from 'lucide-react';
// import { useInvoiceByPayment } from '@/features/invoices/hooks/use-invoice-by-payment';
// import { SunatInvoiceModal } from '@/features/invoices/components/dialogs/sunat-invoice-modal';
// import { InvoiceSuccessModal } from '@/features/invoices/components/dialogs/invoice-success-modal';
// import { InvoiceDetailModal } from '@/features/invoices/components/dialogs/invoice-detail-modal';
// import type { Invoice } from '@/features/invoices/types';

interface PaymentDetailContainerProps {
  paymentId: string;
}

export function PaymentDetailContainer({ paymentId }: PaymentDetailContainerProps) {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  // TODO: Habilitar cuando SUNAT esté listo para producción
  // const [sunatModalOpen, setSunatModalOpen] = useState(false);
  // const [successModalOpen, setSuccessModalOpen] = useState(false);
  // const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] = useState(false);
  // const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

  const { data: payment, isLoading, isError } = usePaymentDetail(paymentId);
  const { user } = useAuth();

  // TODO: Habilitar cuando SUNAT esté listo para producción
  // const { data: existingInvoice, isLoading: isLoadingInvoice } = useInvoiceByPayment(paymentId);

  // Handle successful invoice creation
  // const handleInvoiceSuccess = (invoice: Invoice) => {
  //   setCreatedInvoice(invoice);
  //   setSuccessModalOpen(true);
  // };

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

  // Check if user can approve/reject (role code "FAC" or "ADM" and status PENDING)
  const canReview = hasAdminRole && payment.status === StatusPayment.PENDING;

  // Check if user can update approved payment (role code "FAC" or "ADM" and status APPROVED)
  const canUpdate = hasAdminRole && payment.status === StatusPayment.APPROVED;

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

      {/* Update Payment (if approved) */}
      {canUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Actualizar Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Este pago ha sido aprobado. Puedes actualizar información adicional.
              </p>
              <Button onClick={() => setCompleteModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Actualizar Pago
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* TODO: Habilitar cuando SUNAT esté listo para producción */}
      {/* SUNAT Invoice Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Comprobante Electrónico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInvoice ? (
              <p className="text-muted-foreground text-sm">
                Cargando información del comprobante...
              </p>
            ) : existingInvoice && existingInvoice.pdfUrl ? (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Este pago ya tiene un comprobante generado:{' '}
                  <span className="text-foreground font-medium">{existingInvoice.fullNumber}</span>
                </p>
                <Button onClick={() => setInvoiceDetailModalOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Genera un comprobante electrónico (Factura o Boleta) para este pago.
                </p>
                <Button onClick={() => setSunatModalOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar a SUNAT
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div> */}

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
      />

      {/* TODO: Habilitar cuando SUNAT esté listo para producción */}
      {/* SUNAT Invoice Modal */}
      {/* <SunatInvoiceModal
        open={sunatModalOpen}
        onOpenChange={setSunatModalOpen}
        payment={payment}
        onSuccess={handleInvoiceSuccess}
      /> */}

      {/* Invoice Success Modal */}
      {/* <InvoiceSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        invoice={createdInvoice}
      /> */}

      {/* Invoice Detail Modal */}
      {/* <InvoiceDetailModal
        open={invoiceDetailModalOpen}
        onOpenChange={setInvoiceDetailModalOpen}
        invoice={existingInvoice ?? null}
      /> */}
    </div>
  );
}
