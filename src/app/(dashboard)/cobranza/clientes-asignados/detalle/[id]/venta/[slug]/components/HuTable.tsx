'use client';

import TableTemplate from '@components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CurrencyType } from '@domain/entities/sales/payment.entity';
import { Wallet } from 'lucide-react';
import { FinancingInstallmentCollector } from '@/lib/domain/entities/cobranza';
import { StatusBadge } from '@components/common/table/StatusBadge';
import { cn } from '@/lib/utils';
import PaymentsButton from './PaymentsButton';

interface Props {
  currency: CurrencyType;
  data: FinancingInstallmentCollector[];
}

export default function HuTable({ currency, data }: Props) {
  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const columns = useMemo<ColumnDef<FinancingInstallmentCollector>[]>(
    () => [
      {
        accessorKey: 'index',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">{row.index + 1}</div>
      },
      {
        id: 'couteAmount',
        header: 'Cuota a pagar',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-blue-600">
                  {formatCurrency(Number(row.original.couteAmount), currency)}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'coutePaid',
        header: 'Cuota pagada',
        cell: ({ row }) => {
          const cuotePaid = Number(row.original.coutePaid);
          return (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className={cn('text-sm font-medium', cuotePaid > 0 ? 'text-green-500' : '')}>
                  {formatCurrency(cuotePaid, currency)}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'coutePending',
        header: 'Cuota Pendiente',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {formatCurrency(Number(row.original.coutePending), currency)}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'mora',
        header: 'Mora',
        cell: ({ row }) => {
          const moraPaid = Number(row.original.lateFeeAmountPaid) || 0;
          const moraPending = Number(row.original.lateFeeAmountPending) || 0;
          return (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Pagado:</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(moraPaid, currency)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Pendiente:</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      moraPending > 0 ? 'text-red-500' : 'text-gray-400'
                    )}
                  >
                    {formatCurrency(moraPending, currency)}
                  </span>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
      },
      {
        id: 'expectedPaymentDate',
        header: 'Fecha estimada de pago',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {formatDate(row.original.expectedPaymentDate)}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          return <PaymentsButton currency={currency} data={row.original} />;
        }
      }
    ],
    [currency]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <TableTemplate<FinancingInstallmentCollector>
      table={table}
      columns={columns}
      showColumnVisibility={false}
    />
  );
}
