import { PageHeader } from '@/components/common/PageHeader';
import VentasTableSkeleton from './components/VentasTableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Ventas"
        subtitle="Gestiona las ventas y pagos realizados"
        className="mb-6"
        variant="gradient"
      />
      <VentasTableSkeleton />
    </div>
  );
}
