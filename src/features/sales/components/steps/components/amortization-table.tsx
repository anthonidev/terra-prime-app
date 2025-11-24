'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table as TableIcon, Receipt, Home, Coins } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { AmortizationResponse } from '../../../types';

interface AmortizationTableProps {
  amortization: AmortizationResponse | undefined;
  isCalculating: boolean;
  hasUrbanization: boolean;
  currency: 'USD' | 'PEN';
}

export function AmortizationTable({
  amortization,
  isCalculating,
  hasUrbanization,
  currency,
}: AmortizationTableProps) {
  const currencyType = currency === 'USD' ? 'USD' : 'PEN';

  if (!amortization && !isCalculating) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <TableIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Tabla de Amortización</CardTitle>
              <CardDescription>Cronograma detallado de pagos mensuales</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isCalculating ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : amortization && amortization.installments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">N° Cuota</TableHead>
                      <TableHead>Cuota Lote</TableHead>
                      {hasUrbanization && <TableHead>Cuota HU</TableHead>}
                      <TableHead className="font-semibold">Total Cuota</TableHead>
                      <TableHead>Fecha de Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortization.installments.map((installment, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            #{installment.lotInstallmentNumber}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(installment.lotInstallmentAmount, currencyType)}
                        </TableCell>
                        {hasUrbanization && (
                          <TableCell className="font-medium">
                            {formatCurrency(installment.huInstallmentAmount, currencyType)}
                          </TableCell>
                        )}
                        <TableCell className="text-primary font-bold">
                          {formatCurrency(installment.totalInstallmentAmount, currencyType)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(installment.expectedPaymentDate), 'dd/MM/yyyy', {
                            locale: es,
                          })}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/30 mt-6 rounded-lg p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Coins className="text-primary h-5 w-5" />
                  <h4 className="text-base font-semibold">Resumen de Financiamiento</h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Total Lote */}
                  <div className="bg-background rounded-lg border p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Receipt className="text-primary h-4 w-4" />
                      <p className="text-muted-foreground text-sm font-medium">Total Lote</p>
                    </div>
                    <p className="text-foreground text-2xl font-bold">
                      {formatCurrency(amortization.meta.lotTotalAmount, currencyType)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {amortization.meta.lotInstallmentsCount} cuotas
                    </p>
                  </div>

                  {/* Total HU */}
                  {hasUrbanization && amortization.meta.huInstallmentsCount > 0 && (
                    <div className="bg-background rounded-lg border p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <Home className="text-primary h-4 w-4" />
                        <p className="text-muted-foreground text-sm font-medium">Total HU</p>
                      </div>
                      <p className="text-foreground text-2xl font-bold">
                        {formatCurrency(amortization.meta.huTotalAmount, currencyType)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {amortization.meta.huInstallmentsCount} cuotas
                      </p>
                    </div>
                  )}

                  {/* Total General */}
                  <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Coins className="text-primary h-4 w-4" />
                      <p className="text-primary text-sm font-bold">Total General</p>
                    </div>
                    <p className="text-primary text-2xl font-bold">
                      {formatCurrency(amortization.meta.totalAmount, currencyType)}
                    </p>
                    <p className="text-primary/70 mt-1 text-xs font-medium">
                      {amortization.meta.totalInstallmentsCount} cuotas totales
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TableIcon className="text-muted-foreground/50 mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Complete los datos y genere la tabla para ver el cronograma de pagos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
