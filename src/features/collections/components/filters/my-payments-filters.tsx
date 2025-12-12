'use client';

import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MyPaymentsFiltersProps {
  filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function MyPaymentsFilters({ filters, onFiltersChange }: MyPaymentsFiltersProps) {
  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.startDate || filters.endDate;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-8"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

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
