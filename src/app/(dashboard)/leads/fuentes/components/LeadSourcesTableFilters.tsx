'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Activity, Search, SortAsc, SortDesc } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface LeadSourcesTableFiltersProps {
  search: string;
  isActive: boolean | undefined;
  order: 'ASC' | 'DESC';
}

export function LeadSourcesTableFilters({
  search: initialSearch,
  isActive: initialIsActive,
  order: initialOrder
}: LeadSourcesTableFiltersProps) {
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

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-80">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar fuentes..."
          value={searchValue}
          onChange={handleSearchChange}
          className="bg-background border-input pl-9"
        />
      </div>
      <Select value={activeValue} onValueChange={handleIsActiveChange}>
        <SelectTrigger className="bg-background border-input w-[160px]">
          <Activity className="text-muted-foreground mr-2 h-4 w-4" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={orderValue}
        onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
      >
        <SelectTrigger className="bg-background border-input w-[160px]">
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
  );
}
