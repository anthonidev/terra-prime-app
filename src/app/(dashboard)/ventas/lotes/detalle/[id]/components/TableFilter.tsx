'use client';

import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { SortAsc, SortDesc, X, Building2, Layers, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import {
  ProjectBlocksResponse,
  ProjectStagesResponse
} from '@infrastructure/types/lotes/api-response.types';
import { getProyectBlocks, getProyectStages } from '@infrastructure/server-actions/lotes.actions';
import { Input } from '@/components/ui/input';

interface TableFiltersProps {
  projectId: string;
  order: 'ASC' | 'DESC';
  initialStageId?: string;
  initialBlockId?: string;
  term?: string;
}

export default function TableFilter({
  projectId,
  order: initialOrder,
  initialStageId,
  initialBlockId,
  term
}: TableFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orderValue, setOrderValue] = useState<'ASC' | 'DESC'>(initialOrder);
  const [stageFilter, setStageFilter] = useState<string>(
    initialStageId || searchParams.get('stageId') || 'all'
  );
  const [blockFilter, setBlockFilter] = useState<string>(
    initialBlockId || searchParams.get('blockId') || 'all'
  );
  const [search, setSearch] = useState<string>(term || searchParams.get('term') || '');

  const [stages, setStages] = useState<ProjectStagesResponse[]>([]);
  const [blocks, setBlocks] = useState<ProjectBlocksResponse[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  useEffect(() => {
    const loadStages = async () => {
      if (projectId) {
        setLoadingStages(true);
        try {
          const stagesData = await getProyectStages({ id: projectId });
          setStages(stagesData);
        } catch (error) {
          console.error('Error loading stages:', error);
          setStages([]);
        } finally {
          setLoadingStages(false);
        }
      } else {
        setStages([]);
      }
    };
    loadStages();
  }, [projectId]);

  useEffect(() => {
    const loadBlocks = async () => {
      if (stageFilter && stageFilter !== 'all') {
        setLoadingBlocks(true);
        try {
          const blocksData = await getProyectBlocks({ id: stageFilter });
          setBlocks(blocksData);
        } catch (error) {
          console.error('Error loading blocks:', error);
          setBlocks([]);
        } finally {
          setLoadingBlocks(false);
        }
      } else {
        setBlocks([]);
      }
    };
    loadBlocks();
  }, [stageFilter]);

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

  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrderValue(value);
    router.push(`${pathname}?${createQueryString({ order: value })}`);
  };

  const handleStageChange = (value: string) => {
    setStageFilter(value);
    if (value === 'all') {
      setBlockFilter('all');
      router.push(`${pathname}?${createQueryString({ stageId: value, blockId: 'all' })}`);
    } else {
      router.push(`${pathname}?${createQueryString({ stageId: value })}`);
    }
  };

  const handleBlockChange = (value: string) => {
    setBlockFilter(value);
    router.push(`${pathname}?${createQueryString({ blockId: value })}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    router.push(`${pathname}?${createQueryString({ term: value })}`);
  };

  const clearAllFilters = () => {
    setOrderValue('DESC');
    setStageFilter('all');
    setBlockFilter('all');
    setSearch('');
    router.push(pathname);
  };

  const hasActiveFilters =
    orderValue !== 'DESC' || stageFilter !== 'all' || blockFilter !== 'all' || search !== '';
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={orderValue}
            onValueChange={(value: 'ASC' | 'DESC') => handleOrderChange(value)}
          >
            <SelectTrigger className="w-auto gap-2 bg-white dark:bg-gray-900">
              {orderValue === 'DESC' ? (
                <SortDesc className="h-4 w-4 text-gray-400" />
              ) : (
                <SortAsc className="h-4 w-4 text-gray-400" />
              )}
              <span className="hidden sm:inline">
                {orderValue === 'DESC' ? 'Más recientes' : 'Más antiguos'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Más recientes</SelectItem>
              <SelectItem value="ASC">Más antiguos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={handleStageChange} disabled={loadingStages}>
            <SelectTrigger className="w-auto min-w-[140px] gap-2 bg-white dark:bg-gray-900">
              <Building2 className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etapas</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={blockFilter}
            onValueChange={handleBlockChange}
            disabled={loadingBlocks || stageFilter === 'all'}
          >
            <SelectTrigger className="w-auto min-w-[140px] gap-2 bg-white dark:bg-gray-900">
              <Layers className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Manzana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las manzanas</SelectItem>
              {blocks.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar lotes..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-auto min-w-[200px] bg-white pl-10 dark:bg-gray-900"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="gap-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search !== '' && (
            <Badge variant="secondary" className="gap-1">
              <Search className="h-3 w-3" />
              Búsqueda: {search}
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {stageFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Building2 className="h-3 w-3" />
              Etapa: {stages.find((s) => s.id === stageFilter)?.name}
              <button
                onClick={() => handleStageChange('all')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {blockFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Layers className="h-3 w-3" />
              Manzana: {blocks.find((b) => b.id === blockFilter)?.name}
              <button
                onClick={() => handleBlockChange('all')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {orderValue !== 'DESC' && (
            <Badge variant="secondary" className="gap-1">
              <SortAsc className="h-3 w-3" />
              Orden: {orderValue === 'ASC' ? 'Más antiguos' : 'Más recientes'}
              <button
                onClick={() => handleOrderChange('DESC')}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
