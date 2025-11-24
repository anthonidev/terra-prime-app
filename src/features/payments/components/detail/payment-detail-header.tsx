'use client';

import { ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PaymentDetail, StatusPayment } from '../../types';

interface PaymentDetailHeaderProps {
  payment: PaymentDetail;
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

export function PaymentDetailHeader({ payment }: PaymentDetailHeaderProps) {
  const client = payment.client;
  const lead = client?.lead;
  const clientName =
    lead?.firstName && lead?.lastName
      ? `${lead.firstName} ${lead.lastName}`
      : 'Cliente sin información';

  const symbol = payment.currency === 'USD' ? '$' : 'S/';
  const statusConf = statusConfig[payment.status];

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/pagos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a pagos
          </Link>
        </Button>
      </div>

      {/* Header Content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Pago #{payment.id}
            </h1>
            <Badge variant={statusConf.variant} className="px-2.5 py-0.5 text-xs font-semibold">
              {statusConf.label}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">{clientName}</p>
          <div className="text-muted-foreground flex items-center gap-4 pt-1 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(payment.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
              </span>
            </div>
            {payment.codeOperation && (
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span className="font-mono">{payment.codeOperation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-muted-foreground text-sm font-medium">Monto Total</p>
          <p className="text-primary text-4xl font-bold tracking-tight">
            {symbol} {payment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
