'use client';

import { PageHeader } from '@/shared/components/common/page-header';

import { useProfile } from '../hooks/use-profile';
import { ProfilePhotoSection } from './profile-photo-section';
import { ProfileForm } from './profile-form';
import { ChangePasswordForm } from './change-password-form';
import { ProfileSkeleton } from './profile-skeleton';

export function ProfileContainer() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar el perfil</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Perfil de usuario"
        description="Gestiona tu información personal y configuración de cuenta"
      />

      {/* First Row: Photo + Profile Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Photo Section */}
        <div className="md:col-span-1">
          <ProfilePhotoSection user={user} />
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <ProfileForm user={user} />
        </div>
      </div>

      {/* Second Row: Change Password (Full Width) */}
      <ChangePasswordForm />
    </div>
  );
}
