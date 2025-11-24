'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { UserInfo } from '@/shared/components/user-info';

import { VendorLeadCard } from '../cards/vendor-lead-card';
import { VendorLeadDetailModal } from '../dialogs/vendor-lead-detail-modal';
import type { VendorLead } from '../../types';

interface VendorLeadsTableProps {
  leads: VendorLead[];
}

export function VendorLeadsTable({ leads }: VendorLeadsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<VendorLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = (lead: VendorLead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const columns: ColumnDef<VendorLead>[] = [
    {
      accessorKey: 'firstName',
      header: 'Prospecto',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <UserInfo
            name={`${lead.firstName} ${lead.lastName}`}
            document={lead.document}
            documentType={lead.documentType}
            className="gap-2"
          />
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Contacto',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="space-y-0.5">
            <div className="text-xs font-medium">{lead.phone}</div>
            {lead.email && (
              <div className="text-muted-foreground truncate text-xs">{lead.email}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Fuente/Registro',
      cell: ({ row }) => {
        const lead = row.original;
        const date = new Date(lead.createdAt);
        return (
          <div className="space-y-1">
            <Badge variant="outline" className="bg-background text-xs font-normal">
              {lead.source.name}
            </Badge>
            <div className="text-muted-foreground text-xs">
              {format(date, 'dd MMM yyyy', { locale: es })}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetail(row.original)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalle</span>
          </Button>
        );
      },
    },
  ];

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;

    const query = searchQuery.toLowerCase();
    return leads.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      const document = lead.document.toLowerCase();

      return fullName.includes(query) || document.includes(query);
    });
  }, [leads, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nombre o documento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="focus-visible:ring-primary/30 h-9 pl-9 text-sm transition-all"
        />
      </div>

      {/* Tabla o Cards */}
      {isMobile ? (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <VendorLeadCard key={lead.id} lead={lead} onViewDetail={handleViewDetail} />
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <DataTable columns={columns} data={filteredLeads} />
        </Card>
      )}

      {/* Contador */}
      {filteredLeads.length > 0 && (
        <div className="text-muted-foreground text-xs">
          Mostrando {filteredLeads.length} de {leads.length} prospectos
        </div>
      )}

      <VendorLeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
