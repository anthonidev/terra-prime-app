'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { VendorCard } from './vendor-card';
import type { Vendor } from '../types';

interface VendorsTableProps {
  vendors: Vendor[];
}

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: 'firstName',
    header: 'Vendedor',
    cell: ({ row }) => {
      const vendor = row.original;
      const initials = `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={vendor.photo} alt={`${vendor.firstName} ${vendor.lastName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs font-bold">
              {vendor.firstName} {vendor.lastName}
            </div>
            <div className="text-muted-foreground truncate text-xs">{vendor.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'document',
    header: 'Documento',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.document}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Registro',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-muted-foreground text-xs">
          {format(date, 'dd MMM yyyy', { locale: es })}
        </span>
      );
    },
  },
];

export function VendorsTable({ vendors }: VendorsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;

    const query = searchQuery.toLowerCase();
    return vendors.filter((vendor) => {
      const fullName = `${vendor.firstName} ${vendor.lastName}`.toLowerCase();
      const email = vendor.email.toLowerCase();
      const document = vendor.document.toLowerCase();

      return fullName.includes(query) || email.includes(query) || document.includes(query);
    });
  }, [vendors, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nombre, email o documento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Tabla o Cards */}
      {isMobile ? (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={filteredVendors} />
        </Card>
      )}

      {/* Contador */}
      {filteredVendors.length > 0 && (
        <div className="text-muted-foreground text-xs">
          Mostrando {filteredVendors.length} de {vendors.length} vendedores
        </div>
      )}
    </div>
  );
}
