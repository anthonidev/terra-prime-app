'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserInfo } from '@/shared/components/user-info';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  XCircle,
} from 'lucide-react';
import type { PaymentDetail } from '../../types';
import { PaymentConfigBadge } from '../shared/payment-config-badge';

interface PaymentInfoSectionProps {
  payment: PaymentDetail;
}

export function PaymentInfoSection({ payment }: PaymentInfoSectionProps) {
  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="text-primary h-5 w-5" />
          Información del Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ID and Config */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              ID de Pago
            </p>
            <p className="font-mono text-base font-medium">#{payment.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
              <Settings className="h-3 w-3" />
              Tipo de Pago
            </p>
            <PaymentConfigBadge
              code={payment.paymentConfig.code}
              name={payment.paymentConfig.name}
            />
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
              <Calendar className="h-3 w-3" />
              Fecha de Creación
            </p>
            <p className="text-sm font-medium">
              {format(new Date(payment.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(payment.createdAt), 'HH:mm a', { locale: es })}
            </p>
          </div>

          {payment.dateOperation && (
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
                <Calendar className="h-3 w-3" />
                Fecha de Operación
              </p>
              <p className="text-sm font-medium">
                {format(new Date(payment.dateOperation), "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Detalles de Transacción
          </h3>
          <div className="bg-muted/30 border-border/50 grid gap-4 rounded-lg border p-4 sm:grid-cols-1">
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Número de Boleta</span>
              </div>
              {payment.numberTicket ? (
                <p className="pl-5 font-mono text-sm font-medium">{payment.numberTicket}</p>
              ) : (
                <p className="text-muted-foreground pl-5 text-sm">-</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Observación</span>
              </div>
              {payment.observation ? (
                <p className="pl-5 text-sm">{payment.observation}</p>
              ) : (
                <p className="text-muted-foreground pl-5 text-sm">-</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Registered By */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
            Registrado por
          </h3>
          <UserInfo
            name={`${payment.user.firstName} ${payment.user.lastName}`}
            email={payment.user.email}
          />
        </div>

        {/* Review Information */}
        {payment.reviewedAt && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium tracking-wider uppercase">
                {payment.status === 'APPROVED' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="text-destructive h-4 w-4" />
                )}
                {payment.status === 'APPROVED' ? 'Aprobado por' : 'Revisado por'}
              </h3>

              {payment.reviewBy && (
                <UserInfo
                  name={payment.reviewBy.email} // Assuming email is the best identifier available here
                  email={payment.reviewBy.email}
                />
              )}

              <div className="pl-1">
                <p className="text-muted-foreground mb-1 text-xs">Fecha de revisión</p>
                <p className="text-sm font-medium">
                  {format(new Date(payment.reviewedAt), "dd 'de' MMMM, yyyy 'a las' HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>

              {payment.reason && (
                <div className="bg-muted/50 border-border/50 rounded-md border p-3">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">
                    Motivo / Observación
                  </p>
                  <p className="text-sm">{payment.reason}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
