'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { formatCurrency } from '@/shared/lib/utils';
import { installmentStatusConfig } from '../shared/status-config';
import type { FinancingDetailInstallment, StatusFinancingInstallments } from '../../types';

interface InstallmentsTableProps {
  installments: FinancingDetailInstallment[];
}

export function InstallmentsTable({ installments }: InstallmentsTableProps) {
  const columns: ColumnDef<FinancingDetailInstallment>[] = [
    {
      accessorKey: 'numberCuote',
      header: 'N° Cuota',
      cell: ({ row }) => (
        <span className="font-mono font-medium">#{row.getValue('numberCuote')}</span>
      ),
    },
    {
      accessorKey: 'expectedPaymentDate',
      header: 'Fecha de Vencimiento',
      cell: ({ row }) => {
        const date = new Date(row.getValue('expectedPaymentDate'));
        return format(date, 'dd MMM yyyy', { locale: es });
      },
    },
    {
      accessorKey: 'couteAmount',
      header: 'Monto de Cuota',
      cell: ({ row }) => {
        const amount = row.getValue('couteAmount') as number;
        return <span className="font-medium">{formatCurrency(amount)}</span>;
      },
    },
    {
      accessorKey: 'coutePaid',
      header: 'Monto Pagado',
      cell: ({ row }) => {
        const amount = row.getValue('coutePaid') as number;
        return (
          <span className={amount > 0 ? 'font-medium text-green-600' : 'text-muted-foreground'}>
            {formatCurrency(amount)}
          </span>
        );
      },
    },
    {
      accessorKey: 'coutePending',
      header: 'Monto Pendiente',
      cell: ({ row }) => {
        const amount = row.getValue('coutePending') as number;
        return (
          <span className={amount > 0 ? 'font-medium text-orange-600' : 'text-muted-foreground'}>
            {formatCurrency(amount)}
          </span>
        );
      },
    },
    {
      accessorKey: 'lateFeeAmount',
      header: 'Mora',
      cell: ({ row }) => {
        const amount = row.getValue('lateFeeAmount') as number;
        if (amount === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return <span className="font-medium text-red-600">{formatCurrency(amount)}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as StatusFinancingInstallments;
        const config = installmentStatusConfig[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
  ];

  // Calculate totals
  const totals = installments.reduce(
    (acc, inst) => ({
      total: acc.total + inst.couteAmount,
      paid: acc.paid + inst.coutePaid,
      pending: acc.pending + inst.coutePending,
      lateFees: acc.lateFees + inst.lateFeeAmount,
    }),
    { total: 0, paid: 0, pending: 0, lateFees: 0 }
  );

  // Count by status
  const statusCounts = installments.reduce(
    (acc, inst) => {
      acc[inst.status] = (acc[inst.status] || 0) + 1;
      return acc;
    },
    {} as Record<StatusFinancingInstallments, number>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Cronograma de Cuotas</CardTitle>
          <div className="flex flex-wrap gap-2">
            {statusCounts.PAID && <Badge variant="default">Pagadas: {statusCounts.PAID}</Badge>}
            {statusCounts.PENDING && (
              <Badge variant="outline">Pendientes: {statusCounts.PENDING}</Badge>
            )}
            {statusCounts.EXPIRED && (
              <Badge variant="destructive">Vencidas: {statusCounts.EXPIRED}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-4 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-sm">Total Cuotas</p>
            <p className="text-lg font-semibold">{formatCurrency(totals.total)}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
            <p className="text-sm text-green-700 dark:text-green-300">Total Pagado</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">
              {formatCurrency(totals.paid)}
            </p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950">
            <p className="text-sm text-orange-700 dark:text-orange-300">Total Pendiente</p>
            <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">
              {formatCurrency(totals.pending)}
            </p>
          </div>
          {totals.lateFees > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm text-red-700 dark:text-red-300">Total Moras</p>
              <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                {formatCurrency(totals.lateFees)}
              </p>
            </div>
          )}
        </div>

        {/* Data Table */}
        {installments.length > 0 ? (
          <DataTable
            columns={columns}
            data={installments}
            storageKey="installments-table-columns"
          />
        ) : (
          <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">No hay cuotas registradas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
