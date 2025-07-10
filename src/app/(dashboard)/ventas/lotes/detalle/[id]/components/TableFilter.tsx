'use client';

import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { SortAsc, SortDesc, X, Square } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface TableFiltersProps {
  order: 'ASC' | 'DESC';
  status: 'Activo' | 'Vendido' | 'Inactivo';
}

export default function TableFilter({
  order: initialOrder,
  status: initialStatus
}: TableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [statusFilter, setStatusFilter] = useState<'Activo' | 'Vendido' | 'Inactivo' | 'all'>(
    initialStatus === 'Activo' || initialStatus === 'Vendido' || initialStatus === 'Inactivo'
      ? initialStatus
      : 'all'
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as 'Activo' | 'Vendido' | 'Inactivo' | 'all';
    setStatusFilter(newStatus);
    router.push(`${pathname}?${createQueryString({ status: value })}`);
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setStatusFilter('all');
    setShowAdvancedFilters(false);
    router.push(pathname);
  };

  const hasActiveFilters = orderValue !== 'DESC' || statusFilter !== 'all';

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'Activo';
      case 'Inactivo':
        return 'Inactivo';
      case 'Vendido':
        return 'Vendido';
      default:
        return 'Todos los estados';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
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

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-auto min-w-[140px] gap-2 bg-white dark:bg-gray-900">
              <Square className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Activo">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Activo
                </div>
              </SelectItem>
              <SelectItem value="Vendido">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  Vendido
                </div>
              </SelectItem>
              <SelectItem value="Inactivo">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  Inactivo
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

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

      {showAdvancedFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado:
              </label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Activo
                    </div>
                  </SelectItem>
                  <SelectItem value="Vendido">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      Vendido
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactivo">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      Inactivo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Square className="h-3 w-3" />
              Estado: {getStatusLabel(statusFilter)}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {orderValue !== 'DESC' && (
            <Badge variant="secondary" className="gap-1">
              <SortAsc className="h-3 w-3" />
              Orden: {orderValue === 'ASC' ? 'Más antiguos' : 'Más recientes'}
              <button
                onClick={() => handleOrderChange('DESC')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
