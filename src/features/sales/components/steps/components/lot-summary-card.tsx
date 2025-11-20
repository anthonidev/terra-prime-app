'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { ProjectLotResponse } from '../../../types';

interface LotSummaryCardProps {
  selectedLot: ProjectLotResponse;
  currencyType: 'USD' | 'PEN';
}

export function LotSummaryCard({ selectedLot, currencyType }: LotSummaryCardProps) {
  const lotInfo = [
    { label: 'Proyecto', value: selectedLot.projectName },
    { label: 'Etapa', value: selectedLot.stageName },
    { label: 'Manzana', value: selectedLot.blockName },
    { label: 'Lote', value: selectedLot.name },
    { label: 'Área', value: `${selectedLot.area} m²` },
  ];

  const priceInfo = [
    {
      label: 'Precio Lote',
      value: formatCurrency(parseFloat(selectedLot.lotPrice), currencyType),
      highlight: false,
    },
    {
      label: 'Precio Habilitación Urbana',
      value: formatCurrency(parseFloat(selectedLot.urbanizationPrice), currencyType),
      highlight: false,
    },
    {
      label: 'Precio Total',
      value: formatCurrency(selectedLot.totalPrice, currencyType),
      highlight: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            Detalles del Proyecto y Lote
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Lot Information */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {lotInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <p className="text-muted-foreground text-sm">{info.label}</p>
                <p className="font-medium">{info.value}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-muted-foreground text-sm">Estado</p>
              <Badge variant="outline">{selectedLot.status}</Badge>
            </motion.div>
          </div>

          <Separator className="my-4" />

          {/* Price Information */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {priceInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <p className="text-muted-foreground text-sm">{info.label}</p>
                <p
                  className={
                    info.highlight ? 'text-primary text-lg font-semibold' : 'font-semibold'
                  }
                >
                  {info.value}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
