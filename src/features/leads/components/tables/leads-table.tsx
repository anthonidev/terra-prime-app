'use client';

import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Download, Eye, Home, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { LeadCard } from '../cards/lead-card';
import type { DocumentType, Lead } from '../../types';
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
  const isMobile = useMediaQuery('(max-width: 768px)');

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
      header: 'Lead',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              {documentTypeLabels[row.original.documentType]}
            </Badge>
            <span className="text-muted-foreground text-xs">{row.original.document}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contacto',
      cell: ({ row }) => (
        <div className="text-xs">
          {row.original.email && (
            <div className="text-muted-foreground max-w-[200px] truncate">{row.original.email}</div>
          )}
          {row.original.phone && (
            <div className="text-muted-foreground mt-0.5">{row.original.phone}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'isInOffice',
      header: 'Ubicación',
      cell: ({ row }) => (
        <div>
          {row.original.isInOffice ? (
            <Badge className="bg-success text-success-foreground text-xs">
              <Building2 className="mr-1 h-3 w-3" />
              En Oficina
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground text-xs">
              <Home className="mr-1 h-3 w-3" />
              Fuera
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Registro',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy', { locale: es })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
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
              className="h-8 w-8 p-0"
              title="Descargar reporte PDF"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="h-8 w-8 p-0"
              title="Sin reporte disponible"
            >
              <Download className="h-3.5 w-3.5 opacity-50" />
            </Button>
          )}

          <Link href={`/leads/detalle/${row.original.id}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Ver detalle">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
              <Users className="text-muted-foreground h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No se encontraron leads</p>
              <p className="text-muted-foreground text-xs">
                No hay leads que coincidan con los filtros aplicados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onDownloadReport={handleDownloadReport} />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={leads} />
        </Card>
      )}

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
