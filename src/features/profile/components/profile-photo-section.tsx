'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/shared/lib/utils';

import { useUpdateProfilePhoto } from '../hooks/use-update-profile-photo';
import { photoFileSchema } from '../lib/validation';
import type { ProfileUser } from '../types';

interface ProfilePhotoSectionProps {
  user: ProfileUser;
}

export function ProfilePhotoSection({ user }: ProfilePhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutate, isPending } = useUpdateProfilePhoto();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validation = photoFileSchema.safeParse({ file });
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message;
      alert(errorMessage || 'Archivo inválido');
      return;
    }

    // Crear preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Subir archivo
    mutate(file, {
      onSuccess: () => {
        setPreviewUrl(null);
      },
      onError: () => {
        setPreviewUrl(null);
        URL.revokeObjectURL(objectUrl);
      },
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayPhoto = previewUrl || user.photo;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>
          Actualiza tu foto de perfil. Tamaño máximo: 2MB
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className={cn(
              'w-32 h-32 rounded-full overflow-hidden border-4 border-muted relative',
              isPending && 'opacity-50'
            )}
          >
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{user.fullName}</h3>
          <p className="text-sm text-muted-foreground">{user.role.name}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isPending}
        />

        <Button
          onClick={handleButtonClick}
          disabled={isPending}
          variant="outline"
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Cambiar foto
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
