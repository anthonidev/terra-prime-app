import { LeadDetailContainer } from '@/features/leads/components/lead-detail-container';

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  return <LeadDetailContainer leadId={id} />;
}
