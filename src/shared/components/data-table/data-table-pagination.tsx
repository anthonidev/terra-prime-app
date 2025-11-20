'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { PaginationMeta } from '@/shared/types/pagination';

interface DataTablePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({ meta, onPageChange }: DataTablePaginationProps) {
  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Si solo hay 1 página o menos, mostrar mensaje simple
  if (totalPages <= 1) {
    return (
      <div className="bg-card flex w-full items-center justify-center border-t px-4 py-4">
        <p className="text-muted-foreground text-sm whitespace-nowrap">
          Mostrando {totalItems} registro{totalItems !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const delta = 2; // Páginas a mostrar antes y después de la actual
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Siempre mostrar primera página
    range.push(1);

    // Páginas alrededor de la actual
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Siempre mostrar última página
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Agregar ellipsis donde sea necesario
    let prev = 0;
    for (const page of range) {
      if (typeof page === 'number') {
        if (page - prev > 1) {
          rangeWithDots.push('ellipsis');
        }
        rangeWithDots.push(page);
        prev = page;
      }
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-card flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Información de registros */}
      <div className="text-muted-foreground text-center text-sm sm:text-left">
        Mostrando{' '}
        <span className="text-foreground font-medium">
          {startItem} - {endItem}
        </span>{' '}
        de <span className="text-foreground font-medium">{totalItems}</span> resultados
      </div>

      {/* Paginación */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          {/* Botón Anterior */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {/* Números de página */}
          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className=" " />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Botón Siguiente */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
