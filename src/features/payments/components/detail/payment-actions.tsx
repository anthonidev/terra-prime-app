'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApprovePaymentModal } from '../dialogs/approve-payment-modal';
import { RejectPaymentModal } from '../dialogs/reject-payment-modal';

interface PaymentActionsProps {
  paymentId: string;
}

export function PaymentActions({ paymentId }: PaymentActionsProps) {
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  return (
    <>
      <Card className="border-l-primary border-l-4 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="text-primary h-5 w-5" />
            Acciones de Revisión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Este pago está pendiente de revisión. Por favor, verifique los datos y comprobantes
              antes de aprobar.
            </p>
            <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row">
              <Button onClick={() => setApproveModalOpen(true)} className="min-w-[140px] shadow-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar Pago
              </Button>

              <Button
                variant="destructive"
                onClick={() => setRejectModalOpen(true)}
                className="min-w-[140px] shadow-sm"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar Pago
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <ApprovePaymentModal
        open={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        paymentId={paymentId}
      />

      {/* Reject Modal */}
      <RejectPaymentModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        paymentId={paymentId}
      />
    </>
  );
}
