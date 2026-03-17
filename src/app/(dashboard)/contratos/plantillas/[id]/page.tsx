import { TemplateDetailContainer } from '@/features/contract-templates/components/containers/template-detail-container';

interface TemplateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = await params;
  return <TemplateDetailContainer templateId={id} />;
}
