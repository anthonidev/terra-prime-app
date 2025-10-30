'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadsFiltersProps {
  search: string;
  startDate: string;
  endDate: string;
  isInOffice: string;
  order: 'ASC' | 'DESC';
  onSearchChange: (search: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onIsInOfficeChange: (value: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function LeadsFilters({
  search,
  startDate,
  endDate,
  isInOffice,
  order,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onIsInOfficeChange,
  onOrderChange,
  onSearchSubmit,
}: LeadsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar lead por nombre, email o documento..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Start Date */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Fecha inicio</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Fecha fin</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        {/* Is In Office Filter */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Ubicación</label>
          <Select value={isInOffice} onValueChange={onIsInOfficeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las ubicaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ubicaciones</SelectItem>
              <SelectItem value="true">En oficina</SelectItem>
              <SelectItem value="false">Fuera de oficina</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Orden</label>
          <Select value={order} onValueChange={(value) => onOrderChange(value as 'ASC' | 'DESC')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Más antiguos</SelectItem>
              <SelectItem value="DESC">Más recientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
