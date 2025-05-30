'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { SaleResponse } from '@/types/sales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, DollarSign, Percent } from 'lucide-react';

interface SaleFinancingInfoProps {
  sale: SaleResponse;
}

export default function SaleFinancingInfo({ sale }: SaleFinancingInfoProps) {
  if (!sale.financing) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy', { locale: es });
  };

  // Mock installments data - replace with actual data structure
  const mockInstallments = Array.from({ length: sale.financing.quantityCoutes }, (_, index) => ({
    id: `installment-${index + 1}`,
    number: index + 1,
    amount: sale.financing.initialAmount / sale.financing.quantityCoutes,
    dueDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: index < 2 ? 'paid' : index === 2 ? 'pending' : 'upcoming',
    paidDate:
      index < 2 ? new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000).toISOString() : null
  }));

  const getInstallmentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
            Pagado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
            Pendiente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
            Vencido
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="border-gray-200 bg-gray-100 text-gray-700">
            Próximo
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Financing Summary */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Información de financiamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Monto inicial</span>
              </div>
              <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(sale.financing.initialAmount)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Tasa de interés</span>
              </div>
              <p className="mt-1 text-xl font-bold text-purple-700 dark:text-purple-300">
                {sale.financing.interestRate}%
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Cuotas</span>
              </div>
              <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-300">
                {sale.financing.quantityCoutes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installments Table */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              Cronograma de pagos
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {mockInstallments.filter((i) => i.status === 'paid').length} de{' '}
                {mockInstallments.length} pagadas
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="w-16">Cuota</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha vencimiento</TableHead>
                  <TableHead>Fecha de pago</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInstallments.map((installment) => (
                  <TableRow
                    key={installment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">#{installment.number}</TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(installment.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(installment.dueDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {installment.paidDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>{formatDate(installment.paidDate)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getInstallmentStatusBadge(installment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
