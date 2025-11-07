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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
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
                className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Monto de Separación</p>
                  <p className="font-semibold text-primary">
                    S/ {reservationAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Periodo Máximo</p>
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
