'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Building2, Layers, Grid3x3, MapPin, Ruler, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { ProjectLotResponse } from '../../../types';

interface SelectedLotSummaryProps {
  projectName: string;
  stageName: string;
  blockName: string;
  selectedLot: ProjectLotResponse;
  projectCurrency: string;
}

// Map project currency to format
const getCurrencyType = (currency: string): 'PEN' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'PEN';
};

export function SelectedLotSummary({
  projectName,
  stageName,
  blockName,
  selectedLot,
  projectCurrency,
}: SelectedLotSummaryProps) {
  const currencyType = getCurrencyType(projectCurrency);

  const lotPrice =
    typeof selectedLot.lotPrice === 'string'
      ? parseFloat(selectedLot.lotPrice)
      : selectedLot.lotPrice;

  const urbanPrice =
    typeof selectedLot.urbanizationPrice === 'string'
      ? parseFloat(selectedLot.urbanizationPrice)
      : selectedLot.urbanizationPrice;

  const totalPrice =
    typeof selectedLot.totalPrice === 'string'
      ? parseFloat(selectedLot.totalPrice)
      : selectedLot.totalPrice;

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
              <CardTitle className="text-xl">Lote Seleccionado</CardTitle>
              <p className="text-muted-foreground text-sm">Resumen de la selección realizada</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

            {/* Stage Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Layers className="h-3.5 w-3.5" />
                <span>Etapa</span>
              </div>
              <p className="text-foreground font-semibold">{stageName}</p>
            </motion.div>

            {/* Block Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Grid3x3 className="h-3.5 w-3.5" />
                <span>Manzana</span>
              </div>
              <p className="text-foreground font-semibold">{blockName}</p>
            </motion.div>

            {/* Lot Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5" />
                <span>Lote</span>
              </div>
              <p className="text-foreground font-semibold">{selectedLot.name}</p>
            </motion.div>

            {/* Area Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Ruler className="h-3.5 w-3.5" />
                <span>Área</span>
              </div>
              <p className="text-foreground font-semibold">{selectedLot.area} m²</p>
            </motion.div>

            {/* Total Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-1"
            >
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <DollarSign className="h-3.5 w-3.5" />
                <span>Precio Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm font-bold">
                  {formatCurrency(totalPrice, currencyType)}
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Price Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-border/50 mt-4 border-t pt-4"
          >
            <p className="text-muted-foreground mb-2 text-xs font-medium">Desglose de precios</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Precio del Lote:</span>
                <span className="font-medium">{formatCurrency(lotPrice, currencyType)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Habilitación Urbana:</span>
                <span className="font-medium">{formatCurrency(urbanPrice, currencyType)}</span>
              </div>
              <div className="border-border/50 flex items-center justify-between border-t pt-1.5">
                <span className="text-foreground font-semibold">Total:</span>
                <span className="text-primary text-base font-bold">
                  {formatCurrency(totalPrice, currencyType)}
                </span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
