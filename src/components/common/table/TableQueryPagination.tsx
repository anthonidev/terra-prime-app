import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PaginatedMeta } from '@/types/global/utils.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  meta: PaginatedMeta;
}

export function TableQueryPagination({
  meta: { currentPage, itemsPerPage, totalItems, totalPages }
}: TablePaginationProps) {
  const pageIndex = currentPage - 1;
  const pageCount = totalPages;
  const pagination = {
    pageIndex,
    pageSize: itemsPerPage
  };
  const canNextPage = currentPage >= totalPages;
  const canPreviousPage = currentPage <= 1;

  const onPageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url.toString());
  };
  const onPageSizeChange = (newSize: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', newSize.toString());
    window.history.pushState({}, '', url.toString());
  };

  const previousPage = () => {
    if (pageIndex > 0) {
      onPageChange(pageIndex);
    }
  };

  const nextPage = () => {
    if (pageIndex < pageCount - 1) {
      onPageChange(pageIndex + 2);
    }
  };

  const setPageSize = (size: number) => {
    onPageSizeChange(size);
  };

  const setPageIndex = (index: number) => {
    onPageChange(index + 1);
  };

  if (pageCount <= 1) {
    return (
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <p className="text-muted-foreground text-sm whitespace-nowrap">
          Mostrando {totalItems} registro{totalItems !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <p className="text-muted-foreground text-sm whitespace-nowrap">Mostrar</p>
        <Select
          value={`${pagination.pageSize}`}
          onValueChange={(value) => {
            setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm whitespace-nowrap">de {totalItems} registros</p>
      </div>

      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => previousPage()}
            disabled={canPreviousPage}
            className="text-muted-foreground h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
              const pageNumber =
                pageIndex < 3
                  ? i + 1
                  : pageIndex > pageCount - 3
                    ? pageCount - 4 + i
                    : pageIndex - 2 + i;

              if (pageNumber > pageCount) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === pageIndex + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPageIndex(pageNumber - 1)}
                  className={`h-8 w-8 p-0 ${
                    pageNumber === pageIndex + 1
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground'
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center px-2 sm:hidden">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {pagination.pageIndex + 1} / {pageCount}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => nextPage()}
            disabled={canNextPage}
            className="text-muted-foreground h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-muted-foreground ml-2 hidden text-sm whitespace-nowrap lg:block">
          Página {pagination.pageIndex + 1} de {pageCount}
        </div>
      </div>
    </div>
  );
}
