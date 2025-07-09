'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  SortAsc,
  SortDesc,
  X,
  Search,
  Filter,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TableFiltersProps {
  order: 'ASC' | 'DESC';
}

export default function TableFilters({ order: initialOrder }: TableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        router.push(`${pathname}?${createQueryString({ search: searchTerm })}`);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    router.push(`${pathname}?${createQueryString({ status: value })}`);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    router.push(`${pathname}?${createQueryString({ type: value })}`);
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    router.push(
      `${pathname}?${createQueryString({
        dateFrom: date ? format(date, 'yyyy-MM-dd') : ''
      })}`
    );
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    router.push(
      `${pathname}?${createQueryString({
        dateTo: date ? format(date, 'yyyy-MM-dd') : ''
      })}`
    );
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setShowAdvancedFilters(false);
    router.push(pathname);
  };

  const hasActiveFilters =
    orderValue !== 'DESC' ||
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    dateFrom ||
    dateTo;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (orderValue !== 'DESC') count++;
    if (searchTerm !== '') count++;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, vendedor, lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white pl-10 dark:bg-gray-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

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
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="h-4 w-4" />
              Estado
            </label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="IN_PAYMENT_PROCESS">En proceso de pago</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pendiente de aprobación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4" />
              Tipo
            </label>
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="FINANCED">Financiado</SelectItem>
                <SelectItem value="DIRECT">Directo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              Desde
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start bg-white text-left font-normal dark:bg-gray-900',
                    !dateFrom && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Seleccionar'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={handleDateFromChange}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              Hasta
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start bg-white text-left font-normal dark:bg-gray-900',
                    !dateTo && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Seleccionar'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={handleDateToChange}
                  disabled={(date) => date > new Date() || (dateFrom ? date < dateFrom : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

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

          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <DollarSign className="h-3 w-3" />
              Estado:{' '}
              {statusFilter === 'COMPLETED'
                ? 'Completada'
                : statusFilter === 'PENDING'
                  ? 'Pendiente'
                  : statusFilter === 'IN_PAYMENT_PROCESS'
                    ? 'En proceso'
                    : 'Pendiente aprobación'}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Building2 className="h-3 w-3" />
              Tipo: {typeFilter === 'FINANCED' ? 'Financiado' : 'Directo'}
              <button
                onClick={() => handleTypeChange('all')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateFrom && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Desde: {format(dateFrom, 'dd/MM/yyyy')}
              <button
                onClick={() => handleDateFromChange(undefined)}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateTo && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Hasta: {format(dateTo, 'dd/MM/yyyy')}
              <button
                onClick={() => handleDateToChange(undefined)}
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
