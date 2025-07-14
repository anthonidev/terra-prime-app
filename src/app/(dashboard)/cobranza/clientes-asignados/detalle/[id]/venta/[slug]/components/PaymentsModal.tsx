'use client';

import React from 'react';
import { CreditCard, Calendar, DollarSign, Building2, CalendarDays } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CurrencyType } from '@domain/entities/sales/payment.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import { FinancingInstallmentCollector } from '@domain/entities/cobranza';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface PaymentsModalProps {
  currency: CurrencyType;
  data: FinancingInstallmentCollector;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentsModal({ currency, data, isOpen, onClose }: PaymentsModalProps) {
  const router = useRouter();
  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  };

  if (!data || !data.payments || data.payments.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Historial de Pagos
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <CreditCard className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No hay pagos registrados</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalPagado = data.payments.reduce((sum, payment) => sum + payment.amountApplied, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-md min-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Historial de Pagos ({data.payments.length} pago{data.payments.length !== 1 ? 's' : ''}
              )
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto p-2">
          <div
            className={cn(
              'grid gap-4',
              data.payments.length === 1
                ? 'grid-cols-1'
                : data.payments.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            )}
          >
            {data.payments.map((payment, index) => (
              <div
                onClick={() => router.push(`/cobranza/pagos/detalle/${payment.paymentId}`)}
                key={payment.paymentId || index}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:cursor-pointer hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Header del Card */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <span className="text-sm font-semibold text-blue-600">
                        #{payment.paymentId}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Pago {index + 1}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={payment.paymentStatus} />
                </div>

                {/* Monto Principal */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monto Total</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(payment.amountApplied, currency)}
                  </p>
                </div>

                {/* Desglose de Montos */}
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Principal:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(payment.amountAppliedToPrincipal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mora:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(payment.amountAppliedToLateFee, currency)}
                    </span>
                  </div>
                </div>

                {/* Información Bancaria */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.banckName || 'No especificado'}
                    </span>
                  </div>

                  {payment.codeOperation && (
                    <div className="text-xs">
                      <span className="text-gray-500">Operación: </span>
                      <span className="font-mono text-gray-900 dark:text-gray-100">
                        {payment.codeOperation}
                      </span>
                    </div>
                  )}

                  {payment.numberTicket && (
                    <div className="text-xs">
                      <span className="text-gray-500">Ticket: </span>
                      <span className="font-mono text-gray-900 dark:text-gray-100">
                        {payment.numberTicket}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs">
                    <CalendarDays className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-500">Pago:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {payment.paymentDate
                        ? format(new Date(payment.paymentDate), 'dd/MM/yyyy HH:mm', { locale: es })
                        : 'No disponible'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-pink-500" />
                    <span className="text-gray-500">Operación:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {payment.dateOperation
                        ? format(new Date(payment.dateOperation), 'dd/MM/yyyy HH:mm', {
                            locale: es
                          })
                        : 'No disponible'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen Final */}
          {data.payments.length > 1 && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    Resumen Total
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(totalPagado, currency)}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {data.payments.length} pagos realizados
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentsModal;
