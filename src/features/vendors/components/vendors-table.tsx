'use client';

import { useState, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { Vendor } from '../types';

interface VendorsTableProps {
  vendors: Vendor[];
}

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: 'photo',
    header: 'Foto',
    cell: ({ row }) => {
      const vendor = row.original;
      const initials = `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();

      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={vendor.photo} alt={`${vendor.firstName} ${vendor.lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'firstName',
    header: 'Nombre',
    cell: ({ row }) => {
      const vendor = row.original;
      return `${vendor.firstName} ${vendor.lastName}`;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'document',
    header: 'Documento',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Registro',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "dd 'de' MMMM, yyyy", { locale: es });
    },
  },
];

export function VendorsTable({ vendors }: VendorsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;

    const query = searchQuery.toLowerCase();
    return vendors.filter((vendor) => {
      const fullName = `${vendor.firstName} ${vendor.lastName}`.toLowerCase();
      const email = vendor.email.toLowerCase();
      const document = vendor.document.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        document.includes(query)
      );
    });
  }, [vendors, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o documento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <DataTable columns={columns} data={filteredVendors} />

      {filteredVendors.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredVendors.length} de {vendors.length} vendedores
        </div>
      )}
    </div>
  );
}
