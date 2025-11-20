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
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
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
                className="h-9 pl-9 text-sm"
                aria-label="Buscar participantes"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="w-full md:w-[200px]">
            <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-sm">
                <Filter className="mr-2 h-3.5 w-3.5" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(PARTICIPANT_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
