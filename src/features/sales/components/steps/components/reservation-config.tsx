'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Coins, Clock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/lib/utils';
import type { Step2FormData } from '../../../lib/validation';

interface ReservationConfigProps {
  form: UseFormReturn<Step2FormData>;
  isReservation: boolean;
  onReservationToggle: (checked: boolean) => void;
}

export function ReservationConfig({
  form,
  isReservation,
  onReservationToggle,
}: ReservationConfigProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                isReservation ? 'bg-primary/10' : 'bg-muted'
              )}
            >
              <CalendarClock
                className={cn(
                  'h-5 w-5 transition-colors',
                  isReservation ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </div>
            <div>
              <CardTitle>Configuración de Reserva</CardTitle>
              <CardDescription>
                Active si el cliente está separando el lote antes de la venta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Checkbox Toggle */}
          <div
            className={cn(
              'flex items-start space-x-3 rounded-lg border p-4 transition-all',
              isReservation
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-accent/5'
            )}
          >
            <Checkbox
              id="isReservation"
              checked={isReservation}
              onCheckedChange={onReservationToggle}
              className="mt-1"
            />
            <div className="flex-1">
              <Label
                htmlFor="isReservation"
                className="flex cursor-pointer items-center gap-2 text-sm leading-none font-semibold"
              >
                Este lote se está separando (reserva)
                {isReservation && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary/20 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    Activo
                  </motion.span>
                )}
              </Label>
              <p className="text-muted-foreground mt-1.5 text-xs">
                Activar para registrar un monto de separación y periodo de espera antes de la venta
                final
              </p>
            </div>
          </div>

          {/* Reservation Fields */}
          <AnimatePresence>
            {isReservation && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                  {/* Reservation Amount */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="reservationAmount"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Coins className="text-primary h-4 w-4" />
                      Monto de Separación
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reservationAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...form.register('reservationAmount', { valueAsNumber: true })}
                        className={cn(
                          'pl-9 transition-all',
                          form.formState.errors.reservationAmount &&
                            'border-destructive focus-visible:ring-destructive'
                        )}
                        onKeyDown={(e) => {
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
                        }}
                      />
                      <div className="text-muted-foreground absolute top-0 left-0 flex h-full w-9 items-center justify-center border-r">
                        <Coins className="h-4 w-4" />
                      </div>
                    </div>
                    {form.formState.errors.reservationAmount && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-xs"
                      >
                        {form.formState.errors.reservationAmount.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Maximum Hold Period */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="maximumHoldPeriod"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Clock className="text-primary h-4 w-4" />
                      Periodo de Separación (días)
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="maximumHoldPeriod"
                        type="number"
                        placeholder="15"
                        {...form.register('maximumHoldPeriod', { valueAsNumber: true })}
                        className={cn(
                          'pl-9 transition-all',
                          form.formState.errors.maximumHoldPeriod &&
                            'border-destructive focus-visible:ring-destructive'
                        )}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              'Backspace',
                              'Delete',
                              'Tab',
                              'Enter',
                              'ArrowLeft',
                              'ArrowRight',
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <div className="text-muted-foreground absolute top-0 left-0 flex h-full w-9 items-center justify-center border-r">
                        <Clock className="h-4 w-4" />
                      </div>
                    </div>
                    {form.formState.errors.maximumHoldPeriod && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-xs"
                      >
                        {form.formState.errors.maximumHoldPeriod.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
