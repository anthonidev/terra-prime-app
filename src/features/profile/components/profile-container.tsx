'use client';

import { AlertCircle, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <UserCircle className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
      </div>

      {/* First Row: Photo + Profile Info */}
      <div className="grid gap-4 md:grid-cols-3">
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
