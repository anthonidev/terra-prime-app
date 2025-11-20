'use client';

import { useState } from 'react';
import { ArrowLeft, Building2, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useProjectLots } from '../../hooks/use-project-lots';
import { AvailableLotsFilters } from '../filters/available-lots-filters';
import { AvailableLotsTable } from '../tables/available-lots-table';

interface AvailableLotsContainerProps {
  projectId: string;
  projectName?: string;
}

export function AvailableLotsContainer({ projectId, projectName }: AvailableLotsContainerProps) {
  const [term, setTerm] = useState('');
  const [stageId, setStageId] = useState('all');
  const [blockId, setBlockId] = useState('all');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProjectLots(projectId, {
    page,
    limit: 20,
    order,
    term: term || undefined,
    stageId: stageId === 'all' ? undefined : stageId,
    blockId: blockId === 'all' ? undefined : blockId,
  });

  const totalLots = data?.meta.totalItems || 0;

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link href="/proyectos/lotes-disponibles">
        <Button variant="ghost" size="sm" className="h-8">
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Volver a proyectos
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Building2 className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {projectName || 'Lotes Disponibles'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {totalLots} {totalLots === 1 ? 'lote disponible' : 'lotes disponibles'}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded">
              <Filter className="text-accent h-4 w-4" />
            </div>
            <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <AvailableLotsFilters
            projectId={projectId}
            term={term}
            stageId={stageId}
            blockId={blockId}
            order={order}
            onTermChange={setTerm}
            onStageIdChange={setStageId}
            onBlockIdChange={setBlockId}
            onOrderChange={setOrder}
            onSearchSubmit={() => setPage(1)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">Cargando lotes...</span>
              </div>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data ? (
        <AvailableLotsTable lots={data.items} meta={data.meta} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
