'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPayment } from '../../types';

interface PaymentsFiltersProps {
  search: string;
  status: StatusPayment | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusPayment | undefined) => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  totalItems?: number;
}

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: StatusPayment.PENDING, label: 'Pendiente' },
  { value: StatusPayment.APPROVED, label: 'Aprobado' },
  { value: StatusPayment.COMPLETED, label: 'Completado' },
  { value: StatusPayment.REJECTED, label: 'Rechazado' },
  { value: StatusPayment.CANCELLED, label: 'Cancelado' },
];

export function PaymentsFilters({
  search,
  status,
  startDate,
  endDate,
  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  totalItems = 0,
}: PaymentsFiltersProps) {
  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onStatusChange(undefined);
    } else {
      onStatusChange(value as StatusPayment);
    }
  };

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusChange(undefined);
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };

  const hasActiveFilters = search || status || startDate || endDate;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, documento, lote o código de operación..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select
                value={status || 'all'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha desde</label>
              <Input
                type="date"
                value={startDate || ''}
                onChange={(e) => onStartDateChange(e.target.value || undefined)}
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha hasta</label>
              <Input
                type="date"
                value={endDate || ''}
                onChange={(e) => onEndDateChange(e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'pago encontrado' : 'pagos encontrados'}
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
