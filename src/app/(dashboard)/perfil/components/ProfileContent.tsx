import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import { getProfile } from '../action';
import { PhotoUpload } from './PhotoUpload';
import { ProfileForm } from './ProfileForm';
import { SecuritySection } from './SecuritySection';

export default async function ProfileContent() {
  const profileData = await getProfile();

  if (!profileData.success) {
    throw new Error('Error al cargar el perfil');
  }

  const user = profileData.data;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Actualiza tu foto de perfil. Máximo 3MB.</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload user={user} />
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Security Section */}
      <SecuritySection user={user} />
    </div>
  );
}
