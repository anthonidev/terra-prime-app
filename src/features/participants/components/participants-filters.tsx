'use client';

import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

import { ParticipantType } from '../types';
import { PARTICIPANT_TYPE_LABELS } from '../constants';
import type { ParticipantsQueryParams } from '../types';

interface ParticipantsFiltersProps {
  filters: ParticipantsQueryParams;
  onFiltersChange: (filters: ParticipantsQueryParams) => void;
}

export function ParticipantsFilters({ filters, onFiltersChange }: ParticipantsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search to avoid firing on every keystroke when typing fast
  useEffect(() => {
    const handler = setTimeout(() => {
      if ((filters.search || '') !== searchInput) {
        onFiltersChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 500);

    return () => clearTimeout(handler);
    // Include filters to keep other filter changes in sync; guard prevents redundant calls
  }, [searchInput, filters, onFiltersChange]);

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value === 'all' ? undefined : (value as ParticipantType),
      page: 1,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, documento o teléfono..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Immediate search on Enter, bypassing debounce
                    e.preventDefault();
                    if ((filters.search || '') !== searchInput) {
                      onFiltersChange({ ...filters, search: searchInput, page: 1 });
                    }
                  }
                }}
                className="pl-9"
                aria-label="Buscar participantes"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <Select
            value={filters.type || 'all'}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full md:w-[250px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.entries(PARTICIPANT_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
