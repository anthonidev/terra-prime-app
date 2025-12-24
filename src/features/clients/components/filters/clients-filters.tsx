'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDepartments, useProvinces, useDistricts } from '../../hooks/use-ubigeo';
import { Search } from 'lucide-react';

export interface ClientsFilters {
  term?: string;
  isActive?: boolean;
  departamentoId?: number;
  provinciaId?: number;
  distritoId?: number;
  order?: 'ASC' | 'DESC';
}

interface ClientsFiltersProps {
  filters: ClientsFilters;
  onFiltersChange: (filters: ClientsFilters) => void;
}

export function ClientsFiltersComponent({ filters, onFiltersChange }: ClientsFiltersProps) {
  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(filters.departamentoId);
  const { data: districts } = useDistricts(filters.provinciaId);

  const handleChange = (key: keyof ClientsFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };

    // Reset dependent fields
    if (key === 'departamentoId') {
      newFilters.provinciaId = undefined;
      newFilters.distritoId = undefined;
    }
    if (key === 'provinciaId') {
      newFilters.distritoId = undefined;
    }

    onFiltersChange(newFilters);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* Search */}
      <div className="relative lg:col-span-2">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Buscar por nombre o documento..."
          className="pl-8"
          value={filters.term || ''}
          onChange={(e) => handleChange('term', e.target.value || undefined)}
        />
      </div>

      {/* Department */}
      <Select
        value={filters.departamentoId?.toString() || 'all'}
        onValueChange={(value) =>
          handleChange('departamentoId', value === 'all' ? undefined : Number(value))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {departments?.map((dep) => (
            <SelectItem key={dep.id} value={dep.id.toString()}>
              {dep.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Province */}
      <Select
        value={filters.provinciaId?.toString() || 'all'}
        onValueChange={(value) =>
          handleChange('provinciaId', value === 'all' ? undefined : Number(value))
        }
        disabled={!filters.departamentoId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Provincia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {provinces?.map((prov) => (
            <SelectItem key={prov.id} value={prov.id.toString()}>
              {prov.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* District */}
      <Select
        value={filters.distritoId?.toString() || 'all'}
        onValueChange={(value) =>
          handleChange('distritoId', value === 'all' ? undefined : Number(value))
        }
        disabled={!filters.provinciaId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Distrito" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {districts?.map((dist) => (
            <SelectItem key={dist.id} value={dist.id.toString()}>
              {dist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
        onValueChange={(value) =>
          handleChange('isActive', value === 'all' ? undefined : value === 'active')
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
