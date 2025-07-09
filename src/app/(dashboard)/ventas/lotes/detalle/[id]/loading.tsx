import { PageHeader } from '@components/common/PageHeader';
import TableSkeleton from './components/TableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader title="Lotes" subtitle="Lotes por proyecto" className="mb-6" variant="gradient" />
      <TableSkeleton />
    </div>
  );
}
