'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Activity, Search, SortAsc, SortDesc, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface LinersTableFiltersProps {
  search: string;
  isActive: boolean | undefined;
  order: 'ASC' | 'DESC';
}

export function LinersTableFilters({
  search: initialSearch,
  isActive: initialIsActive,
  order: initialOrder
}: LinersTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [activeValue, setActiveValue] = useState<string>(
    initialIsActive === undefined ? 'all' : initialIsActive.toString()
  );
  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);

  const createQueryString = useCallback(
    (updates: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([name, value]) => {
        if (value === '' || value === 'all') {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });

      params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const timeoutId = setTimeout(() => {
      router.push(`${pathname}?${createQueryString({ search: value })}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleIsActiveChange = (value: string) => {
    setActiveValue(value);
    router.push(`${pathname}?${createQueryString({ isActive: value === 'all' ? '' : value })}`);
  };

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    setActiveValue('all');
    setOrderValue('DESC');
    router.push(pathname);
  };

  const hasActiveFilters = searchValue || activeValue !== 'all' || orderValue !== 'DESC';

  return (
    <div className="space-y-3">
      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-3 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="mr-1 h-3 w-3" />
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Controles de filtros */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Campo de búsqueda */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o documento..."
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Filtro de estado */}
        <Select value={activeValue} onValueChange={handleIsActiveChange}>
          <SelectTrigger>
            <div className="flex items-center">
              <Activity className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Estado" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de orden */}
        <Select
          value={orderValue}
          onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
        >
          <SelectTrigger>
            <div className="flex items-center">
              {orderValue === 'DESC' ? (
                <SortDesc className="mr-2 h-4 w-4 text-gray-400" />
              ) : (
                <SortAsc className="mr-2 h-4 w-4 text-gray-400" />
              )}
              <SelectValue placeholder="Ordenar por" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Más recientes</SelectItem>
            <SelectItem value="ASC">Más antiguos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
