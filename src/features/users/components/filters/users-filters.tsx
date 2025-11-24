'use client';

import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

import type { UsersQueryParams } from '../../types';

interface UsersFiltersProps {
  filters: UsersQueryParams;
  onFiltersChange: (filters: UsersQueryParams) => void;
}

export function UsersFilters({ filters, onFiltersChange }: UsersFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search to avoid firing on every keystroke when typing fast
  useEffect(() => {
    const handler = setTimeout(() => {
      if ((filters.search || '') !== searchInput) {
        onFiltersChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 500);

    return () => clearTimeout(handler);
    // Include filters to keep other filter changes in sync; guard prevents redundant calls
  }, [searchInput, filters, onFiltersChange]);

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
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o documento..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Immediate search on Enter, bypassing debounce
                    e.preventDefault();
                    if ((filters.search || '') !== searchInput) {
                      onFiltersChange({ ...filters, search: searchInput, page: 1 });
                    }
                  }
                }}
                className="bg-background border-input focus-visible:ring-primary/20 h-10 pl-9 transition-all"
                aria-label="Buscar usuarios"
              />
            </div>
          </div>

          {/* Filtros Group */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Filtro por estado */}
            <Select
              value={
                filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'
              }
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="bg-background border-input focus:ring-primary/20 h-10 w-full transition-all md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            {/* Orden */}
            <Select value={filters.order || 'DESC'} onValueChange={handleOrderChange}>
              <SelectTrigger className="bg-background border-input focus:ring-primary/20 h-10 w-full transition-all md:w-[180px]">
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Más recientes</SelectItem>
                <SelectItem value="ASC">Más antiguos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
