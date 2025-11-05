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
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md border-destructive/50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive mb-1">
                  Error al cargar el perfil
                </p>
                <p className="text-sm text-muted-foreground">
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
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-sm text-muted-foreground">
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
