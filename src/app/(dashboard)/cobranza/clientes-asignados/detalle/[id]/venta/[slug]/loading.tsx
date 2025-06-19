import { PageHeader } from '@/components/common/PageHeader';
import SkeletonData from './components/SkeletonData';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle"
        subtitle="Lorem ipsum dolor amet sit no dolor"
        className="mb-6"
        variant="gradient"
        backUrl="/cobranza/clientes-asignados"
      />
      <SkeletonData />
    </div>
  );
}
