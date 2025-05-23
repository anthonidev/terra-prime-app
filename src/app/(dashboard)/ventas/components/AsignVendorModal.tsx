'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Search, User } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { AssignLeadsToVendorDto, LeadsByDayItem } from '@/types/sales';

interface Props {
  leads: Array<string>;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: AssignLeadsToVendorDto) => Promise<LeadsByDayItem[]>;
}

export function AsignVendorModal({ leads, isOpen, onClose, onAssign }: Props) {
  const { data, isLoading, error } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredVendors = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(
      (vendor) =>
        `${vendor.firstName} ${vendor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.document.includes(searchTerm)
    );
  }, [data, searchTerm]);

  const handleAssign = async () => {
    if (!selectedVendor) return;
    try {
      await onAssign({
        leadsId: leads,
        vendorId: selectedVendor
      });
      onClose();
    } catch (err) {
      console.error('Error al asignar vendedor:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-96 w-full max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5" />
            Asignar vendedor
          </DialogTitle>
        </DialogHeader>
        <div className="relative mx-4 mb-2 rounded-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar vendedor por nombre, email o documento..."
            className="bg-white pl-9 dark:bg-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <span className="ml-2">Cargando vendedores...</span>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-600">
            Error al cargar vendedores: {error.message}
          </div>
        ) : Array.isArray(filteredVendors) && filteredVendors.length > 0 ? (
          <div className="space-y-3 overflow-y-auto px-4">
            {filteredVendors.map((vendor) => (
              <Card
                key={vendor.id}
                className={`h-auto cursor-pointer transition-all ${
                  selectedVendor === vendor.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedVendor(vendor.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between px-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedVendor === vendor.id}
                      onCheckedChange={() => setSelectedVendor(vendor.id)}
                      className="h-5 w-5 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">
                        {vendor.firstName} {vendor.lastName}
                      </CardTitle>
                      <CardDescription>{vendor.email}</CardDescription>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm">#{vendor.document}</span>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center text-gray-500">
            No hay vendedores disponibles
          </div>
        )}
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="border-input hover:bg-accent"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="text-primary-foreground bg-green-600 hover:bg-green-500"
            disabled={isLoading || !selectedVendor}
            onClick={handleAssign}
          >
            {isLoading ? 'Cargando...' : `Asignar a ${leads.length} lead(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
