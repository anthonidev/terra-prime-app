'use client';

import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '../hooks/useProfile';
import { ProfileUser } from '@/types/profile/profile.types';

interface PhotoUploadProps {
  user: ProfileUser;
}

export function PhotoUpload({ user }: PhotoUploadProps) {
  const { updatePhoto, isUploadingPhoto } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño (3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 3MB');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos JPG, PNG o WEBP');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const success = await updatePhoto(file);
    if (success) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <Avatar className="ring-background h-24 w-24 ring-4">
          <AvatarImage
            src={previewUrl || user.photo || undefined}
            alt={user.fullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        {/* Camera Icon Overlay */}
        <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 rounded-full p-2 shadow-lg">
          <Camera className="h-4 w-4" />
        </div>
      </div>

      {/* Current Photo Info */}
      <div className="text-center">
        <p className="text-sm font-medium">{user.fullName}</p>
        <p className="text-muted-foreground text-xs">{user.email}</p>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Controls */}
      {previewUrl ? (
        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={isUploadingPhoto} size="sm" className="gap-2">
            {isUploadingPhoto ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Subir
              </>
            )}
          </Button>
          <Button onClick={handleCancel} disabled={isUploadingPhoto} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isUploadingPhoto}
        >
          <Camera className="h-4 w-4" />
          Cambiar Foto
        </Button>
      )}

      {/* Upload Guidelines */}
      <Card className="bg-muted/50 p-3">
        <div className="text-muted-foreground space-y-1 text-xs">
          <p>• Máximo 3MB</p>
          <p>• Formatos: JPG, PNG, WEBP</p>
          <p>• Recomendado: 400x400px</p>
        </div>
      </Card>
    </div>
  );
}
