'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib/utils';
import type { Step4FormData } from '../../../lib/validation';

interface ClientAddressInputProps {
  form: UseFormReturn<Step4FormData>;
  show: boolean;
}

export function ClientAddressInput({ form, show }: ClientAddressInputProps) {
  if (!show) return null;

  const error = form.formState.errors.clientAddress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Dirección del Cliente</CardTitle>
              <CardDescription>
                Complete la dirección completa del domicilio del cliente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="clientAddress" className="text-sm font-medium">
              Dirección <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="clientAddress"
                placeholder="Ej: Av. Principal 123, Distrito, Ciudad"
                {...form.register('clientAddress')}
                className={cn(
                  'pl-9 transition-all',
                  error && 'border-destructive'
                )}
              />
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive flex items-center gap-1"
              >
                {error.message}
              </motion.p>
            )}
            <p className="text-xs text-muted-foreground">
              Ingrese la dirección completa del cliente para la documentación
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
