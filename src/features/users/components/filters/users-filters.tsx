'use client';

import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { UsersQueryParams } from '../../types';
import { useRoles } from '../../hooks/use-roles';

interface UsersFiltersProps {
  filters: UsersQueryParams;
  onFiltersChange: (filters: UsersQueryParams) => void;
}

export function UsersFilters({ filters, onFiltersChange }: UsersFiltersProps) {
  const { data: roles } = useRoles();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if ((filters.search || '') !== searchInput) {
        onFiltersChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 500);

    return () => clearTimeout(handler);
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

  const handleRoleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      roleId: value === 'all' ? undefined : Number(value),
      page: 1,
    });
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
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

          <div className="flex flex-col gap-3 sm:flex-row">
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

            <Select
              value={filters.roleId ? String(filters.roleId) : 'all'}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="bg-background border-input focus:ring-primary/20 h-10 w-full transition-all md:w-[180px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
