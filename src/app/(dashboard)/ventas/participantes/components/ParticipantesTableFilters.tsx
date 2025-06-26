'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import ParticipantModal from './ParticipantModal';

interface ParticipantesTableFiltersProps {
  search: string;
}

export default function ParticipantesTableFilters({
  search: initialSearch
}: ParticipantesTableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createQueryString = useCallback(
    (updates: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([name, value]) => {
        if (value === '' || value === 'all') {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });

      params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    router.push(`${pathname}?${createQueryString({ search: value })}`);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    router.push(pathname);
  };

  const hasActiveFilters = searchValue !== '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex max-w-md flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar participantes..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-10 px-3">
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Participante
        </Button>
      </div>

      <ParticipantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
