'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SaleType } from '../../../types';

interface SaleTypeSummaryCardProps {
  saleType: SaleType;
  saleTypeLabel: string;
  isReservation: boolean;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
}

export function SaleTypeSummaryCard({
  saleType,
  saleTypeLabel,
  isReservation,
  reservationAmount,
  maximumHoldPeriod,
}: SaleTypeSummaryCardProps) {
  const isFinanced = saleType === SaleType.FINANCED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <FileText className="text-primary h-5 w-5" />
            </div>
            Tipo de Venta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sale Type Badges */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-4"
            >
              <Badge variant={isFinanced ? 'default' : 'secondary'} className="text-sm">
                {saleTypeLabel}
              </Badge>
              {isReservation && (
                <Badge variant="outline" className="text-sm">
                  Separación
                </Badge>
              )}
            </motion.div>

            {/* Reservation Details */}
            {isReservation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="from-primary/5 border-primary/20 grid grid-cols-2 gap-4 rounded-lg border bg-gradient-to-br to-transparent p-4"
              >
                <div>
                  <p className="text-muted-foreground text-sm">Monto de Separación</p>
                  <p className="text-primary font-semibold">
                    S/ {reservationAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Periodo Máximo</p>
                  <p className="font-semibold">{maximumHoldPeriod} días</p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
