'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  search: string;
}

export function LeadsVendorTableFilters({ search: initialSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue.trim()) params.set('search', searchValue);
      else params.delete('search');

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, pathname, router, searchParams]);

  const clearSearch = () => {
    setSearchValue('');
    router.push(pathname);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar registros..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pr-10 pl-9"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
