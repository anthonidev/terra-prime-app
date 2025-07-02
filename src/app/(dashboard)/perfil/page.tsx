import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import ProfileContent from './components/ProfileContent';
import ProfileSkeleton from './components/ProfileSkeleton';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Perfil"
        subtitle="Gestiona tu información personal y configuración de cuenta"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
