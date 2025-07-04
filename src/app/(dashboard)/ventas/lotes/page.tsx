export const dynamic = 'force-dynamic';

import { PageHeader } from '@/components/common/PageHeader';
import LayerContainer from '@sales/lotes/components/LayerContainer';
import { Suspense } from 'react';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';
import { getProjectActives } from '@infrastructure/server-actions/lotes.actions';

export default async function LotesPage() {
  const data = await getProjectActives();

  return (
    <div>
      <PageHeader title="Lotes" subtitle="listado de lotes por precio" variant="gradient" />
      <Suspense fallback={<ProjectsSkeleton />}>
        <LayerContainer data={data} />
      </Suspense>
    </div>
  );
}
