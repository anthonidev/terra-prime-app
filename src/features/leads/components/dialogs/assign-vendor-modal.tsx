'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVendors } from '@/features/vendors/hooks/use-vendors';
import { useAssignVendor } from '../../hooks/use-assign-vendor';

interface AssignVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadIds: string[];
  leadNames?: string[];
}

export function AssignVendorModal({
  open,
  onOpenChange,
  leadIds,
  leadNames,
}: AssignVendorModalProps) {
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const { data: vendors, isLoading: isLoadingVendors } = useVendors();
  const { mutate: assignVendor, isPending } = useAssignVendor();

  const handleAssign = () => {
    if (!selectedVendorId) return;

    assignVendor(
      {
        leadsId: leadIds,
        vendorId: selectedVendorId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedVendorId('');
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      onOpenChange(false);
      setSelectedVendorId('');
    }
  };

  const isMultiple = leadIds.length > 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar {isMultiple ? 'leads' : 'lead'} a vendedor</DialogTitle>
          <DialogDescription>
            {isMultiple ? (
              <>
                Selecciona un vendedor para asignar {leadIds.length} leads
                {leadNames && leadNames.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-foreground font-medium">Leads seleccionados:</p>
                    <ul className="list-inside list-disc text-sm">
                      {leadNames.slice(0, 5).map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                      {leadNames.length > 5 && <li>y {leadNames.length - 5} más...</li>}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                Selecciona un vendedor para asignar el lead
                {leadNames && leadNames[0] && (
                  <span className="text-foreground font-medium"> &quot;{leadNames[0]}&quot;</span>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vendedor</label>
            <Select
              value={selectedVendorId}
              onValueChange={setSelectedVendorId}
              disabled={isLoadingVendors || isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un vendedor" />
              </SelectTrigger>
              <SelectContent>
                {vendors?.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={vendor.photo} />
                        <AvatarFallback className="text-xs">
                          {vendor.firstName[0]}
                          {vendor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {vendor.firstName} {vendor.lastName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleAssign} disabled={!selectedVendorId || isPending}>
            {isPending ? 'Asignando...' : 'Asignar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
