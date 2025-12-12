'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/shared/lib/utils';
import type { PaymentSummary, StatusPayment } from '../../types';
import { getShortConceptName } from './payment-concept-config';

interface PaymentsSummaryTableProps {
  payments: PaymentSummary[];
  currency?: string;
}

const statusConfig: Record<
  StatusPayment,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
};

export function PaymentsSummaryTable({ payments, currency = 'USD' }: PaymentsSummaryTableProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground text-sm">No hay pagos registrados</p>
        </CardContent>
      </Card>
    );
  }

  const symbol = currency === 'USD' ? '$' : 'S/';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Boleta</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const config = statusConfig[payment.status];
            return (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {format(new Date(payment.createdAt), 'dd MMM', { locale: es })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(payment.createdAt), 'yyyy', { locale: es })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    <p className="truncate text-sm font-medium">
                      {getShortConceptName(payment.paymentConfig)}
                    </p>
                    {payment.metadata && payment.metadata['Concepto de pago'] && (
                      <p className="text-muted-foreground truncate text-xs">
                        {payment.metadata['Concepto de pago']}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold">
                    {symbol} {formatCurrency(payment.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  {payment.numberTicket ? (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {payment.numberTicket}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
