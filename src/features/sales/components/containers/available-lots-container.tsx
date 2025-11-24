'use client';

import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/shared/components/common/page-header';

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
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/proyectos/lotes-disponibles">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            Volver a proyectos
          </Button>
        </Link>
      </div>

      <PageHeader
        title={projectName || 'Lotes Disponibles'}
        description={`${totalLots} ${totalLots === 1 ? 'lote disponible' : 'lotes disponibles'}`}
        icon={Building2}
      />

      {/* Filters Section */}
      <Card className="border-none shadow-sm">
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
        <Card className="border-none shadow-sm">
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
