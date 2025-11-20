'use client';

import { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { PageHeader } from '@/shared/components/common/page-header';
import { Badge } from '@/components/ui/badge';

import { useActiveVendors } from '../hooks/use-active-vendors';
import { VendorCard } from './vendor-card';

export function VendorsContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: vendors, isLoading } = useActiveVendors();

  // Filter vendors in real-time
  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    if (!searchTerm.trim()) return vendors;

    const term = searchTerm.toLowerCase().trim();
    return vendors.filter((vendor) => {
      const fullName = `${vendor.firstName} ${vendor.lastName}`.toLowerCase();
      const email = vendor.email.toLowerCase();
      const document = vendor.document.toLowerCase();

      return fullName.includes(term) || email.includes(term) || document.includes(term);
    });
  }, [vendors, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Vendedores" description="Gestiona los vendedores activos del sistema" />
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <p className="text-muted-foreground text-center">Cargando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Vendedores" description="Gestiona los vendedores activos del sistema" />

      {/* Search Bar */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Buscar vendedor</h2>
            {vendors && (
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                {filteredVendors.length} de {vendors.length}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre, email o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {searchTerm && filteredVendors.length === 0 && (
          <p className="text-muted-foreground mt-3 text-sm">
            No se encontraron vendedores que coincidan con la búsqueda
          </p>
        )}
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : !searchTerm && (!vendors || vendors.length === 0) ? (
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <p className="text-muted-foreground text-center">No hay vendedores activos disponibles</p>
        </div>
      ) : null}
    </div>
  );
}
