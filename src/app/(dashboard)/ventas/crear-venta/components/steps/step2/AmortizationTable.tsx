'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { Calculator } from 'lucide-react';

import { Amortization } from '@domain/entities/sales/amortization.entity';

interface AmortizationTableProps {
  installments: Amortization[];
  visible: boolean;
}

export default function AmortizationTable({ installments, visible }: AmortizationTableProps) {
  if (!visible || installments.length === 0) {
    return null;
  }

  const totalAmount = installments.reduce((sum, item) => sum + item.couteAmount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cronograma de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuota</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((installment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {format(new Date(installment.expectedPaymentDate), 'dd/MM/yyyy', {
                      locale: es
                    })}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    S/ {installment.couteAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total de cuotas: {installments.length}
          </span>
          <span className="text-lg font-bold">Total a pagar: S/ {totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
