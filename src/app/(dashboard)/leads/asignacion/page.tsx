import { PageHeader } from '@/shared/components/common/page-header';
import { LeadsAssignmentContainer } from '@/features/leads/components/leads-assignment-container';

export default function LeadsAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asignación de leads a vendedores"
        description="Asigna los leads del día a los vendedores disponibles"
      />

      <LeadsAssignmentContainer />
    </div>
  );
}
