'use client';

import { motion } from 'framer-motion';
import { Receipt, Home, Ruler } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { ProjectLotResponse } from '../../../types';

interface LotPaymentInfoProps {
  selectedLot: ProjectLotResponse;
  lotPrice: number;
  urbanizationPrice: number;
  hasUrbanization: boolean;
}

export function LotPaymentInfo({ selectedLot, lotPrice, urbanizationPrice, hasUrbanization }: LotPaymentInfoProps) {
  const currencyType = selectedLot.projectCurrency === 'USD' ? 'USD' : 'PEN';

  const infoItems = [
    {
      icon: Receipt,
      label: 'Precio del Lote',
      value: formatCurrency(lotPrice, currencyType),
      show: true,
      highlight: true,
    },
    {
      icon: Home,
      label: 'Habilitación Urbana',
      value: formatCurrency(urbanizationPrice, currencyType),
      show: hasUrbanization,
      highlight: true,
    },
    {
      icon: Ruler,
      label: 'Área',
      value: `${selectedLot.area} m²`,
      show: true,
    },
  ].filter((item) => item.show);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Resumen del Lote</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-border"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p
                      className={`text-sm font-bold truncate ${
                        item.highlight ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
