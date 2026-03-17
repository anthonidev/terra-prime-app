'use client';

import { LayoutGrid, List, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { TemplateStatus } from '../../types';

interface TemplatesFiltersProps {
  projectId: string;
  onProjectChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  term: string;
  onTermChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: TemplateStatus.DRAFT, label: 'Borrador' },
  { value: TemplateStatus.ACTIVE, label: 'Activo' },
  { value: TemplateStatus.INACTIVE, label: 'Inactivo' },
];

export function TemplatesFilters({
  projectId,
  onProjectChange,
  status,
  onStatusChange,
  term,
  onTermChange,
  viewMode,
  onViewModeChange,
}: TemplatesFiltersProps) {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={projectId} onValueChange={onProjectChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Seleccionar proyecto" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Buscar plantilla..."
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          className="w-[220px] pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5 rounded-md border p-0.5">
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => onViewModeChange('grid')}
          aria-label="Vista en grilla"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => onViewModeChange('list')}
          aria-label="Vista en lista"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
