'use client';

import { AlertCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { useProfile } from '../hooks/use-profile';
import { ProfilePhotoSection } from './profile-photo-section';
import { ProfileForm } from './profile-form';
import { ChangePasswordForm } from './change-password-form';
import { ProfileSkeleton } from './profile-skeleton';
import { PageHeader } from '@/shared/components/common/page-header';

export function ProfileContainer() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="border-destructive/50 max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="bg-destructive/20 flex h-12 w-12 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-6 w-6" />
              </div>
              <div>
                <p className="text-destructive mb-1 font-semibold">Error al cargar el perfil</p>
                <p className="text-muted-foreground text-sm">
                  Intenta recargar la página o contacta con soporte
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información personal y configuración de cuenta"
        icon={User}
      />

      {/* First Row: Photo + Profile Info */}
      <div className="grid gap-8 md:grid-cols-12">
        {/* Photo Section */}
        <div className="md:col-span-4 lg:col-span-3">
          <ProfilePhotoSection user={user} />
        </div>

        {/* Profile Form */}
        <div className="md:col-span-8 lg:col-span-9">
          <ProfileForm user={user} />
        </div>
      </div>

      {/* Second Row: Change Password (Full Width) */}
      <div className="pt-4">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
