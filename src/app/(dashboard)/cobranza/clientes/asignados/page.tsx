import { PageHeader } from '@/shared/components/common/page-header';
import { AssignedClientsContainer } from '@/features/collections/components/containers/assigned-clients-container';

export default function AssignedClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mis clientes" description="Lista de clientes asignados a mí" />
      <AssignedClientsContainer />
    </div>
  );
}
