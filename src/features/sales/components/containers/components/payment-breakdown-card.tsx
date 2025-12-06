'use client';

import { motion } from 'framer-motion';
import { Banknote, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { SaleDetail } from '../../../types';

interface PaymentBreakdownCardProps {
  sale: SaleDetail;
}

export function PaymentBreakdownCard({ sale }: PaymentBreakdownCardProps) {
  const hasReservation = (sale.reservationAmount || 0) > 0;
  const hasInitial = (sale.initialToPay || 0) > 0 || (sale.initialAmountPaid || 0) > 0;

  if (!hasReservation && !hasInitial) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Wallet className="text-primary h-5 w-5" />
            </div>
            <CardTitle>Desglose de Pagos Iniciales</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Reservation Section */}
          {hasReservation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Banknote className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Reserva</h3>
              </div>

              <div className="bg-muted/30 grid gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Monto Total</span>
                  <span className="font-semibold">
                    {formatCurrency(sale.reservationAmount || 0, sale.currency)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-muted-foreground text-sm">Pagado</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(sale.reservationAmountPaid || 0, sale.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-muted-foreground text-sm">Pendiente</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(
                      (sale.reservationAmount || 0) - (sale.reservationAmountPaid || 0),
                      sale.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Initial Payment Section */}
          {hasInitial && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold">Inicial</h3>
              </div>

              <div className="bg-muted/30 grid gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Monto Total</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      (sale.initialToPay || 0) + (sale.initialAmountPaid || 0),
                      sale.currency
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-muted-foreground text-sm">Pagado</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(sale.initialAmountPaid || 0, sale.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-muted-foreground text-sm">Pendiente</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(sale.initialToPay || 0, sale.currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
