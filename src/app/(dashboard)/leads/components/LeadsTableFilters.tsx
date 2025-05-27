'use client';

import { Input } from '@/components/ui/input';
import { Search, SortAsc, SortDesc, MapPin, Calendar, FilterX } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface LeadsTableFiltersProps {
  search: string;
  isInOffice: boolean | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  order: 'ASC' | 'DESC';
}

export function LeadsTableFilters({
  search: initialSearch,
  isInOffice: initialIsInOffice,
  startDate: initialStartDate,
  endDate: initialEndDate,
  order: initialOrder
}: LeadsTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados locales para controlar los inputs
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [isInOfficeValue, setIsInOfficeValue] = useState<string>(
    initialIsInOffice === undefined ? 'all' : initialIsInOffice.toString()
  );
  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined
  });

  const hasActiveFilters =
    searchValue || isInOfficeValue !== 'all' || dateRange.from || dateRange.to;

  // Función para crear query string actualizado
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

      // Siempre resetear a página 1 cuando se aplican filtros
      params.set('page', '1');

      return params.toString();
    },
    [searchParams]
  );

  // Debounce para búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const timeoutId = setTimeout(() => {
      router.push(`${pathname}?${createQueryString({ search: value })}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleIsInOfficeChange = (value: string) => {
    setIsInOfficeValue(value);
    router.push(`${pathname}?${createQueryString({ isInOffice: value === 'all' ? '' : value })}`);
  };

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const handleCalendarChange = (range: { from?: Date; to?: Date }) => {
    setDateRange({
      from: range.from ?? undefined,
      to: range.to ?? undefined
    });

    const updates: { [key: string]: string } = {};
    if (range.from) updates.startDate = range.from.toISOString();
    if (range.to) updates.endDate = range.to.toISOString();

    router.push(`${pathname}?${createQueryString(updates)}`);
  };

  const resetFilters = () => {
    setSearchValue('');
    setIsInOfficeValue('all');
    setOrderValue('DESC');
    setDateRange({ from: undefined, to: undefined });
    router.push(pathname);
  };

  return (
    <div className="bg-card rounded-md border p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <FilterX className="text-primary h-4 w-4" />
          Filtros de búsqueda
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Filtros activos
            </Badge>
          )}
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
            <FilterX className="mr-1 h-3.5 w-3.5" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre o documento..."
            value={searchValue}
            onChange={handleSearchChange}
            className="bg-background border-input pl-9"
          />
        </div>

        <Select value={isInOfficeValue} onValueChange={handleIsInOfficeChange}>
          <SelectTrigger className="bg-background border-input">
            <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
            <SelectValue placeholder="Estado de visita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">En oficina</SelectItem>
            <SelectItem value="false">No en oficina</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                (dateRange.from || dateRange.to) && 'text-primary'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'dd/MM/yyyy', { locale: es })} -{' '}
                    {format(dateRange.to, 'dd/MM/yyyy', { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, 'dd/MM/yyyy', { locale: es })
                )
              ) : (
                'Seleccionar fechas'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) =>
                handleCalendarChange(range ?? { from: undefined, to: undefined })
              }
              numberOfMonths={2}
              locale={es}
            />
            <div className="flex justify-end gap-2 border-t p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  router.push(`${pathname}?${createQueryString({ startDate: '', endDate: '' })}`);
                }}
              >
                Limpiar
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={orderValue}
          onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
        >
          <SelectTrigger className="bg-background border-input">
            {orderValue === 'DESC' ? (
              <SortDesc className="text-muted-foreground mr-2 h-4 w-4" />
            ) : (
              <SortAsc className="text-muted-foreground mr-2 h-4 w-4" />
            )}
            <SelectValue placeholder="Ordenar por" />
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
