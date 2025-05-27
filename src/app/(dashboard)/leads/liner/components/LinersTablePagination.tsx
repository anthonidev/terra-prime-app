'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Liner } from '@/types/leads.types';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PaginatedData {
  success: boolean;
  data: Liner[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

interface LinersTablePaginationProps {
  data: PaginatedData;
  currentPage: number;
  itemsPerPage: number;
}

export function LinersTablePagination({
  data,
  currentPage,
  itemsPerPage
}: LinersTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString('page', page.toString())}`);
  };

  const handleItemsPerPageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', value.toString());
    params.set('page', '1'); // Reset to page 1 when changing items per page
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => handleItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="bg-background border-input w-[160px]">
            <ListFilter className="text-muted-foreground mr-2 h-4 w-4" />
            <SelectValue placeholder="Registros por página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">
            Total:
            <span className="text-foreground font-medium">{data.meta.totalItems}</span>
            liners
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="border-input hover:bg-accent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">
            Página
            <span className="text-foreground font-medium">{currentPage}</span> de
            <span className="text-foreground font-medium">{data.meta.totalPages}</span>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.min(data.meta.totalPages, currentPage + 1))}
          disabled={currentPage === data.meta.totalPages}
          className="border-input hover:bg-accent"
        >
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
