'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/lib/utils';
import { StatusPayment, type Payment } from '../../types';

interface PaymentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: Payment[];
  installmentNumber: number;
}

const statusConfig: Record<
  StatusPayment,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  [StatusPayment.PENDING]: { label: 'Pendiente', variant: 'outline' },
  [StatusPayment.APPROVED]: { label: 'Aprobado', variant: 'default' },
  [StatusPayment.COMPLETED]: { label: 'Completado', variant: 'default' },
  [StatusPayment.REJECTED]: { label: 'Rechazado', variant: 'destructive' },
  [StatusPayment.CANCELLED]: { label: 'Cancelado', variant: 'destructive' },
};

export function PaymentsModal({
  open,
  onOpenChange,
  payments,
  installmentNumber,
}: PaymentsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pagos de la Cuota #{installmentNumber}</DialogTitle>
        </DialogHeader>

        {payments.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No hay pagos registrados para esta cuota.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>N° Ticket</TableHead>
                  <TableHead>Motivo Rechazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const status = statusConfig[payment.status];
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">#{payment.id}</TableCell>
                      <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{payment.numberTicket || '-'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate text-xs">
                        {payment.rejectionReason || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
