'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useApprovePayment } from '../../hooks/use-approve-payment';
import { useRejectPayment } from '../../hooks/use-reject-payment';

interface PaymentActionsProps {
  paymentId: string;
}

export function PaymentActions({ paymentId }: PaymentActionsProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();

  const handleApprove = () => {
    approvePayment.mutate(paymentId, {
      onSuccess: () => {
        setApproveDialogOpen(false);
      },
    });
  };

  const handleReject = () => {
    rejectPayment.mutate(paymentId, {
      onSuccess: () => {
        setRejectDialogOpen(false);
      },
    });
  };

  const isLoading = approvePayment.isPending || rejectPayment.isPending;

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Acciones de Revisión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Este pago está pendiente de revisión. Puedes aprobarlo o rechazarlo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => setApproveDialogOpen(true)}
              disabled={isLoading}
              className="flex-1"
            >
              {approvePayment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aprobando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar Pago
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              onClick={() => setRejectDialogOpen(true)}
              disabled={isLoading}
              className="flex-1"
            >
              {rejectPayment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rechazando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar Pago
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar este pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el pago como aprobado. ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isLoading}>
              {approvePayment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aprobando...
                </>
              ) : (
                'Aprobar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar este pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el pago como rechazado. ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectPayment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rechazando...
                </>
              ) : (
                'Rechazar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
