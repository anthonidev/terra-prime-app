'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SortAsc, SortDesc, X, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition, useEffect } from 'react';

interface PagosFiltersProps {
  order: 'ASC' | 'DESC';
}

export default function PagosFilters({ order: initialOrder }: PagosFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        startTransition(() => {
          router.push(`${pathname}?${createQueryString({ search: searchTerm })}`);
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ order: value })}`);
    });
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setSearchTerm('');
    startTransition(() => {
      router.push(pathname);
    });
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white pl-10 dark:bg-gray-900"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={orderValue}
            onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
            disabled={isPending}
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

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="gap-2 text-gray-500 hover:text-gray-700"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              <Search className="h-3 w-3" />
              Búsqueda: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
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
