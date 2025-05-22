import { Input } from '@/components/ui/input';
import { Search, SortAsc, SortDesc, User2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface UsersTableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isActive: boolean | undefined;
  onIsActiveChange: (value: boolean | undefined) => void;
  order: 'ASC' | 'DESC';
  onOrderChange: (value: 'ASC' | 'DESC') => void;
}

export function UsersTableFilters({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
  order,
  onOrderChange
}: UsersTableFiltersProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-input bg-white pl-9 dark:bg-gray-900"
        />
      </div>

      <Select
        value={isActive === undefined ? 'all' : isActive.toString()}
        onValueChange={(value) => {
          onIsActiveChange(value === 'all' ? undefined : value === 'true' ? true : false);
        }}
      >
        <SelectTrigger className="border-input bg-white dark:bg-gray-900">
          <User2 className="text-muted-foreground mr-2 h-4 w-4" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={(value: 'ASC' | 'DESC') => onOrderChange(value)}>
        <SelectTrigger className="border-input bg-white dark:bg-gray-900">
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
