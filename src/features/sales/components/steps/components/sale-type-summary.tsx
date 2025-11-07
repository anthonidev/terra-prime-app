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
      <Card className={cn(
        'border transition-all',
        isReservation ? 'border-primary/30 bg-primary/5' : 'bg-muted/30 border-muted'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
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
                    className="flex items-center justify-between py-1.5 px-2 rounded-md bg-background/50 hover:bg-background transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.label}:</span>
                    </div>
                    {item.badge ? (
                      <Badge variant="secondary" className="text-xs font-semibold h-5">
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-xs font-semibold text-foreground">{item.value}</span>
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
              className="mt-3 p-2.5 rounded-md bg-accent/10 border border-accent/20"
            >
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Nota:</span> El cliente debe pagar{' '}
                <span className="font-semibold text-accent">
                  {formatCurrency(reservationAmount, currencyType)}
                </span>{' '}
                para reservar el lote por{' '}
                <span className="font-semibold text-accent">{maximumHoldPeriod} días</span>.
                Este monto será parte del pago total del lote.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
