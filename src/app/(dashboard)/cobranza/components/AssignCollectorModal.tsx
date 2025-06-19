'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Loader2, RefreshCw, Search, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  getCollectors,
  onAssignClientsCollector
} from '@infrastructure/server-actions/cobranza.actions';
import { Collector } from '@domain/entities/cobranza';

interface Props {
  clientsId: number[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignCollectorModal({ clientsId, isOpen, onClose }: Props) {
  const router = useRouter();
  const [selectedCollectorId, setSelectedCollectorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [isLoadingCollectors, setIsLoadingCollectors] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const filtered = useMemo(() => {
    if (!Array.isArray(collectors)) return [];
    return collectors.filter(
      (collector) =>
        `${collector.firstName} ${collector.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        collector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collector.document.includes(searchTerm)
    );
  }, [collectors, searchTerm]);

  const loadVendors = useCallback(async () => {
    if (collectors.length > 0) return;
    setIsLoadingCollectors(true);

    try {
      const { items } = await getCollectors();
      setCollectors(items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar cobradores';
      toast.error(errorMessage);
    } finally {
      setIsLoadingCollectors(false);
    }
  }, [collectors.length]);

  const handleAssign = async () => {
    if (!selectedCollectorId) {
      toast.error('Por favor selecciona un cobrador');
      return;
    }
    setIsAssigning(true);
    try {
      await onAssignClientsCollector({
        clientsId: clientsId,
        collectorId: selectedCollectorId
      });

      const isReassignment = clientsId.length === 1;
      const actionText = isReassignment ? 'reasignado' : 'asignado';

      toast.success(`Cobradores ${actionText} correctamente a ${clientsId.length} lead(s)`);
      handleClose();
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar cobrador';
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    if (!isAssigning) {
      setSelectedCollectorId(null);
      setSearchTerm('');
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) loadVendors();
  }, [isOpen, loadVendors]);

  const selectedCollector = collectors.find((v) => v.id === selectedCollectorId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col p-0">
        <DialogHeader className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {clientsId.length === 1
                  ? 'Asignar/Reasignar cobrador'
                  : 'Asignar cobrador a clientes'}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecciona un cobrador para&nbsp;
                {clientsId.length === 1
                  ? 'asignar o reasignar a este cliente'
                  : `asignar a ${clientsId.length} cliente(s)`}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="space-y-4 p-6">
            <div className="relative bg-white dark:bg-gray-900">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar cobrador por nombre, email o documento..."
                className="h-10 pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoadingCollectors || isAssigning}
              />
            </div>
            {selectedCollector && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Cobrador seleccionado
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedCollector.firstName} {selectedCollector.lastName} •&nbsp;
                      {selectedCollector.email}
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
              {isLoadingCollectors ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Cargando cobradores...</p>
                  </div>
                </div>
              ) : filtered.length > 0 ? (
                <>
                  <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Cobradores disponibles ({filtered.length})
                  </div>
                  {filtered.map((vendor) => (
                    <div
                      key={vendor.id}
                      className={`group relative cursor-pointer rounded-lg border bg-white p-3 transition-all dark:bg-gray-900 ${
                        selectedCollectorId === vendor.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-950/30 dark:ring-blue-800'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedCollectorId(vendor.id)}
                    >
                      <div className="absolute top-3 right-3">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            selectedCollectorId === vendor.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 group-hover:border-blue-400'
                          }`}
                        >
                          {selectedCollectorId === vendor.id && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pr-6">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                            selectedCollectorId === vendor.id
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          <User className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4
                            className={`truncate font-semibold ${
                              selectedCollectorId === vendor.id
                                ? 'text-blue-900 dark:text-blue-100'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {vendor.firstName} {vendor.lastName}
                          </h4>
                          <div className="mt-1 space-y-1">
                            <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                              {vendor.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Doc: {vendor.document}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 rounded-lg transition-opacity ${
                          selectedCollectorId === vendor.id
                            ? 'bg-blue-500/5'
                            : 'bg-transparent group-hover:bg-blue-500/3'
                        }`}
                      />
                    </div>
                  ))}
                </>
              ) : collectors.length === 0 && !isLoadingCollectors ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No hay cobradores disponibles
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron cobradores activos en el sistema
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
        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCollectorId
                ? `Listo para ${clientsId.length === 1 ? 'asignar/reasignar' : 'asignar'} a ${clientsId.length} lead(s)`
                : 'Selecciona un cobrador para continuar'}
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
                disabled={!selectedCollectorId || isAssigning || isLoadingCollectors}
                className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {clientsId.length === 1 ? 'Asignando...' : 'Asignando...'}
                  </>
                ) : (
                  <>
                    {clientsId.length === 1 ? (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    {clientsId.length === 1 ? 'Asignar/Reasignar' : 'Asignar'}
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
