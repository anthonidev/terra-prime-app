'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
      const errorMessage = validation.error.issues[0]?.message;
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
    <Card className="h-full">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Avatar */}
        <div className="relative">
          <div
            className={cn(
              'border-border ring-primary/20 relative h-28 w-28 overflow-hidden rounded-full border-4 ring-2 transition-all duration-300',
              isPending && 'opacity-50'
            )}
          >
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt="Foto de perfil"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <User className="text-muted-foreground h-14 w-14" />
              </div>
            )}
          </div>
          {isPending && (
            <div className="bg-background/50 absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-sm">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="w-full space-y-2 text-center">
          <h3 className="text-lg font-bold tracking-tight">{user.fullName}</h3>
          <Badge variant="outline" className="font-medium">
            {user.role.name}
          </Badge>
        </div>

        {/* Divider */}
        <div className="bg-border h-px w-full" />

        {/* Change Photo Button */}
        <div className="w-full space-y-2">
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
            size="sm"
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-3.5 w-3.5" />
                Cambiar foto
              </>
            )}
          </Button>
          <p className="text-muted-foreground text-center text-[10px]">
            Tamaño máximo: 2MB (JPG, PNG, WEBP)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
