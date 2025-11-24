'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CalendarClock, Clock, TrendingUp, Banknote, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { SaleType } from '../../../types';

interface SaleTypeSummaryProps {
  saleType: SaleType;
  isReservation: boolean;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  projectCurrency?: string;
}

export function SaleTypeSummary({
  saleType,
  isReservation,
  reservationAmount,
  maximumHoldPeriod,
  projectCurrency = 'PEN',
}: SaleTypeSummaryProps) {
  const currencyType = projectCurrency === 'USD' ? 'USD' : 'PEN';
  const saleTypeLabel = saleType === SaleType.DIRECT_PAYMENT ? 'Pago Directo' : 'Financiado';
  const SaleTypeIcon = saleType === SaleType.DIRECT_PAYMENT ? Banknote : TrendingUp;

  const items = [
    {
      icon: SaleTypeIcon,
      label: 'Tipo de venta',
      value: saleTypeLabel,
      show: true,
    },
    {
      icon: CalendarClock,
      label: 'Estado',
      value: 'Separación',
      show: isReservation,
      badge: true,
    },
    {
      icon: Coins,
      label: 'Monto de separación',
      value: reservationAmount ? formatCurrency(reservationAmount, currencyType) : '-',
      show: isReservation && !!reservationAmount,
    },
    {
      icon: Clock,
      label: 'Periodo de reserva',
      value: maximumHoldPeriod ? `${maximumHoldPeriod} días` : '-',
      show: isReservation && !!maximumHoldPeriod,
    },
  ].filter((item) => item.show);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">Resumen de Configuración</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-muted/30 flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <Badge variant="secondary" className="font-medium">
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="font-medium">{item.value}</span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Additional Info */}
          {isReservation && reservationAmount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-accent/5 border-accent/20 mt-4 rounded-lg border p-3"
            >
              <p className="text-muted-foreground text-xs leading-relaxed">
                <span className="text-foreground font-medium">Nota:</span> El cliente debe pagar{' '}
                <span className="text-foreground font-medium">
                  {formatCurrency(reservationAmount, currencyType)}
                </span>{' '}
                para reservar el lote por{' '}
                <span className="text-foreground font-medium">{maximumHoldPeriod} días</span>. Este
                monto será parte del pago total del lote.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
