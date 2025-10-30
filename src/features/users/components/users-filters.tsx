'use client';

import { useState } from 'react';
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

import type { UsersQueryParams } from '../types';

interface UsersFiltersProps {
  filters: UsersQueryParams;
  onFiltersChange: (filters: UsersQueryParams) => void;
}

export function UsersFilters({ filters, onFiltersChange }: UsersFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isActive: value === 'all' ? undefined : value === 'active',
      page: 1,
    });
  };

  const handleOrderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      order: value as 'ASC' | 'DESC',
      page: 1,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Búsqueda */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o documento..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>

          {/* Filtro por estado */}
          <Select
            value={
              filters.isActive === undefined
                ? 'all'
                : filters.isActive
                  ? 'active'
                  : 'inactive'
            }
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          {/* Orden */}
          <Select
            value={filters.order || 'DESC'}
            onValueChange={handleOrderChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Más recientes</SelectItem>
              <SelectItem value="ASC">Más antiguos</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón de buscar */}
          <Button type="submit" onClick={handleSearchSubmit}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
