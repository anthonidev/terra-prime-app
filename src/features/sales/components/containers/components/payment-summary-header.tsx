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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Resumen de Pagos</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
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
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-green-600 rounded-full"
              />
            </div>
          </div>

          <Separator />

          {/* Payment Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monto Total</p>
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
              className="p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Pagado</p>
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
              className="p-4 rounded-lg bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20"
            >
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-600 mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monto Pendiente</p>
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
