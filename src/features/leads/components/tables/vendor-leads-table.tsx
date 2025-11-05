'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { VendorLead } from '../../types';

interface VendorLeadsTableProps {
  leads: VendorLead[];
}

const columns: ColumnDef<VendorLead>[] = [
  {
    accessorKey: 'firstName',
    header: 'Nombre Completo',
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div>
          <div className="font-medium">
            {lead.firstName} {lead.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {lead.documentType}: {lead.document}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Teléfonos',
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm">{lead.phone}</div>
          {lead.phone2 && (
            <div className="text-sm text-muted-foreground">{lead.phone2}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'age',
    header: 'Edad',
    cell: ({ row }) => {
      return `${row.original.age} años`;
    },
  },
  {
    accessorKey: 'source',
    header: 'Fuente',
    cell: ({ row }) => {
      const source = row.original.source;
      return (
        <Badge variant="outline" className="text-xs">
          {source.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Registro',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="space-y-1">
          <div className="text-sm">{format(date, 'PP', { locale: es })}</div>
          <div className="text-xs text-muted-foreground">
            {format(date, 'p', { locale: es })}
          </div>
        </div>
      );
    },
  },
];

export function VendorLeadsTable({ leads }: VendorLeadsTableProps) {
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
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o documento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredLeads.length} {filteredLeads.length === 1 ? 'prospecto' : 'prospectos'}
        </div>
      </div>

      <DataTable columns={columns} data={filteredLeads} />

      {searchQuery && filteredLeads.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredLeads.length} de {leads.length} prospectos
        </div>
      )}
    </div>
  );
}
