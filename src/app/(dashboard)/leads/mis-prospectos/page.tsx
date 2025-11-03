import { PageHeader } from '@/shared/components/common/page-header';
import { VendorLeadsContainer } from '@/features/leads/components/vendor-leads-container';

export default function MisProspectosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Prospectos"
        description="Visualiza todos los prospectos que te han sido asignados"
      />

      <VendorLeadsContainer />
    </div>
  );
}
