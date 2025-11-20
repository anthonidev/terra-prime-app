'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, Landmark, FileText, User, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PaymentDetail } from '../../types';

interface PaymentInfoSectionProps {
  payment: PaymentDetail;
}

export function PaymentInfoSection({ payment }: PaymentInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Información del Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ID and Config */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">ID de Pago</p>
            <p className="text-base font-semibold">#{payment.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Configuración</p>
            <p className="text-base">{payment.paymentConfig}</p>
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-2">
            <Calendar className="text-muted-foreground mt-1 h-4 w-4" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">Fecha de Creación</p>
              <p className="text-base">
                {format(new Date(payment.createdAt), "dd 'de' MMMM, yyyy 'a las' HH:mm", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          {payment.dateOperation && (
            <div className="flex items-start gap-2">
              <Calendar className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm font-medium">Fecha de Operación</p>
                <p className="text-base">
                  {format(new Date(payment.dateOperation), "dd 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="grid gap-4 md:grid-cols-2">
          {payment.codeOperation && (
            <div className="flex items-start gap-2">
              <CreditCard className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm font-medium">Código de Operación</p>
                <p className="font-mono text-base">{payment.codeOperation}</p>
              </div>
            </div>
          )}

          {payment.banckName && (
            <div className="flex items-start gap-2">
              <Landmark className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm font-medium">Banco</p>
                <p className="text-base">{payment.banckName}</p>
              </div>
            </div>
          )}

          {payment.numberTicket && (
            <div className="flex items-start gap-2">
              <FileText className="text-muted-foreground mt-1 h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm font-medium">Número de Boleta</p>
                <p className="text-base">{payment.numberTicket}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Registered By */}
        <div className="flex items-start gap-2">
          <User className="text-muted-foreground mt-1 h-4 w-4" />
          <div>
            <p className="text-muted-foreground text-sm font-medium">Registrado por</p>
            <p className="text-base font-medium">
              {payment.user.firstName} {payment.user.lastName}
            </p>
            <p className="text-muted-foreground text-sm">{payment.user.email}</p>
          </div>
        </div>

        {/* Review Information */}
        {payment.reviewedAt && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                {payment.status === 'APPROVED' ? (
                  <CheckCircle className="mt-1 h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="text-destructive mt-1 h-4 w-4" />
                )}
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {payment.status === 'APPROVED' ? 'Aprobado' : 'Revisado'}
                  </p>
                  <p className="text-base">
                    {format(new Date(payment.reviewedAt), "dd 'de' MMMM, yyyy 'a las' HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              {payment.reviewBy && (
                <div className="flex items-start gap-2">
                  <User className="text-muted-foreground mt-1 h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Revisado por</p>
                    <p className="text-base">{payment.reviewBy.email}</p>
                  </div>
                </div>
              )}

              {payment.reason && (
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground mb-1 text-sm font-medium">Motivo</p>
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
