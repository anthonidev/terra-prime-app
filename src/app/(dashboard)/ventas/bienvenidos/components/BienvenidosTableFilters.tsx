'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SortAsc, SortDesc, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface BienvenidosTableFiltersProps {
  order: 'ASC' | 'DESC';
}

export default function BienvenidosTableFilters({
  order: initialOrder
}: BienvenidosTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    router.push(pathname);
  };

  const hasActiveFilters = orderValue !== 'DESC';

  return (
    <div className="space-y-3">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-3 text-sm"
          >
            <X className="mr-1 h-3 w-3" />
            Limpiar filtros
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
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
