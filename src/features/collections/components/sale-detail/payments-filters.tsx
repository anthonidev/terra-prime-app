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
import { StatusPayment } from '../../types';
import { getShortConceptName } from './payment-concept-config';

interface PaymentsFiltersProps {
  status: StatusPayment | 'ALL';
  onStatusChange: (status: StatusPayment | 'ALL') => void;
  concept: string;
  onConceptChange: (concept: string) => void;
  availableConcepts: string[];
}

const statusLabels: Record<StatusPayment | 'ALL', string> = {
  ALL: 'Todos los estados',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

export function PaymentsFilters({
  status,
  onStatusChange,
  concept,
  onConceptChange,
  availableConcepts,
}: PaymentsFiltersProps) {
  const hasActiveFilters = status !== 'ALL' || concept !== 'ALL';

  const handleClearFilters = () => {
    onStatusChange('ALL');
    onConceptChange('ALL');
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Estado Filter */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">Estado:</span>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value="PENDING">{statusLabels.PENDING}</SelectItem>
              <SelectItem value="APPROVED">{statusLabels.APPROVED}</SelectItem>
              <SelectItem value="COMPLETED">{statusLabels.COMPLETED}</SelectItem>
              <SelectItem value="REJECTED">{statusLabels.REJECTED}</SelectItem>
              <SelectItem value="CANCELLED">{statusLabels.CANCELLED}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Concepto Filter */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">Concepto:</span>
          <Select value={concept} onValueChange={onConceptChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar concepto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los conceptos</SelectItem>
              {availableConcepts.map((c) => (
                <SelectItem key={c} value={c}>
                  {getShortConceptName(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="w-fit">
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
