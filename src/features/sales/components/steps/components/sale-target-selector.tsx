'use client';

import { motion } from 'framer-motion';
import { LandPlot, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface SaleTargetSelectorProps {
  value: 'lot' | 'parking';
  onChange: (value: 'lot' | 'parking') => void;
}

const targetOptions = [
  {
    value: 'lot' as const,
    title: 'Lote',
    description: 'Seleccionar un lote del proyecto para la venta',
    icon: LandPlot,
  },
  {
    value: 'parking' as const,
    title: 'Cochera',
    description: 'Seleccionar una cochera del proyecto para la venta',
    icon: Car,
  },
];

export function SaleTargetSelector({ value, onChange }: SaleTargetSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Producto</CardTitle>
          <CardDescription>Seleccione qué tipo de producto desea vender</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {targetOptions.map((option, index) => {
              const isSelected = value === option.value;
              const Icon = option.icon;

              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onChange(option.value)}
                  className={cn(
                    'relative flex cursor-pointer rounded-lg border-2 p-5 transition-all',
                    'hover:border-primary/50 hover:bg-accent/5',
                    isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-sale-target"
                      className="bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="h-2 w-2 rounded-full bg-white"
                      />
                    </motion.div>
                  )}

                  <div className="flex w-full items-start gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
                        isSelected ? 'bg-primary/20' : 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6 transition-colors',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-1 text-base font-semibold">{option.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {option.description}
                      </p>
                    </div>
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
