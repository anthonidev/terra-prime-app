'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ParkingStatus } from '../../types';

interface ParkingsFiltersProps {
  status: ParkingStatus | 'all';
  search: string;
  onStatusChange: (status: ParkingStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
}

export function ParkingsFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
}: ParkingsFiltersProps) {
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
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar cochera por nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Filters Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as ParkingStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Separado">Separado</SelectItem>
            <SelectItem value="Vendido">Vendido</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
