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

interface AssignedClientsFiltersProps {
  filters: {
    search?: string;
    departamentoId?: number;
    provinciaId?: number;
    distritoId?: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function AssignedClientsFilters({ filters, onFiltersChange }: AssignedClientsFiltersProps) {
  const { data: departments } = useDepartments();
  const { data: provinces } = useProvinces(filters.departamentoId);
  const { data: districts } = useDistricts(filters.provinciaId);

  const handleChange = (key: string, value: any) => {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Buscar por nombre o documento..."
          className="pl-8"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      <Select
        value={filters.departamentoId?.toString()}
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

      <Select
        value={filters.provinciaId?.toString()}
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

      <Select
        value={filters.distritoId?.toString()}
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
    </div>
  );
}
