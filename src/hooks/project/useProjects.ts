import { getProjects } from '@infrastructure/server-actions/projects.actions';
import { ProjectListItemDto } from '@infrastructure/types/projects/project.types';
import { useCallback, useEffect, useState } from 'react';

type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

interface UseProjectsReturn {
  projects: ProjectListItemDto[];
  filteredProjects: ProjectListItemDto[];
  totalProjects: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: StatusFilter;
  sortOrder: SortOrder;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  fetchProjects: () => Promise<void>;
  formatDate: (date: Date) => string;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectListItemDto[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data.projects);
      setFilteredProjects(data.projects);
      setTotalProjects(data.total);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proyectos. Intente nuevamente.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  useEffect(() => {
    let result = [...projects];
    if (searchTerm) {
      result = result.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter((project) => project.isActive === isActive);
    }
    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.updatedAt.getTime() - b.updatedAt.getTime();
      } else {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, sortOrder]);
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);
  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }, []);
  return {
    projects,
    filteredProjects,
    totalProjects,
    loading,
    error,
    searchTerm,
    statusFilter,
    sortOrder,
    setSearchTerm,
    setStatusFilter,
    setSortOrder,
    toggleSortOrder,
    fetchProjects,
    formatDate
  };
}
