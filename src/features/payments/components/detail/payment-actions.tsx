'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
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
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Acciones de Revisión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            Este pago está pendiente de revisión. Puedes aprobarlo o rechazarlo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setApproveModalOpen(true)} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprobar Pago
            </Button>

            <Button
              variant="destructive"
              onClick={() => setRejectModalOpen(true)}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rechazar Pago
            </Button>
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
