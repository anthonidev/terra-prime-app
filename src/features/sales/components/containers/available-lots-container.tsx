'use client';

import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/shared/components/common/page-header';

import { useAvailableParkings } from '../../hooks/use-available-parkings';
import { useProjectLots } from '../../hooks/use-project-lots';
import { AvailableLotsFilters } from '../filters/available-lots-filters';
import { AvailableParkingsFilters } from '../filters/available-parkings-filters';
import { AvailableLotsTable } from '../tables/available-lots-table';
import { AvailableParkingsTable } from '../tables/available-parkings-table';

interface AvailableLotsContainerProps {
  projectId: string;
  projectName?: string;
}

export function AvailableLotsContainer({ projectId, projectName }: AvailableLotsContainerProps) {
  const [activeTab, setActiveTab] = useState('lots');

  // Lots state
  const [term, setTerm] = useState('');
  const [stageId, setStageId] = useState('all');
  const [blockId, setBlockId] = useState('all');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState(1);

  // Parkings state
  const [parkingTerm, setParkingTerm] = useState('');
  const [parkingOrder, setParkingOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [parkingPage, setParkingPage] = useState(1);

  const { data, isLoading } = useProjectLots(projectId, {
    page,
    limit: 20,
    order,
    term: term || undefined,
    stageId: stageId === 'all' ? undefined : stageId,
    blockId: blockId === 'all' ? undefined : blockId,
  });

  const { data: parkingsData, isLoading: parkingsLoading } = useAvailableParkings(
    projectId,
    {
      page: parkingPage,
      limit: 20,
      order: parkingOrder,
      term: parkingTerm || undefined,
    },
    activeTab === 'parkings'
  );

  const totalLots = data?.meta.totalItems || 0;
  const totalParkings = parkingsData?.meta.totalItems || 0;

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
        title={projectName || 'Disponibles'}
        description={
          activeTab === 'lots'
            ? `${totalLots} ${totalLots === 1 ? 'lote disponible' : 'lotes disponibles'}`
            : `${totalParkings} ${totalParkings === 1 ? 'cochera disponible' : 'cocheras disponibles'}`
        }
        icon={Building2}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-border dark:border-primary/20 border-b">
          <TabsList className="h-auto border-0 p-0">
            <TabsTrigger
              value="lots"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground dark:data-[state=active]:border-primary/20 relative rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-semibold shadow-none transition-all data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Lotes
            </TabsTrigger>
            <TabsTrigger
              value="parkings"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground dark:data-[state=active]:border-primary/20 relative rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-semibold shadow-none transition-all data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Cocheras
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content: Lotes */}
        <TabsContent value="lots" className="mt-6 space-y-6">
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
            <LoadingSkeleton label="Cargando lotes..." />
          ) : data ? (
            <AvailableLotsTable lots={data.items} meta={data.meta} onPageChange={setPage} />
          ) : null}
        </TabsContent>

        {/* Tab Content: Cocheras */}
        <TabsContent value="parkings" className="mt-6 space-y-6">
          {/* Filters Section */}
          <Card className="border-none shadow-sm">
            <CardContent>
              <AvailableParkingsFilters
                term={parkingTerm}
                order={parkingOrder}
                onTermChange={setParkingTerm}
                onOrderChange={setParkingOrder}
                onSearchSubmit={() => setParkingPage(1)}
              />
            </CardContent>
          </Card>

          {/* Table */}
          {parkingsLoading ? (
            <LoadingSkeleton label="Cargando cocheras..." />
          ) : parkingsData ? (
            <AvailableParkingsTable
              parkings={parkingsData.items}
              meta={parkingsData.meta}
              onPageChange={setParkingPage}
            />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSkeleton({ label }: { label: string }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
            <span className="text-muted-foreground text-sm">{label}</span>
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
