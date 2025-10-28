'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
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
import { Building2, Calendar, CreditCard, Phone, User, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import AssignVendorButton from './AssignVendorButton';
import AssignVendorModal from './AssignVendorModal';
import AssignLeadParticipantButton from './AssignLeadParticipantButton';
import LeadDetailButton from './LeadDetailButton';
import LeadActionsButton from './LeadActionsButton';

type Props = {
  data: LeadsOfDay[];
};

export default function BienvenidosTable({ data }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    documentType: false,
    phone2: false
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const columns = useMemo<ColumnDef<LeadsOfDay>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            #{(row.getValue('id') as string).substring(0, 8)}...
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'leadInfo',
        header: 'Información del Lead',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {lead.firstName} {lead.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lead.age ? `${lead.age} años` : 'Edad no registrada'}
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'document',
        header: 'Documento',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lead.document}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lead.documentType}
                </span>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'documentType',
        header: 'Tipo de documento',
        cell: ({ row }) => <div className="text-sm">{row.getValue('documentType')}</div>,
        enableHiding: true
      },
      {
        id: 'contact',
        header: 'Contacto',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex flex-col gap-1">
              {lead.phone && (
                <div className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.phone2 && (
                <div className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span>{lead.phone2}</span>
                </div>
              )}
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'phone2',
        header: 'Teléfono 2',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.getValue('phone2') || <span className="text-gray-400">No registrado</span>}
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'source',
        header: 'Fuente',
        cell: ({ row }) => {
          const lead = row.original;
          return lead.source ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{lead.source.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Building2 className="h-3 w-3" />
              <span>No especificada</span>
            </div>
          );
        },
        enableHiding: true
      },
      {
        id: 'vendor',
        header: 'Vendedor',
        cell: ({ row }) => {
          console.log(row.original);
          const lead = row.original;

          const hasVendor = !!lead.vendor;

          if (!hasVendor) {
            return (
              <Badge variant="secondary" className="border-amber-200 bg-amber-100 text-amber-700">
                Sin asignar
              </Badge>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {lead.vendor.firstName} {lead.vendor.lastName}
                </span>
                <span className="text-xs text-gray-500">{lead.vendor.email}</span>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'participants',
        header: 'Participantes',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center">
              <AssignLeadParticipantButton lead={lead} />
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Registro',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy', { locale: es })}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(row.getValue('createdAt')), 'HH:mm', { locale: es })}
              </span>
            </div>
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const lead = row.original;
          const hasVendor = !!lead.vendor?.id;

          return (
            <div className="flex items-center gap-2">
              {hasVendor && (
                <Badge variant="default" className="border-green-200 bg-green-100 text-green-700">
                  Asignado
                </Badge>
              )}
              <div className="flex gap-1">
                <LeadDetailButton lead={lead} />
                <AssignVendorButton leadId={lead.id} hasVendor={hasVendor} />
                <LeadActionsButton lead={lead} />
              </div>
            </div>
          );
        },
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
    onRowSelectionChange: setRowSelection,
    // enableRowSelection: (row) => canSelectRow(row.original),
    getRowId: (row) => row.id,
    state: {
      columnVisibility,
      rowSelection
    }
  });

  const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);

  const bulkActions =
    selectedRowIds.length > 0 ? (
      <Button onClick={() => setIsAssignModalOpen(true)} size="sm" className="ml-2">
        <UserPlus className="mr-2 h-4 w-4" />
        Asignar vendedor ({selectedRowIds.length})
      </Button>
    ) : null;

  const selectionMessage = (count: number) =>
    `${count} lead(s) seleccionado(s) para asignar/reasignar`;

  const handleModalClose = () => {
    setIsAssignModalOpen(false);
    setRowSelection({});
  };

  return (
    <>
      <TableTemplate<LeadsOfDay>
        table={table}
        columns={columns}
        showColumnVisibility={true}
        columnVisibilityLabel="Mostrar columnas"
        enableRowSelection={true}
        bulkActions={bulkActions}
        selectionMessage={selectionMessage}
      />

      <AssignVendorModal
        leadIds={selectedRowIds}
        isOpen={isAssignModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
