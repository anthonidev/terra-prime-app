import { PageHeader } from '@/components/common/PageHeader';
import LinersTableSkeleton from './components/LinersTableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Liners"
        subtitle="Gestiona los liners para la captación de leads"
        className="mb-6"
        variant="gradient"
      />
      <LinersTableSkeleton />
    </div>
  );
}
