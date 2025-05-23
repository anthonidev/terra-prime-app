import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ListFilter } from 'lucide-react';
interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
interface LeadsTablePaginationProps {
  meta: PaginatedMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}
export default function LeadsTablePagination({
  meta,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}: LeadsTablePaginationProps) {
  if (!meta.totalPages || meta.totalPages < 2) {
    return (
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="text-muted-foreground text-sm">
          Mostrando {meta.totalItems} {meta.totalItems === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between gap-4 border-t px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex items-center space-x-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="bg-background border-input h-8 w-[180px]">
            <ListFilter className="text-muted-foreground mr-2 h-4 w-4" />
            <SelectValue placeholder="Registros por página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50, 100].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">
            Total:
            <span className="text-foreground font-medium">{meta.totalItems}</span>
            resultados
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden h-8 w-8 sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8"
        >
          <ChevronLeft className="mr-1 h-4 w-4 sm:mr-0" />
          <span className="sm:hidden">Anterior</span>
        </Button>
        <div className="flex items-center px-2 text-sm">
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">{currentPage}</span>
            {' / '}
            <span className="text-foreground font-medium">{meta.totalPages}</span>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(meta.totalPages, currentPage + 1))}
          disabled={currentPage === meta.totalPages}
          className="h-8"
        >
          <span className="sm:hidden">Siguiente</span>
          <ChevronRight className="ml-1 h-4 w-4 sm:ml-0" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.totalPages)}
          disabled={currentPage === meta.totalPages}
          className="hidden h-8 w-8 sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
