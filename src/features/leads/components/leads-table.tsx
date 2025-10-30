'use client';

import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Download, Building2, Home } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { Lead, DocumentType } from '../types';
import type { PaginationMeta } from '@/shared/types/pagination';

interface LeadsTableProps {
  leads: Lead[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const documentTypeLabels: Record<DocumentType, string> = {
  DNI: 'DNI',
  CE: 'C.E.',
  PASSPORT: 'Pasaporte',
  RUC: 'RUC',
};

export function LeadsTable({ leads, meta, onPageChange }: LeadsTableProps) {
  const handleDownloadReport = (url: string, leadName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${leadName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre completo',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => (
        <div className="text-sm">
          <Badge variant="outline" className="font-mono text-xs">
            {documentTypeLabels[row.original.documentType]}
          </Badge>
          <p className="mt-1">{row.original.document}</p>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'isInOffice',
      header: 'Ubicación',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isInOffice ? (
            <>
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm">En oficina</span>
            </>
          ) : (
            <>
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Fuera de oficina</span>
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de registro',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), 'PPP', { locale: es })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* Download Report Button */}
          {row.original.reportPdfUrl ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleDownloadReport(
                  row.original.reportPdfUrl!,
                  `${row.original.firstName}-${row.original.lastName}`
                )
              }
              title="Descargar reporte PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled title="Sin reporte disponible">
              <Download className="h-4 w-4 opacity-50" />
            </Button>
          )}

          {/* View Details Button */}
          <Link href={`/leads/detalle/${row.original.id}`}>
            <Button size="sm" variant="ghost" title="Ver detalle">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <p className="text-center text-muted-foreground">No se encontraron leads</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={leads} />
      </div>

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
