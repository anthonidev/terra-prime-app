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
import { UserInfo } from '@/shared/components/user-info';

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
        <UserInfo
          name={`${row.original.firstName} ${row.original.lastName}`}
          email={row.original.email || undefined}
          document={row.original.document}
          documentType={documentTypeLabels[row.original.documentType]}
          phone={row.original.phone || undefined}
        />
      ),
    },
    {
      accessorKey: 'isInOffice',
      header: 'Ubicación',
      cell: ({ row }) => (
        <div>
          {row.original.isInOffice ? (
            <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20 shadow-none">
              <Building2 className="mr-1 h-3 w-3" />
              En Oficina
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground shadow-none">
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
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {row.original.reportPdfUrl ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                handleDownloadReport(
                  row.original.reportPdfUrl!,
                  `${row.original.firstName}-${row.original.lastName}`
                )
              }
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              title="Descargar reporte PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              disabled
              className="text-muted-foreground/50 h-8 w-8 p-0"
              title="Sin reporte disponible"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          <Link href={`/leads/detalle/${row.original.id}`}>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (leads.length === 0) {
    return (
      <Card className="border-none shadow-sm">
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
        <DataTable columns={columns} data={leads} />
      )}

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
