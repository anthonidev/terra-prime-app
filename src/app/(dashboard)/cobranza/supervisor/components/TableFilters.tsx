'use client';

import { Button } from '@components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { SortAsc, SortDesc, X, Calendar, User } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

import { getCollectors } from '@infrastructure/server-actions/cobranza.actions';
import { Collector } from '@domain/entities/cobranza';

interface TableFiltersProps {
  order: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  collectorId?: string;
}

export default function TableFilter({
  order: initialOrder,
  startDate,
  endDate,
  collectorId
}: TableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [startDateFilter, setStartDateFilter] = useState<string>(
    startDate || searchParams.get('startDate') || ''
  );
  const [endDateFilter, setEndDateFilter] = useState<string>(
    endDate || searchParams.get('endDate') || ''
  );
  const [collectorFilter, setCollectorFilter] = useState<string>(
    collectorId || searchParams.get('collectorId') || 'all'
  );

  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loadingCollector, setLoadingCollector] = useState(false);

  useEffect(() => {
    const loadCollectors = async () => {
      setLoadingCollector(true);
      try {
        const { items } = await getCollectors();
        setCollectors(items);
      } catch (error) {
        console.error('Error loading collectors:', error);
        setCollectors([]);
      } finally {
        setLoadingCollector(false);
      }
    };
    loadCollectors();
  }, []);

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

  const handleStartDateChange = (value: string) => {
    setStartDateFilter(value);
    router.push(`${pathname}?${createQueryString({ startDate: value })}`);
  };

  const handleEndDateChange = (value: string) => {
    setEndDateFilter(value);
    router.push(`${pathname}?${createQueryString({ endDate: value })}`);
  };

  const handleCollectorChange = (value: string) => {
    setCollectorFilter(value);
    router.push(`${pathname}?${createQueryString({ collectorId: value })}`);
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setStartDateFilter('');
    setEndDateFilter('');
    setCollectorFilter('all');
    router.push(pathname);
  };

  const hasActiveFilters =
    orderValue !== 'DESC' ||
    startDateFilter !== '' ||
    endDateFilter !== '' ||
    collectorFilter !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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

          <Select
            value={collectorFilter}
            onValueChange={handleCollectorChange}
            disabled={loadingCollector}
          >
            <SelectTrigger className="w-auto gap-2 bg-white dark:bg-gray-900">
              <User className="h-4 w-4 text-gray-400" />
              <span className="hidden sm:inline">
                {collectorFilter === 'all' ? 'Todos los cobradores' : 'Cobrador'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cobradores</SelectItem>
              {collectors.map((collector) => (
                <SelectItem key={collector.id} value={collector.id}>
                  {collector.firstName} {collector.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="date"
              placeholder="Fecha inicio"
              value={startDateFilter}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-auto min-w-[160px] bg-white pl-10 dark:bg-gray-900"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="date"
              placeholder="Fecha fin"
              value={endDateFilter}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-auto min-w-[160px] bg-white pl-10 dark:bg-gray-900"
            />
          </div>

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

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {startDateFilter !== '' && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Fecha inicio: {new Date(startDateFilter).toLocaleDateString('es-PE')}
              <button
                onClick={() => handleStartDateChange('')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {endDateFilter !== '' && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Fecha fin: {new Date(endDateFilter).toLocaleDateString('es-PE')}
              <button
                onClick={() => handleEndDateChange('')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {collectorFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              Cobrador: {collectors.find((c) => c.id === collectorFilter)?.firstName}{' '}
              {collectors.find((c) => c.id === collectorFilter)?.lastName}
              <button
                onClick={() => handleCollectorChange('all')}
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
