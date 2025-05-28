import { notFound } from 'next/navigation';
import { getLeadDetail } from '../action';
import LeadDetailView from './LeadDetailView';

interface LeadDetailContentProps {
  leadId: string;
}

export default async function LeadDetailContent({ leadId }: LeadDetailContentProps) {
  try {
    const { success, data: lead } = await getLeadDetail(leadId);

    if (!success || !lead) {
      notFound();
    }

    return <LeadDetailView lead={lead} />;
  } catch (error) {
    console.error('Error loading lead detail:', error);

    return (
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <h3 className="text-destructive mb-2 text-lg font-semibold">
          Error al cargar los detalles del lead
        </h3>
        <p className="text-destructive/80 mb-4">
          No se pudieron cargar los datos del lead. Por favor, intenta nuevamente.
        </p>
      </div>
    );
  }
}
