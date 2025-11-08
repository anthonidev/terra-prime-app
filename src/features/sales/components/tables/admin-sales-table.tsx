'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Users, FileText, FilePlus, MoreVertical, Download } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { MySale, StatusSale } from '../../types';
import { AssignParticipantsModal } from '../dialogs/assign-participants-modal';
import {
  useGenerateRadicationPdf,
  useRegenerateRadicationPdf,
  useGeneratePaymentAccordPdf,
  useRegeneratePaymentAccordPdf,
} from '../../hooks/use-generate-pdfs';

// Status badge configurations
const statusConfig: Record<
  StatusSale,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  RESERVATION_PENDING: { label: 'Reserva Pendiente', variant: 'outline' },
  RESERVATION_PENDING_APPROVAL: { label: 'Reserva Por Aprobar', variant: 'secondary' },
  RESERVED: { label: 'Reservado', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PENDING_APPROVAL: { label: 'Por Aprobar', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  IN_PAYMENT_PROCESS: { label: 'En Proceso de Pago', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

interface AdminSalesTableProps {
  data: MySale[];
}

function ActionsCell({ sale }: { sale: MySale }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const generateRadicationPdf = useGenerateRadicationPdf();
  const regenerateRadicationPdf = useRegenerateRadicationPdf();
  const generatePaymentAccordPdf = useGeneratePaymentAccordPdf();
  const regeneratePaymentAccordPdf = useRegeneratePaymentAccordPdf();

  const handleGenerateRadication = () => {
    if (sale.radicationPdfUrl) {
      regenerateRadicationPdf.mutate(sale.id);
    } else {
      generateRadicationPdf.mutate(sale.id);
    }
  };

  const handleGeneratePaymentAccord = () => {
    if (sale.paymentAcordPdfUrl) {
      regeneratePaymentAccordPdf.mutate(sale.id);
    } else {
      generatePaymentAccordPdf.mutate(sale.id);
    }
  };

  const isLoading =
    generateRadicationPdf.isPending ||
    regenerateRadicationPdf.isPending ||
    generatePaymentAccordPdf.isPending ||
    regeneratePaymentAccordPdf.isPending;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ventas/detalle/${sale.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsAssignModalOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Asignar Participantes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleGenerateRadication}>
              {sale.radicationPdfUrl ? (
                <>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Regenerar PDF Radicación
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar PDF Radicación
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGeneratePaymentAccord}>
              {sale.paymentAcordPdfUrl ? (
                <>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Regenerar PDF Acuerdo de Pagos
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar PDF Acuerdo de Pagos
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AssignParticipantsModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        saleId={sale.id}
      />
    </>
  );
}

const columns: ColumnDef<MySale>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return format(date, 'dd MMM yyyy', { locale: es });
    },
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {client.firstName} {client.lastName}
          </span>
          <span className="text-sm text-muted-foreground">{client.phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'lot',
    header: 'Lote',
    cell: ({ row }) => {
      const lot = row.original.lot;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{lot.name}</span>
          <span className="text-sm text-muted-foreground">
            {lot.project} - {lot.stage}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <span className="capitalize">
          {type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Monto Total',
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number;
      const currency = row.original.currency;
      return (
        <span className="font-medium">
          {currency === 'USD' ? '$' : 'S/'} {amount.toLocaleString('es-PE')}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusSale;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: 'reports',
    header: 'Reportes',
    cell: ({ row }) => {
      const sale = row.original;
      const hasRadication = !!sale.radicationPdfUrl;
      const hasPaymentAccord = !!sale.paymentAcordPdfUrl;

      if (!hasRadication && !hasPaymentAccord) {
        return (
          <span className="text-xs text-muted-foreground">Sin reportes</span>
        );
      }

      return (
        <div className="flex flex-col gap-1">
          {hasRadication && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 justify-start"
              asChild
            >
              <a
                href={sale.radicationPdfUrl!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3 mr-1" />
                <span className="text-xs">Radicación</span>
              </a>
            </Button>
          )}
          {hasPaymentAccord && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 justify-start"
              asChild
            >
              <a
                href={sale.paymentAcordPdfUrl!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3 mr-1" />
                <span className="text-xs">Acuerdo de Pagos</span>
              </a>
            </Button>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionsCell sale={row.original} />,
  },
];

export function AdminSalesTable({ data }: AdminSalesTableProps) {
  return <DataTable columns={columns} data={data} />;
}
