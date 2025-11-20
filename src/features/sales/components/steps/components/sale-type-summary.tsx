'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CalendarClock, Clock, TrendingUp, Banknote, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { cn } from '@/shared/lib/utils';
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
      <Card
        className={cn(
          'border transition-all',
          isReservation ? 'border-primary/30 bg-primary/5' : 'bg-muted/30 border-muted'
        )}
      >
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="text-primary h-4 w-4" />
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Resumen de Configuración
            </h3>
          </div>

          <div className="space-y-2">
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
                    className="bg-background/50 hover:bg-background flex items-center justify-between rounded-md px-2 py-1.5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
                        <Icon className="text-primary h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground text-xs">{item.label}:</span>
                    </div>
                    {item.badge ? (
                      <Badge variant="secondary" className="h-5 text-xs font-semibold">
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-foreground text-xs font-semibold">{item.value}</span>
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
              className="bg-accent/10 border-accent/20 mt-3 rounded-md border p-2.5"
            >
              <p className="text-muted-foreground text-[10px] leading-relaxed">
                <span className="text-foreground font-semibold">Nota:</span> El cliente debe pagar{' '}
                <span className="text-accent font-semibold">
                  {formatCurrency(reservationAmount, currencyType)}
                </span>{' '}
                para reservar el lote por{' '}
                <span className="text-accent font-semibold">{maximumHoldPeriod} días</span>. Este
                monto será parte del pago total del lote.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
