'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  Hash,
  Building2,
  Clock,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { PaymentSummary, StatusPayment, CurrencyType } from '../../../types';

// Payment status badge configurations
const paymentStatusConfig: Record<
  StatusPayment,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
};

interface PaymentCardsViewProps {
  payments: PaymentSummary[];
  currency: CurrencyType;
}

export function PaymentCardsView({ payments, currency }: PaymentCardsViewProps) {
  return (
    <div className="grid gap-4">
      {payments.map((payment, index) => (
        <motion.div
          key={payment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      payment.status === 'APPROVED'
                        ? 'bg-green-500/10'
                        : payment.status === 'REJECTED'
                        ? 'bg-destructive/10'
                        : 'bg-primary/10'
                    }`}
                  >
                    {payment.status === 'APPROVED' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <DollarSign
                        className={`h-5 w-5 ${
                          payment.status === 'REJECTED' ? 'text-destructive' : 'text-primary'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold leading-none">
                      Pago #{payment.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {payment.paymentConfig}
                    </p>
                  </div>
                </div>
                <Badge variant={paymentStatusConfig[payment.status].variant}>
                  {paymentStatusConfig[payment.status].label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pb-3 space-y-3">
              {/* Amount */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Monto</p>
                  <p className="text-lg font-bold text-primary">
                    {currency === 'USD' ? '$' : 'S/'}{' '}
                    {payment.amount.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Creación</p>
                    <p className="text-sm font-medium">
                      {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>

                {payment.dateOperation && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Operación</p>
                      <p className="text-sm font-medium">
                        {format(new Date(payment.dateOperation), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bank and Operation Details */}
              {(payment.banckName || payment.codeOperation || payment.numberTicket) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {payment.banckName && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Banco</p>
                          <p className="text-sm font-medium">{payment.banckName}</p>
                        </div>
                      </div>
                    )}

                    {payment.codeOperation && (
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Código de Operación</p>
                          <p className="text-sm font-mono">{payment.codeOperation}</p>
                        </div>
                      </div>
                    )}

                    {payment.numberTicket && (
                      <div className="flex items-start gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">N° Boleta</p>
                          <p className="text-sm font-mono">{payment.numberTicket}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Review Info */}
              {payment.reviewedAt && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Fecha de Revisión</p>
                        <p className="text-sm font-medium">
                          {format(new Date(payment.reviewedAt), 'dd MMM yyyy HH:mm', { locale: es })}
                        </p>
                      </div>
                    </div>

                    {payment.reason && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Motivo</p>
                          <p className="text-sm">{payment.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
