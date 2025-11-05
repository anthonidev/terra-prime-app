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

interface LeadSourcesFiltersProps {
  search: string;
  isActive: string;
  order: 'ASC' | 'DESC';
  onSearchChange: (search: string) => void;
  onIsActiveChange: (isActive: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function LeadSourcesFilters({
  search,
  isActive,
  order,
  onSearchChange,
  onIsActiveChange,
  onOrderChange,
  onSearchSubmit,
}: LeadSourcesFiltersProps) {
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
            placeholder="Buscar fuente por nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Status Filter */}
        <Select value={isActive} onValueChange={onIsActiveChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Order */}
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
  );
}
