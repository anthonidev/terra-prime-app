'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';

import { useProjectLots } from '../hooks/use-project-lots';
import { AvailableLotsFilters } from './available-lots-filters';
import { AvailableLotsTable } from './available-lots-table';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/proyectos/lotes-disponibles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Button>
        </Link>

        <PageHeader
          title={projectName ? `Lotes Disponibles - ${projectName}` : 'Lotes Disponibles'}
          description="Explora los lotes disponibles del proyecto"
        />
      </div>

      {/* Filters Section */}
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
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
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <p className="text-center text-muted-foreground">Cargando lotes...</p>
        </div>
      ) : data ? (
        <AvailableLotsTable
          lots={data.items}
          meta={data.meta}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
