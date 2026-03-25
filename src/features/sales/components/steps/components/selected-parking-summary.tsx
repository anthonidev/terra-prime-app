'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Building2, Car, Ruler, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { AvailableParkingForSale } from '../../../types';

interface SelectedParkingSummaryProps {
  projectName: string;
  selectedParking: AvailableParkingForSale;
  projectCurrency: string;
}

const getCurrencyType = (currency: string): 'PEN' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'PEN';
};

export function SelectedParkingSummary({
  projectName,
  selectedParking,
  projectCurrency,
}: SelectedParkingSummaryProps) {
  const currencyType = getCurrencyType(projectCurrency);
  const price = parseFloat(selectedParking.price);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Card className="bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full"
            >
              <CheckCircle2 className="text-primary h-6 w-6" />
            </motion.div>
            <div>
              <CardTitle className="text-xl">Cochera Seleccionada</CardTitle>
              <p className="text-muted-foreground text-sm">Resumen de la selección realizada</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Building2 className="h-3.5 w-3.5" />
                <span>Proyecto</span>
              </div>
              <p className="text-foreground font-semibold">{projectName}</p>
            </motion.div>

            {/* Parking Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Car className="h-3.5 w-3.5" />
                <span>Cochera</span>
              </div>
              <p className="text-foreground font-semibold">{selectedParking.name}</p>
            </motion.div>

            {/* Area Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Ruler className="h-3.5 w-3.5" />
                <span>Área</span>
              </div>
              <p className="text-foreground font-semibold">{selectedParking.area} m²</p>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <DollarSign className="h-3.5 w-3.5" />
                <span>Precio</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm font-bold">
                  {formatCurrency(price, currencyType)}
                </Badge>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
