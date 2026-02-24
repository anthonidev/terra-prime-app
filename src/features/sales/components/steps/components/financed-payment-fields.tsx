'use client';

import { motion } from 'framer-motion';
import { Wallet, Calendar, Hash, Receipt, Lock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { Step3FinancedFormData } from '../../../lib/validation';

interface FinancedPaymentFieldsProps {
  form: UseFormReturn<Step3FinancedFormData>;
  lotPrice: number;
  currency: 'USD' | 'PEN';
  isLocked?: boolean;
}

export function FinancedPaymentFields({
  form,
  lotPrice,
  currency,
  isLocked = false,
}: FinancedPaymentFieldsProps) {
  const currencyType = currency === 'USD' ? 'USD' : 'PEN';

  const fields = [
    {
      id: 'initialAmount',
      label: 'Cuota Inicial',
      icon: Wallet,
      type: 'number',
      step: '0.01',
      min: '0.01',
      placeholder: 'Ej: 5000.00',
      description: 'Monto inicial que el cliente pagará (debe ser mayor a 0)',
      required: true,
    },
    {
      id: 'quantitySaleCoutes',
      label: 'Cantidad de Cuotas',
      icon: Hash,
      type: 'number',
      min: '1',
      placeholder: 'Ej: 12',
      description: 'Número de cuotas mensuales para el pago',
      required: true,
    },
    {
      id: 'firstPaymentDate',
      label: 'Fecha Primera Cuota',
      icon: Calendar,
      type: 'date',
      description: 'Fecha del primer pago mensual',
      required: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Wallet className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>Configuración de Financiamiento</CardTitle>
                {isLocked && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Bloqueado
                  </Badge>
                )}
              </div>
              <CardDescription>
                {isLocked
                  ? 'Campos bloqueados - Tabla de amortización generada'
                  : 'Configure los términos de pago para el financiamiento del lote'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Monto Total del Lote (readonly) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="totalAmount" className="flex items-center gap-2 text-sm font-medium">
              <Receipt className="text-primary h-4 w-4" />
              Monto Total del Lote
            </Label>
            <Input
              id="totalAmount"
              type="text"
              value={formatCurrency(lotPrice, currencyType)}
              readOnly
              disabled
              className="bg-muted text-primary cursor-not-allowed font-semibold"
            />
            <p className="text-muted-foreground text-xs">
              Precio del lote a financiar (no editable)
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map((field, index) => {
              const Icon = field.icon;
              const error = form.formState.errors[field.id as keyof Step3FinancedFormData];

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="text-primary h-4 w-4" />
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.id}
                      type={field.type}
                      step={field.step}
                      min={field.min}
                      placeholder={field.placeholder}
                      disabled={isLocked}
                      {...form.register(field.id as keyof Step3FinancedFormData, {
                        valueAsNumber: field.type === 'number',
                      })}
                      className={cn(
                        'pl-9 transition-all',
                        error && 'border-destructive focus-visible:ring-destructive',
                        isLocked && 'bg-muted cursor-not-allowed'
                      )}
                      onKeyDown={(e) => {
                        if (field.type === 'number') {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              'Backspace',
                              'Delete',
                              'Tab',
                              'Enter',
                              'ArrowLeft',
                              'ArrowRight',
                              '.',
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }
                      }}
                    />
                    <Icon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-xs"
                    >
                      {error.message as string}
                    </motion.p>
                  )}
                  <p className="text-muted-foreground text-xs">{field.description}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
