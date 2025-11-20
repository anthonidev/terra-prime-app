'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Receipt, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CurrencyType } from '../../../types';

interface PaymentSummaryHeaderProps {
  totalAmount: number;
  totalPaid: number;
  pendingAmount: number;
  paymentsCount: number;
  currency: CurrencyType;
  action?: ReactNode;
}

export function PaymentSummaryHeader({
  totalAmount,
  totalPaid,
  pendingAmount,
  paymentsCount,
  currency,
  action,
}: PaymentSummaryHeaderProps) {
  const currencySymbol = currency === 'USD' ? '$' : 'S/';
  const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Receipt className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Resumen de Pagos</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  {paymentsCount} {paymentsCount === 1 ? 'pago registrado' : 'pagos registrados'}
                </p>
              </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso de Pago</span>
              <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="from-primary h-full rounded-full bg-gradient-to-r to-green-600"
              />
            </div>
          </div>

          <Separator />

          {/* Payment Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="from-primary/5 border-primary/20 rounded-lg border bg-gradient-to-br to-transparent p-4"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="text-primary mt-1 h-4 w-4" />
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Monto Total</p>
                  <p className="text-lg font-bold">
                    {currencySymbol} {totalAmount.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Total Paid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent p-4"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Total Pagado</p>
                  <p className="text-lg font-bold text-green-600">
                    {currencySymbol} {totalPaid.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pending Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent p-4"
            >
              <div className="flex items-start gap-2">
                <Clock className="mt-1 h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Monto Pendiente</p>
                  <p className="text-lg font-bold text-orange-600">
                    {currencySymbol} {pendingAmount.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
