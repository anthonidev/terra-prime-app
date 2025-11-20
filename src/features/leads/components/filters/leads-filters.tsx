'use client';

import { ArrowDownUp, Building2, Calendar, Home, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadsFiltersProps {
  search: string;
  startDate: string;
  endDate: string;
  isInOffice: string;
  order: 'ASC' | 'DESC';
  onSearchChange: (search: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onIsInOfficeChange: (value: string) => void;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onSearchSubmit: () => void;
}

export function LeadsFilters({
  search,
  startDate,
  endDate,
  isInOffice,
  order,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onIsInOfficeChange,
  onOrderChange,
  onSearchSubmit,
}: LeadsFiltersProps) {
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
            placeholder="Buscar lead por nombre, email o documento..."
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Start Date */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Calendar className="text-muted-foreground h-3.5 w-3.5" />
            Fecha inicio
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium">
            <Calendar className="text-muted-foreground h-3.5 w-3.5" />
            Fecha fin
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Is In Office Filter */}
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-medium">Ubicación</Label>
          <Select value={isInOffice} onValueChange={onIsInOfficeChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Todas las ubicaciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="bg-muted-foreground h-2 w-2 rounded-full" />
                  <span>Todas</span>
                </div>
              </SelectItem>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <Building2 className="text-primary h-3.5 w-3.5" />
                  <span>En oficina</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <Home className="text-muted-foreground h-3.5 w-3.5" />
                  <span>Fuera de oficina</span>
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
