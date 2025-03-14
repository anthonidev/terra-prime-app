import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadSource } from "@/types/leads.types";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
interface PaginatedData {
  success: boolean;
  data: LeadSource[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
interface LeadSourcesTablePaginationProps {
  data: PaginatedData;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}
export default function LeadSourcesTablePagination({
  data,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: LeadSourcesTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[160px] bg-background border-input">
            <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
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
            <span className="font-medium text-foreground">
              {data.meta.totalItems}
            </span>
            fuentes
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="border-input hover:bg-accent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">
            Página
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            de
            <span className="font-medium text-foreground">
              {data.meta.totalPages}
            </span>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(data.meta.totalPages, currentPage + 1))
          }
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
