import { TemplateFormContainer } from '@/features/contract-templates/components/containers/template-form-container';

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params;
  return <TemplateFormContainer templateId={id} />;
}
