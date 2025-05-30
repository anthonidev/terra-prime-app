'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, User, X, AlertCircle, Mail, FileText, Loader2 } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { VendorsActivesItem } from '@/types/sales';
import { assignLeadsToVendor, getVendorsActives } from '../action';

interface AssignVendorModalProps {
  leadIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignVendorModal({ leadIds, isOpen, onClose }: AssignVendorModalProps) {
  const router = useRouter();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [vendors, setVendors] = useState<VendorsActivesItem[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredVendors = useMemo(() => {
    if (!Array.isArray(vendors)) return [];
    return vendors.filter(
      (vendor) =>
        `${vendor.firstName} ${vendor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.document.includes(searchTerm)
    );
  }, [vendors, searchTerm]);

  const loadVendors = async () => {
    if (vendors.length > 0) return;

    setIsLoadingVendors(true);
    setError(null);

    try {
      const vendorsList = await getVendorsActives();
      setVendors(vendorsList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar vendedores';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedVendorId) {
      toast.error('Por favor selecciona un vendedor');
      return;
    }

    setIsAssigning(true);
    setError(null);

    try {
      await assignLeadsToVendor({
        leadsId: leadIds,
        vendorId: selectedVendorId
      });

      toast.success(`Vendedor asignado correctamente a ${leadIds.length} lead(s)`);
      handleClose();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar vendedor';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    if (!isAssigning) {
      setSelectedVendorId(null);
      setSearchTerm('');
      setError(null);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVendors();
    }
  }, [isOpen, vendors.length]);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col p-0">
        <DialogHeader className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Asignar vendedor a leads</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecciona un vendedor para asignar a {leadIds.length} lead(s)
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="space-y-4 p-6">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar vendedor por nombre, email o documento..."
                className="h-10 pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoadingVendors || isAssigning}
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {selectedVendor && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Vendedor seleccionado
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedVendor.firstName} {selectedVendor.lastName} • {selectedVendor.email}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-blue-600">
                    Seleccionado
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-3">
              {isLoadingVendors ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Cargando vendedores...</p>
                  </div>
                </div>
              ) : filteredVendors.length > 0 ? (
                <>
                  <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Vendedores disponibles ({filteredVendors.length})
                  </div>
                  {filteredVendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      className={`cursor-pointer border transition-all hover:shadow-sm ${
                        selectedVendorId === vendor.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm dark:bg-blue-950/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedVendorId(vendor.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedVendorId === vendor.id}
                              onCheckedChange={() => setSelectedVendorId(vendor.id)}
                              className="h-4 w-4"
                            />
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                                {vendor.firstName} {vendor.lastName}
                              </CardTitle>
                              <div className="mt-1 flex items-center gap-4">
                                <CardDescription className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3 w-3" />
                                  {vendor.email}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-1 text-sm">
                                  <FileText className="h-3 w-3" />
                                  {vendor.document}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                          {selectedVendorId === vendor.id && (
                            <Badge variant="default" className="bg-blue-600 text-white">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </>
              ) : vendors.length === 0 && !isLoadingVendors ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No hay vendedores disponibles
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron vendedores activos en el sistema
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No se encontraron resultados
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedVendorId
                ? `Listo para asignar a ${leadIds.length} lead(s)`
                : 'Selecciona un vendedor para continuar'}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isAssigning}
                className="min-w-[80px]"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedVendorId || isAssigning || isLoadingVendors}
                className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Asignar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
