'use client';

import TableTemplate from '@components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, SquareActivity, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PaymentWithCollector } from '@domain/entities/cobranza';
import { Badge } from '@/components/ui/badge';

type Props = {
  data: PaymentWithCollector[];
};

export default function SupervisorTable({ data }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    client: true,
    amount: true,
    status: true,
    lot: true,
    user: true,
    createdAt: true,
    reviewedAt: false,
    reviewBy: false,
    paymentConfig: false,
    reason: true,
    bankInfo: false
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprobado
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rechazado
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = useMemo<ColumnDef<PaymentWithCollector>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">#{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        id: 'client',
        header: 'Cliente',
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {payment.client?.lead?.firstName} {payment.client?.lead?.lastName}
                </span>
                <span className="text-xs text-gray-500">DNI: {payment.client?.lead?.document}</span>
                <span className="text-xs text-gray-500">{payment.client?.address}</span>
              </div>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: payment.currency || 'PEN'
                }).format(row.getValue('amount'))}
              </div>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
        enableHiding: true
      },
      {
        id: 'lot',
        header: 'Lote',
        cell: ({ row }) => {
          const payment = row.original;
          return payment.lot ? (
            <div className="flex items-center gap-2">
              <SquareActivity className="text-muted-foreground h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Lote: {payment.lot.name}</span>
                <span className="text-xs text-gray-500">{payment.lot.project}</span>
                <span className="text-xs text-gray-500">
                  {payment.lot.stage} - Mz {payment.lot.block}
                </span>
                <span className="text-xs font-medium text-green-600">
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  }).format(Number(payment.lot.lotPrice))}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Sin lote</span>
          );
        },
        enableHiding: false
      },
      {
        id: 'user',
        header: 'Cobrador',
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {payment.user?.firstName} {payment.user?.lastName}
                </span>
                <span className="text-xs text-gray-500">{payment.user?.email}</span>
                <span className="text-xs text-gray-500">Doc: {payment.user?.document}</span>
              </div>
            </div>
          );
        },
        enableHiding: true
      },
      {
        id: 'bankInfo',
        header: 'Info Bancaria',
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex flex-col">
              {payment.banckName && (
                <span className="text-sm font-medium">{payment.banckName}</span>
              )}
              {payment.codeOperation && (
                <span className="text-xs text-gray-500">Op: {payment.codeOperation}</span>
              )}
              {payment.numberTicket && (
                <span className="text-xs text-gray-500">Ticket: {payment.numberTicket}</span>
              )}
              {payment.dateOperation && (
                <span className="text-xs text-gray-500">
                  {format(new Date(payment.dateOperation), 'dd/MM/yyyy')}
                </span>
              )}
              {!payment.banckName && !payment.codeOperation && (
                <span className="text-xs text-gray-400">Sin info bancaria</span>
              )}
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'reason',
        header: 'Motivo',
        cell: ({ row }) => {
          const reason = row.getValue('reason') as string;
          return reason ? (
            <div className="max-w-[200px]">
              <span className="text-sm text-red-600">{reason}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">--</span>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha Registro',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy', { locale: es })}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(row.getValue('createdAt')), 'HH:mm', { locale: es })}
              </span>
            </div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'reviewedAt',
        header: 'Fecha Revisión',
        cell: ({ row }) => {
          const reviewedAt = row.getValue('reviewedAt') as string;
          return reviewedAt ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {format(new Date(reviewedAt), 'dd/MM/yyyy', { locale: es })}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(reviewedAt), 'HH:mm', { locale: es })}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No revisado</span>
          );
        },
        enableHiding: true
      },
      {
        id: 'reviewBy',
        header: 'Revisado por',
        cell: ({ row }) => {
          const payment = row.original;
          return payment.reviewBy ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Supervisor</span>
                <span className="text-xs text-gray-500">{payment.reviewBy.email}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Sin revisar</span>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'paymentConfig',
        header: 'Tipo de Pago',
        cell: ({ row }) => {
          const config = row.getValue('paymentConfig') as string;
          return (
            <div className="max-w-[200px]">
              <span className="text-sm">{config}</span>
            </div>
          );
        },
        enableHiding: true
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
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      rowSelection
    }
  });

  return (
    <TableTemplate<PaymentWithCollector>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
}
