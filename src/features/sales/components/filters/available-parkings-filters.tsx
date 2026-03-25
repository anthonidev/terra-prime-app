'use client';

import { Search, ArrowUpDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AvailableParkingsFiltersProps {
  term: string;
  order: 'ASC' | 'DESC';
  onTermChange: (term: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function AvailableParkingsFilters({
  term,
  order,
  onTermChange,
  onOrderChange,
  onSearchSubmit,
}: AvailableParkingsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Buscar cochera por nombre..."
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            className="focus-visible:ring-primary/30 h-9 pl-9 text-sm transition-all"
          />
        </div>
        <Button type="submit" size="sm" className="h-9 px-4 shadow-sm">
          <Search className="mr-2 h-3.5 w-3.5" />
          Buscar
        </Button>
      </form>

      {/* Order */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Orden
          </label>
          <Select value={order} onValueChange={(value) => onOrderChange(value as 'ASC' | 'DESC')}>
            <SelectTrigger className="focus:ring-primary/30 h-9 text-sm transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Ascendente</SelectItem>
              <SelectItem value="DESC">Descendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
