import { PageHeader } from '@/shared/components/common/page-header';
import { CollectorStatisticsContainer } from '@/features/collections/components/containers/collector-statistics-container';

export default function CollectorStatisticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Estadísticas de cobradores"
        description="Resumen de desempeño de los cobradores"
      />
      <CollectorStatisticsContainer />
    </div>
  );
}
