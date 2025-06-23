import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CurrencyType,
  PaymentDetailItem,
  StatusPayment
} from '@domain/entities/sales/payment.entity';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Clock, CreditCard, FileText, XCircle } from 'lucide-react';

export default function PaymentInfoSection({
  payment
}: {
  payment: PaymentDetailItem | undefined;
}) {
  const isApproved = payment?.status === StatusPayment.APPROVED;

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-primary h-5 w-5" />
          Información General
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'grid grid-cols-1 gap-8',
            isApproved && payment.banckName && 'xl:grid-cols-2',
            payment?.status === StatusPayment.REJECTED && 'xl:grid-cols-2'
          )}
        >
          <div className="from-primary/5 to-primary/10 border-primary/10 flex flex-col justify-between rounded-xl border bg-gradient-to-br p-6">
            <h3 className="text-primary/90 mb-2 text-base font-medium">Resumen del Pago</h3>
            <div className="mt-1 mb-4">
              <div className="text-primary text-3xl font-bold">
                {formatCurrency(payment?.amount ?? 0, payment?.currency)}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">{payment?.paymentConfig}</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="bg-background/80 rounded-lg p-3 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Calendar className="text-primary h-4 w-4" />
                  <span className="text-xs font-medium">Fecha de creación</span>
                </div>
                <p className="text-sm font-medium">
                  {payment?.createdAt ? format(new Date(payment.createdAt), 'dd/MM/yyyy') : '--'}
                </p>
                <p className="text-muted-foreground text-xs">
                  {payment?.createdAt ? format(new Date(payment.createdAt), 'HH:mm') : '--'}
                </p>
              </div>

              {payment?.reviewedAt ? (
                <div className="bg-background/80 rounded-lg p-3 backdrop-blur-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <Clock className="text-primary h-4 w-4" />
                    <span className="text-xs font-medium">Fecha de revisión</span>
                  </div>
                  <p className="text-sm font-medium">
                    {format(new Date(payment.reviewedAt), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(payment.reviewedAt), 'HH:mm')}
                  </p>
                </div>
              ) : (
                <div className="bg-background/80 rounded-lg p-3 backdrop-blur-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium">En espera de revisión</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Pendiente de aprobación</p>
                </div>
              )}
            </div>
          </div>
          {isApproved && payment.banckName && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800/30 dark:bg-green-900/10">
              <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-green-700 dark:text-green-400">
                <CreditCard className="h-4 w-4" />
                Detalles de la Aprobación
              </h3>

              <div className="space-y-4">
                <div className="rounded-lg border border-green-100 bg-white p-3 shadow-sm dark:border-green-800/20 dark:bg-green-900/20">
                  <p className="text-muted-foreground mb-1 text-sm">Código de operación:</p>
                  <p className="text-base font-medium text-green-700 dark:text-green-400">
                    {payment.codeOperation || 'No especificado'}
                  </p>
                </div>

                <div className="rounded-lg border border-green-100 bg-white p-3 shadow-sm dark:border-green-800/20 dark:bg-green-900/20">
                  <p className="text-muted-foreground mb-1 text-sm">Banco:</p>
                  <p className="text-base font-medium text-green-700 dark:text-green-400">
                    {payment.banckName}
                  </p>
                </div>

                {payment.dateOperation && (
                  <div className="rounded-lg border border-green-100 bg-white p-3 shadow-sm dark:border-green-800/20 dark:bg-green-900/20">
                    <p className="text-muted-foreground mb-1 text-sm">Fecha de operación:</p>
                    <p className="text-base font-medium text-green-700 dark:text-green-400">
                      {format(new Date(payment.dateOperation), 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-green-100 bg-white p-3 shadow-sm dark:border-green-800/20 dark:bg-green-900/20">
                  <p className="text-muted-foreground mb-1 text-sm">Número de ticket:</p>
                  <p className="text-base font-medium text-green-700 dark:text-green-400">
                    {payment.numberTicket || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {payment?.status === StatusPayment.REJECTED && (
            <Card className="rounded-xl border border-red-200 bg-red-50 shadow-sm dark:border-red-800/50 dark:bg-red-900/10">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-700 dark:text-red-400">
                      Motivo de Rechazo
                    </h3>
                    <p className="text-sm text-red-600/80 dark:text-red-300/80">
                      El pago fue rechazado
                    </p>
                  </div>
                </div>
                <p className="mt-2 rounded-lg border border-red-200/50 bg-red-100/50 p-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-300">
                  {payment.reason}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
