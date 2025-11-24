'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Banknote, DollarSign, TrendingUp } from 'lucide-react';
import { SaleType } from '../../../types';

interface SaleTypeSelectorProps {
  saleType: SaleType;
  onSaleTypeChange: (type: SaleType) => void;
  error?: string;
}

const saleTypeOptions = [
  {
    type: SaleType.DIRECT_PAYMENT,
    title: 'Pago Directo',
    description: 'El cliente pagará el monto total del lote en un solo pago o en pocas cuotas',
    icon: Banknote,
    features: ['Pago único o pocas cuotas', 'Sin intereses', 'Proceso rápido'],
  },
  {
    type: SaleType.FINANCED,
    title: 'Financiado',
    description: 'El cliente pagará una cuota inicial y el resto en cuotas mensuales con interés',
    icon: TrendingUp,
    features: ['Cuota inicial configurable', 'Cuotas mensuales', 'Con tasa de interés'],
  },
];

export function SaleTypeSelector({ saleType, onSaleTypeChange, error }: SaleTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <DollarSign className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Tipo de Venta</CardTitle>
              <CardDescription>
                Seleccione cómo el cliente realizará el pago del lote
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-base font-medium">Método de Pago</Label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {saleTypeOptions.map((option, index) => {
              const isSelected = saleType === option.type;
              const Icon = option.icon;

              return (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSaleTypeChange(option.type)}
                  className={cn(
                    'relative flex cursor-pointer rounded-lg border-2 p-5 transition-all',
                    'hover:border-primary/50 hover:bg-accent/5',
                    isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted'
                  )}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="selected-sale-type"
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

                  <div className="flex w-full flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
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

                    {/* Features */}
                    <div className="mt-2 space-y-1.5 pl-15">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSelected ? 'bg-primary' : 'bg-muted-foreground/50'
                            )}
                          />
                          <span
                            className={cn(
                              'transition-colors',
                              isSelected ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
            >
              {error}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
