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
      <CardContent className="p-6 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className={cn(
              'w-28 h-28 rounded-full overflow-hidden border-4 border-border ring-2 ring-primary/20 relative transition-all duration-300',
              isPending && 'opacity-50'
            )}
          >
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt="Foto de perfil"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-14 h-14 text-muted-foreground" />
              </div>
            )}
          </div>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full backdrop-blur-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center space-y-2 w-full">
          <h3 className="text-lg font-bold tracking-tight">{user.fullName}</h3>
          <Badge variant="outline" className="font-medium">
            {user.role.name}
          </Badge>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border" />

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
          <p className="text-[10px] text-center text-muted-foreground">
            Tamaño máximo: 2MB (JPG, PNG, WEBP)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
