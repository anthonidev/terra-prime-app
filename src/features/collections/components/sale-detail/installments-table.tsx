'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCurrency } from '@/shared/lib/utils';
import { type Installment, StatusFinancingInstallments } from '../../types';
import { RegisterInstallmentPaymentModal } from '../dialogs/register-installment-payment-modal';
import { useAuth } from '@/features/auth/hooks/use-auth';

const statusConfig: Record<
  StatusFinancingInstallments,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  PENDING: { label: 'Pendiente', variant: 'secondary' },
  EXPIRED: { label: 'Vencida', variant: 'destructive' },
  PAID: { label: 'Pagada', variant: 'default' },
};

interface InstallmentsTableProps {
  installments: Installment[];
  financingId?: string;
  currency?: string;
  hasPendingPayment?: boolean;
  onSuccess?: () => void;
}

export function InstallmentsTable({
  installments,
  financingId,
  currency,
  hasPendingPayment = false,
  onSuccess,
}: InstallmentsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isRegisterPaymentOpen, setIsRegisterPaymentOpen] = useState(false);
  const { user } = useAuth();
  const isCob = user?.role.code === 'COB';

  const RegisterPaymentButton = () => {
    if (!isCob || !financingId) return null;

    return (
      <div className="mb-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsRegisterPaymentOpen(true)} disabled={hasPendingPayment}>
            Registrar Pago
          </Button>
        </div>
        {hasPendingPayment && (
          <p className="text-muted-foreground mt-1 text-right text-xs">
            Tiene un pago pendiente de aprobación
          </p>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <RegisterPaymentButton />
        <div className="space-y-4">
          {installments.map((installment, index) => {
            const status = statusConfig[installment.status];
            return (
              <Card key={installment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Cuota #{index + 1}</CardTitle>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vencimiento:</span>
                    <span>{new Date(installment.expectedPaymentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span>{formatCurrency(Number(installment.couteAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagado:</span>
                    <span className="text-green-600">
                      {formatCurrency(Number(installment.coutePaid))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendiente:</span>
                    <span className="text-red-600">
                      {formatCurrency(Number(installment.coutePending))}
                    </span>
                  </div>
                  {Number(installment.lateFeeAmountPending) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mora Pendiente:</span>
                      <span className="text-orange-600">
                        {formatCurrency(Number(installment.lateFeeAmountPending))}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {financingId && (
          <RegisterInstallmentPaymentModal
            open={isRegisterPaymentOpen}
            onOpenChange={setIsRegisterPaymentOpen}
            financingId={financingId}
            currency={currency}
            onSuccess={onSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <RegisterPaymentButton />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead>Pendiente</TableHead>
              <TableHead>Mora Pend.</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installments.map((installment, index) => {
              const status = statusConfig[installment.status];
              return (
                <TableRow key={installment.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {new Date(installment.expectedPaymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(installment.couteAmount))}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(Number(installment.coutePaid))}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {formatCurrency(Number(installment.coutePending))}
                  </TableCell>
                  <TableCell>
                    {Number(installment.lateFeeAmountPending) > 0 ? (
                      <span className="text-orange-600">
                        {formatCurrency(Number(installment.lateFeeAmountPending))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {financingId && (
        <RegisterInstallmentPaymentModal
          open={isRegisterPaymentOpen}
          onOpenChange={setIsRegisterPaymentOpen}
          financingId={financingId}
          currency={currency}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
