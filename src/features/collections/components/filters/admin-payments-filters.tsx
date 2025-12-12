'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useActiveCollectors } from '../../hooks/use-active-collectors';
import { StatusPayment } from '../../types';

interface AdminPaymentsFiltersProps {
  filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: StatusPayment;
    collectorId?: string;
  };
  onFiltersChange: (filters: any) => void;
}

const statusOptions: { value: StatusPayment | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: StatusPayment.PENDING, label: 'Pendiente' },
  { value: StatusPayment.APPROVED, label: 'Aprobado' },
  { value: StatusPayment.COMPLETED, label: 'Completado' },
  { value: StatusPayment.REJECTED, label: 'Rechazado' },
  { value: StatusPayment.CANCELLED, label: 'Cancelado' },
];

export function AdminPaymentsFilters({ filters, onFiltersChange }: AdminPaymentsFiltersProps) {
  const { data: collectors } = useActiveCollectors();

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search || filters.startDate || filters.endDate || filters.status || filters.collectorId;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-8"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <Select
          value={filters.status || 'ALL'}
          onValueChange={(value) => handleChange('status', value === 'ALL' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Calendar className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="date"
            placeholder="Fecha inicio"
            className="pl-8"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="relative">
          <Calendar className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="date"
            placeholder="Fecha fin"
            className="pl-8"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <Select
          value={filters.collectorId || 'all'}
          onValueChange={(value) =>
            handleChange('collectorId', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Cobrador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cobradores</SelectItem>
            {collectors?.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.firstName} {col.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
