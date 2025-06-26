'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SortAsc, SortDesc, X, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface Props {
  order: 'ASC' | 'DESC';
  onSearchChange?: (search: string) => void;
}

export default function PagosFilters({ order: initialOrder, onSearchChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados del filtro
  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [searchTerm, setSearchTerm] = useState('');

  const createQueryString = useCallback(
    (updates: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([name, value]) => {
        if (value === '') {
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

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Llamar al callback para filtrado local
    onSearchChange?.(value);
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setSearchTerm('');
    onSearchChange?.('');
    router.push(pathname);
  };

  const hasActiveFilters = orderValue !== 'DESC' || searchTerm !== '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, vendedor, código..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-white pl-10 dark:bg-gray-900"
          />
        </div>

        {/* Controles de filtro */}
        <div className="flex items-center gap-2">
          {/* Ordenamiento */}
          <Select
            value={orderValue}
            onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
          >
            <SelectTrigger className="w-auto gap-2 bg-white dark:bg-gray-900">
              {orderValue === 'DESC' ? (
                <SortDesc className="h-4 w-4 text-gray-400" />
              ) : (
                <SortAsc className="h-4 w-4 text-gray-400" />
              )}
              <span className="hidden sm:inline">
                {orderValue === 'DESC' ? 'Más recientes' : 'Más antiguos'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Más recientes</SelectItem>
              <SelectItem value="ASC">Más antiguos</SelectItem>
            </SelectContent>
          </Select>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="gap-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              <Search className="h-3 w-3" />
              Búsqueda: {searchTerm}
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {orderValue !== 'DESC' && (
            <Badge variant="secondary" className="gap-1">
              {orderValue === 'ASC' ? (
                <SortAsc className="h-3 w-3" />
              ) : (
                <SortDesc className="h-3 w-3" />
              )}
              Orden: {orderValue === 'ASC' ? 'Más antiguos' : 'Más recientes'}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
