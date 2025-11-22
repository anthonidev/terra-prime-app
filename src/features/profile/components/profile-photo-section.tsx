'use client';

import { useRef, useState } from 'react';
import { Camera, ImageIcon, Loader2, User } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    <Card className="h-full border shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex flex-col items-center gap-6 p-6">
        {/* Avatar Section */}
        <div className="relative flex flex-col items-center gap-4">
          {/* Avatar Container with Gradient Ring */}
          <div className="group relative">
            {/* Gradient Ring */}
            <div
              className={cn(
                'from-primary/30 via-primary/20 absolute inset-0 rounded-full bg-gradient-to-br to-transparent p-[3px] transition-all duration-500',
                'group-hover:from-primary/50 group-hover:via-primary/30',
                isPending && 'animate-pulse'
              )}
            >
              <div className="bg-background h-full w-full rounded-full" />
            </div>

            {/* Avatar */}
            <div
              className={cn(
                'bg-background border-background relative z-10 h-36 w-36 overflow-hidden rounded-full border-4 shadow-xl transition-all duration-300',
                'group-hover:scale-[1.02] group-hover:shadow-2xl',
                isPending && 'opacity-60'
              )}
            >
              {displayPhoto ? (
                <Image
                  src={displayPhoto}
                  alt="Foto de perfil"
                  width={144}
                  height={144}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-gradient-to-br">
                  <User className="text-muted-foreground/40 group-hover:text-muted-foreground/60 h-20 w-20 transition-colors" />
                </div>
              )}

              {/* Loading Overlay */}
              {isPending && (
                <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-md">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="text-primary h-10 w-10 animate-spin" />
                    <span className="text-muted-foreground text-xs font-medium">Subiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Button */}
            <button
              onClick={handleButtonClick}
              disabled={isPending}
              className={cn(
                'bg-primary text-primary-foreground absolute right-1 bottom-1 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300',
                'hover:bg-primary-hover hover:scale-110 hover:shadow-xl',
                'focus:ring-primary focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                'group-hover:ring-primary/30 group-hover:ring-2 group-hover:ring-offset-2'
              )}
              aria-label="Cambiar foto de perfil"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Separator */}
        <Separator className="w-full" />

        {/* User Info */}
        <div className="flex w-full flex-col items-center gap-3">
          <div className="w-full space-y-2 text-center">
            <h3 className="text-foreground text-xl font-semibold tracking-tight">
              {user.fullName}
            </h3>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-3 py-1 text-xs font-medium"
            >
              {user.role.name}
            </Badge>
          </div>
        </div>

        {/* Upload Info */}
        <div className="bg-muted/30 border-border/50 flex w-full items-center gap-2 rounded-lg border px-3 py-2.5">
          <ImageIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <p className="text-muted-foreground text-[11px] leading-tight">
            JPG, PNG o WEBP. Máximo 2MB
          </p>
        </div>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isPending}
          aria-label="Seleccionar archivo de imagen"
        />
      </CardContent>
    </Card>
  );
}
