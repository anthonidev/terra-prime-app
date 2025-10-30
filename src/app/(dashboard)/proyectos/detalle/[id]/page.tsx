import { ProjectDetailContainer } from '@/features/projects/components/project-detail-container';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  return <ProjectDetailContainer projectId={id} />;
}
