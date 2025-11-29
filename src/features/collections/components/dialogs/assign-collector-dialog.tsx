'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useActiveCollectors } from '../../hooks/use-active-collectors';
import { useAssignClients } from '../../hooks/use-assign-clients';

interface AssignCollectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientIds: number[];
  onSuccess?: () => void;
}

export function AssignCollectorDialog({
  open,
  onOpenChange,
  clientIds,
  onSuccess,
}: AssignCollectorDialogProps) {
  const [collectorId, setCollectorId] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);
  const { data: collectors, isLoading: isLoadingCollectors } = useActiveCollectors();
  const { mutate: assignClients, isPending: isAssigning } = useAssignClients();

  const handleAssign = () => {
    if (!collectorId) return;

    assignClients(
      { clientsId: clientIds, collectorId },
      {
        onSuccess: () => {
          onOpenChange(false);
          setCollectorId('');
          onSuccess?.();
        },
      }
    );
  };

  const selectedCollector = collectors?.find((c) => c.id === collectorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-visible sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Cobrador</DialogTitle>
          <DialogDescription>
            Selecciona un cobrador para asignar a los {clientIds.length} cliente(s) seleccionado(s).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Cobrador</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedCollector
                    ? `${selectedCollector.firstName} ${selectedCollector.lastName}`
                    : 'Seleccionar cobrador...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Buscar cobrador..." />
                  <CommandList>
                    {isLoadingCollectors ? (
                      <div className="text-muted-foreground py-6 text-center text-sm">
                        Cargando cobradores...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No se encontraron cobradores.</CommandEmpty>
                        <CommandGroup>
                          {collectors?.map((collector) => (
                            <CommandItem
                              key={collector.id}
                              value={`${collector.firstName} ${collector.lastName} ${collector.email}`}
                              onSelect={() => {
                                setCollectorId(collector.id);
                                setOpenCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  collectorId === collector.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>
                                  {collector.firstName} {collector.lastName}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {collector.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAssigning}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!collectorId || isAssigning}>
            {isAssigning ? 'Asignando...' : 'Asignar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
