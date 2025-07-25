'use client';

import TableTemplate from '@components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import {
  CreditCard,
  File,
  DollarSign,
  FileText,
  SquareActivity,
  User,
  Calendar,
  DollarSignIcon
} from 'lucide-react';
import { useMemo, useState } from 'react';
import VentasActionsButton from './VentasActionsButton';
import { CurrencyType, SaleList, SaleType } from '@domain/entities/sales/salevendor.entity';
import { StatusBadge } from '@components/common/table/StatusBadge';

type Props = {
  data: SaleList[];
};

const VentasTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    type: true
  });

  const calculateDueDate = (maximumHoldPeriod: string | null | undefined) => {
    if (!maximumHoldPeriod || isNaN(parseInt(maximumHoldPeriod))) {
      return '--';
    }

    const currentDate = new Date();
    const dueDate = new Date(currentDate);
    dueDate.setDate(currentDate.getDate() + parseInt(maximumHoldPeriod));

    return dueDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const columns = useMemo<ColumnDef<SaleList>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            # {(row.getValue('id') as string).substring(0, 8)}...
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'clientInfo',
        header: 'Cliente',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {sale.client.firstName} {sale.client.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{sale.client.phone}</div>
                {sale.client.reportPdfUrl ? (
                  <a
                    href={sale.client.reportPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Ver reporte
                  </a>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400">
                    <File className="h-4 w-4" />
                    <span className="text-xs">sin reporte</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'reservation',
        header: 'Separación',
        cell: ({ row }) => {
          const reserva = row.original;
          return (
            <div className="flex flex-col">
              <div className="inline-flex gap-2 font-medium">
                <DollarSignIcon className="h-4 w-4" />
                {reserva.reservationAmount ?? '--'}
              </div>
              <p className="mt-1 inline-flex gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="text-blue-600 dark:text-blue-400">
                  {calculateDueDate(reserva.maximumHoldPeriod)}
                </span>
              </p>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'documents',
        header: 'Documentos',
        cell: ({ row }) => {
          const radication = row.original.radicationPdfUrl;
          const acord = row.original.paymentAcordPdfUrl;

          return (
            <div className="space-y-2">
              <div>
                {radication ? (
                  <a
                    href={radication}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">H. de Radicación</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <File className="h-4 w-4" />
                    <span className="text-sm">H. de Radicación</span>
                  </div>
                )}
              </div>
              <div>
                {acord ? (
                  <a
                    href={acord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">A. de Pago</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <File className="h-4 w-4" />
                    <span className="text-sm">A. de Pago</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'lot',
        header: 'Lote',
        cell: ({ row }) => {
          const lote = row.original;
          return lote.lot ? (
            <div className="flex items-center gap-2">
              <SquareActivity className="text-muted-foreground h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  <span className="text-xs">Pro: </span>
                  {lote.lot.project ?? '--'}
                </span>
                <span className="text-muted-foreground text-xs">Et: {lote.lot.stage ?? '--'}</span>
                <span className="text-muted-foreground text-xs">Ma: {lote.lot.block ?? '--'}</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Sin asignar</span>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <StatusBadge status={row.getValue('type')} />,
        enableHiding: true
      },
      {
        id: 'initialPayment',
        header: 'Cuota Inicial',
        cell: ({ row }) => {
          const sale = row.original;

          if (sale.type === SaleType.FINANCED && sale.financing) {
            return (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(Number(sale.financing.initialAmount), sale.currency)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Inicial ({sale.financing.quantityCoutes} cuotas)
                  </span>
                </div>
              </div>
            );
          } else if (sale.type === SaleType.DIRECT_PAYMENT) {
            return (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(Number(sale.totalAmount), sale.currency)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Pago completo</span>
                </div>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">No definido</span>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'totalAmount',
        header: 'Monto Total',
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">
                {formatCurrency(row.getValue('totalAmount'), sale.currency)}
              </span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
      },

      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <VentasActionsButton sale={row.original} />,
        enableHiding: false
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });

  return (
    <TableTemplate<SaleList>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default VentasTable;
