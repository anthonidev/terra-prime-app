'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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
      <Button variant="ghost" size="sm" asChild>
        <Link href="/pagos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a pagos
        </Link>
      </Button>

      {/* Header Content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Pago de {clientName}</h1>
          <p className="text-primary text-xl font-semibold">
            {symbol} {payment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <Badge variant={statusConf.variant} className="w-fit px-4 py-2 text-base">
          {statusConf.label}
        </Badge>
      </div>
    </div>
  );
}
