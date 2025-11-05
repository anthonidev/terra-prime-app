'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { VendorLeadCard } from '../cards/vendor-lead-card';
import type { VendorLead } from '../../types';

interface VendorLeadsTableProps {
  leads: VendorLead[];
}

const columns: ColumnDef<VendorLead>[] = [
  {
    accessorKey: 'firstName',
    header: 'Prospecto',
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div>
          <div className="text-xs font-bold">
            {lead.firstName} {lead.lastName}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="outline" className="text-xs font-mono">
              {lead.documentType}
            </Badge>
            <span className="text-xs text-muted-foreground">{lead.document}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <User className="h-3 w-3" />
            <span>{lead.age} años</span>
          </div>
        </div>
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
          <div className="text-xs">{lead.phone}</div>
          {lead.phone2 && (
            <div className="text-xs text-muted-foreground">{lead.phone2}</div>
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
          <Badge variant="outline" className="text-xs">
            {lead.source.name}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {format(date, 'dd MMM yyyy', { locale: es })}
          </div>
        </div>
      );
    },
  },
];

export function VendorLeadsTable({ leads }: VendorLeadsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o documento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Tabla o Cards */}
      {isMobile ? (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <VendorLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={filteredLeads} />
        </Card>
      )}

      {/* Contador */}
      {filteredLeads.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Mostrando {filteredLeads.length} de {leads.length} prospectos
        </div>
      )}
    </div>
  );
}
