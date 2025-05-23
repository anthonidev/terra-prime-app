'use client';

import { Input } from '@/components/ui/input';
import { Search, SortAsc, SortDesc, Activity } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface LeadSourcesTableFiltersProps {
  search: string;
  isActive: boolean | undefined;
  order: 'ASC' | 'DESC';
}

export function LeadSourcesTableFilters({ search, isActive, order }: LeadSourcesTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a function to update the search params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Reset to page 1 when filtering
      if (name !== 'page') {
        params.set('page', '1');
      }

      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('search', value)}`);
  };

  const handleIsActiveChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('isActive', value === 'all' ? '' : value)}`);
  };

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    router.push(`${pathname}?${createQueryString('order', value)}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-80">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar fuentes..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="bg-background border-input pl-9"
        />
      </div>
      <Select
        value={isActive === undefined ? 'all' : isActive.toString()}
        onValueChange={handleIsActiveChange}
      >
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
      <Select value={order} onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}>
        <SelectTrigger className="bg-background border-input w-[160px]">
          {order === 'DESC' ? (
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
