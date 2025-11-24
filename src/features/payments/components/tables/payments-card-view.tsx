'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, DollarSign, Eye, CreditCard, Landmark, UserCog } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserInfo } from '@/shared/components/user-info';
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
      <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
        <CardHeader className="bg-muted/30 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border">
                <DollarSign className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-lg leading-none font-bold">
                  {symbol} {payment.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className="h-5 px-1.5 font-mono text-[10px]">
                    ID: {payment.id}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant={statusConfig[payment.status].variant}>
              {statusConfig[payment.status].label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Client Info */}
          {lead && (lead.firstName || lead.lastName) && (
            <UserInfo
              name={`${lead.firstName} ${lead.lastName}`}
              document={lead.document}
              // email={lead.email}
              // avatarFallback={lead.firstName?.[0] || 'C'}
              // size="sm"
            />
          )}

          <Separator />

          {/* Lot Info */}
          {lot?.name && (
            <div className="flex items-start gap-3">
              <div className="bg-muted/50 rounded-md p-2">
                <Building2 className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{lot.name}</p>
                {lot.project && <p className="text-muted-foreground text-xs">{lot.project}</p>}
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-muted/20 border-border/50 grid grid-cols-2 gap-3 rounded-lg border p-3">
            {/* Code Operation */}
            {payment.codeOperation ? (
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Código</span>
                </div>
                <p className="pl-5 font-mono text-sm">{payment.codeOperation}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Código</span>
                </div>
                <p className="text-muted-foreground pl-5 text-sm">-</p>
              </div>
            )}

            {/* Bank Name */}
            {payment.banckName ? (
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Banco</span>
                </div>
                <p className="truncate pl-5 text-sm" title={payment.banckName}>
                  {payment.banckName}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Banco</span>
                </div>
                <p className="text-muted-foreground pl-5 text-sm">-</p>
              </div>
            )}
          </div>

          {/* Registered By */}
          <div className="flex items-center gap-2 pt-1">
            <UserCog className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground text-xs">Registrado por:</span>
            <span className="text-sm font-medium">
              {payment.user.firstName} {payment.user.lastName}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <Button variant="default" size="sm" className="w-full shadow-sm" asChild>
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {payments.map((payment, index) => (
        <PaymentCard key={payment.id} payment={payment} index={index} />
      ))}
    </div>
  );
}
