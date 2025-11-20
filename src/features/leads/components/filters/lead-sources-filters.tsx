'use client';

import { ArrowDownUp, CheckCircle2, Search, XCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadSourcesFiltersProps {
  search: string;
  isActive: string;
  order: 'ASC' | 'DESC';
  onSearchChange: (search: string) => void;
  onIsActiveChange: (isActive: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function LeadSourcesFilters({
  search,
  isActive,
  order,
  onSearchChange,
  onIsActiveChange,
  onOrderChange,
  onSearchSubmit,
}: LeadSourcesFiltersProps) {
  return (
    <div className="space-y-3">
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
            placeholder="Buscar fuente por nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
        <Button type="submit" size="sm">
          <Search className="mr-2 h-3.5 w-3.5" />
          Buscar
        </Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-medium">Estado</Label>
          <Select value={isActive} onValueChange={onIsActiveChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="bg-muted-foreground h-2 w-2 rounded-full" />
                  <span>Todos los estados</span>
                </div>
              </SelectItem>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-success h-3.5 w-3.5" />
                  <span>Activos</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <XCircle className="text-muted-foreground h-3.5 w-3.5" />
                  <span>Inactivos</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order */}
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-medium">Ordenar por</Label>
          <Select value={order} onValueChange={(value) => onOrderChange(value as 'ASC' | 'DESC')}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="text-muted-foreground h-3.5 w-3.5" />
                  <span>Más antiguos primero</span>
                </div>
              </SelectItem>
              <SelectItem value="DESC">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="text-muted-foreground h-3.5 w-3.5" />
                  <span>Más recientes primero</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
