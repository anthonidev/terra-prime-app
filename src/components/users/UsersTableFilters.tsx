import { Input } from "@/components/ui/input";
import { Search, SortAsc, SortDesc, User2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface UsersTableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isActive: boolean | undefined;
  onIsActiveChange: (value: boolean | undefined) => void;
  order: "ASC" | "DESC";
  onOrderChange: (value: "ASC" | "DESC") => void;
}
export function UsersTableFilters({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
  order,
  onOrderChange,
}: UsersTableFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background border-input"
        />
      </div>
      <Select
        value={isActive === undefined ? "all" : isActive.toString()}
        onValueChange={(value) => {
          onIsActiveChange(
            value === "all" ? undefined : value === "true" ? true : false
          );
        }}
      >
        <SelectTrigger className="w-[160px] bg-background border-input">
          <User2 className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={order}
        onValueChange={(value: "ASC" | "DESC") => onOrderChange(value)}
      >
        <SelectTrigger className="w-[160px] bg-background border-input">
          {order === "DESC" ? (
            <SortDesc className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : (
            <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
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
