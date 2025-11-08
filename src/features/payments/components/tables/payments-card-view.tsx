'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  User,
  Building2,
  DollarSign,
  Eye,
  CreditCard,
  Landmark,
} from 'lucide-react';
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold leading-none">
                  {symbol} {payment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {payment.id}
                </p>
              </div>
            </div>
            <Badge variant={statusConfig[payment.status].variant}>
              {statusConfig[payment.status].label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3 space-y-3">
          {/* Client Info */}
          {lead && (lead.firstName || lead.lastName) && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {lead.firstName} {lead.lastName}
                </p>
                {lead.document && (
                  <p className="text-xs text-muted-foreground">{lead.document}</p>
                )}
              </div>
            </div>
          )}

          {/* Lot Info */}
          {lot?.name && (
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{lot.name}</p>
                {lot.project && (
                  <p className="text-xs text-muted-foreground">{lot.project}</p>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-3">
            {/* Code Operation */}
            {payment.codeOperation && (
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="text-sm font-mono">{payment.codeOperation}</p>
                </div>
              </div>
            )}

            {/* Bank Name */}
            {payment.banckName && (
              <div className="flex items-start gap-2">
                <Landmark className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Banco</p>
                  <p className="text-sm">{payment.banckName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 pt-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {format(new Date(payment.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>

          {/* Registered By */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Registrado por</p>
            <p className="text-sm font-medium">
              {payment.user.firstName} {payment.user.lastName}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={`/pagos/detalle/${payment.id}`}>
              <Eye className="h-4 w-4 mr-2" />
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
