'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { StatusFinancingInstallments } from '../../types';

interface InstallmentsFilterProps {
  status: StatusFinancingInstallments | 'ALL';
  onStatusChange: (status: StatusFinancingInstallments | 'ALL') => void;
}

const statusLabels: Record<StatusFinancingInstallments | 'ALL', string> = {
  ALL: 'Todos los estados',
  PENDING: 'Pendiente',
  EXPIRED: 'Vencida',
  PAID: 'Pagada',
};

export function InstallmentsFilter({ status, onStatusChange }: InstallmentsFilterProps) {
  const hasActiveFilter = status !== 'ALL';

  const handleClearFilter = () => {
    onStatusChange('ALL');
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">Estado:</span>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="PENDING">{statusLabels.PENDING}</SelectItem>
            <SelectItem value="EXPIRED">{statusLabels.EXPIRED}</SelectItem>
            <SelectItem value="PAID">{statusLabels.PAID}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filter Button */}
      {hasActiveFilter && (
        <Button variant="ghost" size="sm" onClick={handleClearFilter} className="w-fit">
          <X className="mr-2 h-4 w-4" />
          Limpiar filtro
        </Button>
      )}
    </div>
  );
}
