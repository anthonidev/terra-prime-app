import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/shared/components/user-info';
import type { InvoiceListItem, InvoiceStatus, DocumentType } from '../../types';
import { DocumentTypeLabels, Currency } from '../../types';
import { invoiceStatusConfig } from './status-config';

export function createDateColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const day = format(date, 'dd MMM', { locale: es });
      const year = format(date, 'yyyy', { locale: es });

      return (
        <div className="flex flex-col">
          <span className="text-foreground text-sm leading-none font-medium">{day}</span>
          <span className="text-muted-foreground mt-0.5 text-xs leading-none">{year}</span>
        </div>
      );
    },
    enableHiding: true,
  };
}

export function createDocumentTypeColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'documentType',
    header: 'Tipo',
    cell: ({ row }) => {
      const docType = row.getValue('documentType') as DocumentType;
      const label = DocumentTypeLabels[docType] || 'Desconocido';
      const isFactura = docType === 1;

      return (
        <Badge variant={isFactura ? 'default' : 'secondary'} className="font-medium">
          {label}
        </Badge>
      );
    },
    enableHiding: false,
  };
}

export function createFullNumberColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'fullNumber',
    header: 'Número',
    cell: ({ row }) => {
      const fullNumber = row.getValue('fullNumber') as string;

      return <span className="text-foreground font-mono text-sm font-semibold">{fullNumber}</span>;
    },
    enableHiding: false,
  };
}

export function createClientColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'clientName',
    header: 'Cliente',
    cell: ({ row }) => {
      const clientName = row.original.clientName;
      const clientDocNumber = row.original.clientDocumentNumber;

      return <UserInfo name={clientName} document={clientDocNumber} />;
    },
    enableHiding: false,
  };
}

export function createTotalColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const total = row.getValue('total') as number;
      const currency = row.original.currency;
      const symbol = currency === Currency.USD ? '$' : 'S/';

      return (
        <div className="text-foreground font-semibold">
          {symbol} {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </div>
      );
    },
    enableHiding: false,
  };
}

export function createStatusColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as InvoiceStatus;
      const config = invoiceStatusConfig[status] || { label: status, variant: 'outline' as const };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    enableHiding: false,
  };
}

export function createCreatedByColumn(): ColumnDef<InvoiceListItem> {
  return {
    accessorKey: 'createdBy',
    header: 'Creado por',
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      const name =
        createdBy.firstName && createdBy.lastName
          ? `${createdBy.firstName} ${createdBy.lastName}`
          : createdBy.email;

      return <UserInfo name={name} email={createdBy.email} />;
    },
    enableHiding: true,
  };
}

export function createActionsColumn(): ColumnDef<InvoiceListItem> {
  return {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const paymentId = row.original.payment?.id;
      const pdfUrl = row.original.pdfUrl;

      return (
        <div className="flex items-center gap-1">
          {pdfUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" title="Descargar PDF">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          {paymentId && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/pagos/detalle/${paymentId}`} title="Ver pago">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      );
    },
    enableHiding: false,
  };
}
