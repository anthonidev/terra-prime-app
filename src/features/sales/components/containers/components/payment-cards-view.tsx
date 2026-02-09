'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { PaymentSummary, StatusPayment, CurrencyType } from '../../../types';
import { formatDateOnly, formatDateTime } from '@/shared/utils/date-formatter';

// Payment status badge configurations
const paymentStatusConfig: Record<
  StatusPayment,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    dotColor: string;
  }
> = {
  PENDING: { label: 'Pendiente', variant: 'outline', dotColor: 'bg-yellow-500' },
  APPROVED: { label: 'Aprobado', variant: 'default', dotColor: 'bg-green-500' },
  COMPLETED: { label: 'Completado', variant: 'secondary', dotColor: 'bg-blue-500' },
  REJECTED: { label: 'Rechazado', variant: 'destructive', dotColor: 'bg-red-500' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive', dotColor: 'bg-gray-400' },
};

// Payment config badge styles
const configBadgeStyles: Record<string, string> = {
  'Pago de Venta': 'bg-green-50 text-green-700 border-green-200',
  'Pago de Reserva': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pago de Inicial': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pago de Cuota': 'bg-purple-50 text-purple-700 border-purple-200',
  'Pago de Mora': 'bg-red-50 text-red-700 border-red-200',
};

interface PaymentCardsViewProps {
  payments: PaymentSummary[];
  currency: CurrencyType;
}

export function PaymentCardsView({ payments, currency }: PaymentCardsViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  return (
    <div className="grid gap-3">
      {payments.map((payment, index) => {
        const statusConfig = paymentStatusConfig[payment.status];
        const configStyle =
          configBadgeStyles[payment.paymentConfig] || 'bg-muted text-muted-foreground';

        return (
          <motion.div
            key={payment.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        payment.status === 'APPROVED'
                          ? 'bg-green-500/10'
                          : payment.status === 'REJECTED'
                            ? 'bg-destructive/10'
                            : 'bg-primary/10'
                      }`}
                    >
                      {payment.status === 'APPROVED' ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />
                      ) : (
                        <DollarSign
                          className={`h-4.5 w-4.5 ${
                            payment.status === 'REJECTED' ? 'text-destructive' : 'text-primary'
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/pagos/detalle/${payment.id}`}
                        className="text-primary inline-flex items-center gap-1 text-sm leading-none font-semibold hover:underline"
                      >
                        Pago #{payment.id}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <span
                        className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${configStyle}`}
                      >
                        {payment.paymentConfig}
                      </span>
                    </div>
                  </div>
                  <Badge variant={statusConfig.variant} className="gap-1.5 text-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`} />
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                {/* Amount */}
                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                  <span className="text-muted-foreground text-xs font-medium">Monto</span>
                  <span className="text-base font-bold tabular-nums">
                    {currencySymbol} {payment.amount.toLocaleString('es-PE')}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                    <div>
                      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                        Creacion
                      </p>
                      <p className="text-sm font-medium tabular-nums">
                        {formatDateTime(payment.createdAt, 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>

                  {payment.dateOperation && (
                    <div className="flex items-start gap-2">
                      <Clock className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                      <div>
                        <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                          Operacion
                        </p>
                        <p className="text-sm font-medium tabular-nums">
                          {formatDateOnly(payment.dateOperation, 'dd MMM yyyy')}
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
                          <Building2 className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                              Banco
                            </p>
                            <p className="text-sm font-medium">{payment.banckName}</p>
                          </div>
                        </div>
                      )}

                      {payment.codeOperation && (
                        <div className="flex items-start gap-2">
                          <CreditCard className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                              Codigo de Operacion
                            </p>
                            <p className="font-mono text-sm">{payment.codeOperation}</p>
                          </div>
                        </div>
                      )}

                      {payment.numberTicket && (
                        <div className="flex items-start gap-2">
                          <Hash className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                              N° Boleta
                            </p>
                            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                              {payment.numberTicket}
                            </code>
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
                        <FileText className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                        <div className="flex-1">
                          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            Fecha de Revision
                          </p>
                          <p className="text-sm font-medium tabular-nums">
                            {formatDateTime(payment.reviewedAt, 'dd MMM yyyy HH:mm')}
                          </p>
                        </div>
                      </div>

                      {payment.reason && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                          <div className="flex-1">
                            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                              Motivo
                            </p>
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
        );
      })}
    </div>
  );
}
