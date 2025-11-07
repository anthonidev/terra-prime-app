'use client';

import { motion } from 'framer-motion';
import { Home, Hash, Calendar, Info } from 'lucide-react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { Step3DirectPaymentFormData, Step3FinancedFormData } from '../../../lib/validation';

interface UrbanizationConfigProps {
  form: UseFormReturn<Step3DirectPaymentFormData> | UseFormReturn<Step3FinancedFormData>;
  urbanizationPrice: number;
  currency: 'USD' | 'PEN';
}

export function UrbanizationConfig({ form, urbanizationPrice, currency }: UrbanizationConfigProps) {
  const currencyType = currency === 'USD' ? 'USD' : 'PEN';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Home className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Habilitación Urbana
                <span className="text-sm font-normal text-muted-foreground">
                  ({formatCurrency(urbanizationPrice, currencyType)})
                </span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Monto de Habilitación Urbana (readonly) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <Label
              htmlFor="totalAmountUrbanDevelopment"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Home className="h-4 w-4 text-accent" />
              Monto de Habilitación Urbana
            </Label>
            <Input
              id="totalAmountUrbanDevelopment"
              type="text"
              value={formatCurrency(urbanizationPrice, currencyType)}
              readOnly
              disabled
              className="bg-muted font-semibold text-accent cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Monto de habilitación urbana (no editable)
            </p>
          </motion.div>

          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20"
          >
            <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure los términos de pago para la habilitación urbana. Este monto será pagado en cuotas
              separadas del pago del lote.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cantidad de Cuotas HU */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label
                htmlFor="quantityHuCuotes"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Hash className="h-4 w-4 text-accent" />
                Cantidad de Cuotas HU
              </Label>
              <div className="relative">
                <Input
                  id="quantityHuCuotes"
                  type="number"
                  placeholder="Ej: 12"
                  {...(form.register as any)('quantityHuCuotes', { valueAsNumber: true })}
                  className={cn(
                    'pl-9 transition-all',
                    form.formState.errors.quantityHuCuotes && 'border-destructive'
                  )}
                />
                <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {form.formState.errors.quantityHuCuotes && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  {form.formState.errors.quantityHuCuotes.message as string}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground">
                Número de cuotas mensuales para habilitación urbana
              </p>
            </motion.div>

            {/* Fecha Primera Cuota HU */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label
                htmlFor="firstPaymentDateHu"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 text-accent" />
                Fecha Primera Cuota HU
              </Label>
              <div className="relative">
                <Input
                  id="firstPaymentDateHu"
                  type="date"
                  {...(form.register as any)('firstPaymentDateHu')}
                  className={cn(
                    'pl-9 transition-all',
                    form.formState.errors.firstPaymentDateHu && 'border-destructive'
                  )}
                />
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {form.formState.errors.firstPaymentDateHu && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  {form.formState.errors.firstPaymentDateHu.message as string}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground">
                Fecha del primer pago de habilitación urbana
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
