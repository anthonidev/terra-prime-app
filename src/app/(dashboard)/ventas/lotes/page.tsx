import { PageHeader } from '@/components/common/PageHeader';
import { getProyectsActives } from './action';
import LayerContainer from './components/LayerContainer';
import { Suspense } from 'react';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';

export default async function LotesPage() {
  const data = await getProyectsActives();

  return (
    <div>
      <PageHeader
        title="Lotes"
        subtitle="lorem ipsum dolor sit amet, consectetur adipiscing elit"
        variant="default"
      />
      <Suspense fallback={<ProjectsSkeleton />}>
        <LayerContainer data={data} />
      </Suspense>
    </div>
  );
}
