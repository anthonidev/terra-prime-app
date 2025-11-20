'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, User, Building2, DollarSign, Eye, CreditCard, Landmark } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Payment, StatusPayment } from '../../types';

// Status badge configurations
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

interface PaymentsCardViewProps {
  payments: Payment[];
}

function PaymentCard({ payment, index }: { payment: Payment; index: number }) {
  const client = payment.client;
  const lead = client?.lead;
  const lot = payment.lot;
  const symbol = payment.currency === 'USD' ? '$' : 'S/';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <DollarSign className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="leading-none font-semibold">
                  {symbol} {payment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">ID: {payment.id}</p>
              </div>
            </div>
            <Badge variant={statusConfig[payment.status].variant}>
              {statusConfig[payment.status].label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Client Info */}
          {lead && (lead.firstName || lead.lastName) && (
            <div className="flex items-start gap-2">
              <User className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {lead.firstName} {lead.lastName}
                </p>
                {lead.document && <p className="text-muted-foreground text-xs">{lead.document}</p>}
              </div>
            </div>
          )}

          {/* Lot Info */}
          {lot?.name && (
            <div className="flex items-start gap-2">
              <Building2 className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{lot.name}</p>
                {lot.project && <p className="text-muted-foreground text-xs">{lot.project}</p>}
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-3">
            {/* Code Operation */}
            {payment.codeOperation && (
              <div className="flex items-start gap-2">
                <CreditCard className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Código</p>
                  <p className="font-mono text-sm">{payment.codeOperation}</p>
                </div>
              </div>
            )}

            {/* Bank Name */}
            {payment.banckName && (
              <div className="flex items-start gap-2">
                <Landmark className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Banco</p>
                  <p className="text-sm">{payment.banckName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 pt-1">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs">
              {format(new Date(payment.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>

          {/* Registered By */}
          <div className="border-t pt-2">
            <p className="text-muted-foreground mb-1 text-xs">Registrado por</p>
            <p className="text-sm font-medium">
              {payment.user.firstName} {payment.user.lastName}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={`/pagos/detalle/${payment.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function PaymentsCardView({ payments }: PaymentsCardViewProps) {
  return (
    <div className="grid gap-4">
      {payments.map((payment, index) => (
        <PaymentCard key={payment.id} payment={payment} index={index} />
      ))}
    </div>
  );
}
