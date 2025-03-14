import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
} from "lucide-react";

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
  onItemsPerPageChange,
}: LeadsTablePaginationProps) {
  // No mostrar paginación si no hay páginas o solo hay una
  if (!meta.totalPages || meta.totalPages < 2) {
    return (
      <div className="flex justify-between items-center py-3 px-4 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {meta.totalItems}{" "}
          {meta.totalItems === 1 ? "resultado" : "resultados"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 border-t">
      <div className="flex items-center space-x-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[180px] bg-background border-input h-8">
            <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
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
            Total:{" "}
            <span className="font-medium text-foreground">
              {meta.totalItems}
            </span>{" "}
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
          className="h-8 w-8 hidden sm:flex"
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
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0" />
          <span className="sm:hidden">Anterior</span>
        </Button>

        <div className="flex items-center text-sm px-2">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{currentPage}</span>
            {" / "}
            <span className="font-medium text-foreground">
              {meta.totalPages}
            </span>
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(meta.totalPages, currentPage + 1))
          }
          disabled={currentPage === meta.totalPages}
          className="h-8"
        >
          <span className="sm:hidden">Siguiente</span>
          <ChevronRight className="h-4 w-4 ml-1 sm:ml-0" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(meta.totalPages)}
          disabled={currentPage === meta.totalPages}
          className="h-8 w-8 hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
