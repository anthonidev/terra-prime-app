export const dynamic = 'force-dynamic';

import { PageHeader } from '@components/common/PageHeader';
import { Suspense } from 'react';
import ProjectsSkeleton from '@components/project/list/ProjectsSkeleton';
import { getProjectActives } from '@infrastructure/server-actions/lotes.actions';
import ProjectContainer from './components/ProjectContainer';

export default async function LotesPage() {
  const data = await getProjectActives();

  return (
    <div>
      <PageHeader title="Lotes" subtitle="listado de lotes por precio" variant="gradient" />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectContainer data={data} />
      </Suspense>
    </div>
  );
}
