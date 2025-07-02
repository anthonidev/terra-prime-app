'use client';

import { ChangePasswordDto, UpdateProfileDto } from '@/types/profile/profile.types';
import { useState } from 'react';
import { toast } from 'sonner';
import { changePassword, updateProfile, updateProfilePhoto } from '../action';

export function useProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (data: UpdateProfileDto) => {
    setIsUpdating(true);

    try {
      const result = await updateProfile(data);

      if (result.success) {
        toast.success(result?.data?.message);

        return true;
      } else {
        toast.error(result.error || 'Error al actualizar perfil');
        return false;
      }
    } catch {
      toast.error('Error inesperado al actualizar perfil');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePhoto = async (photo: File) => {
    setIsUploadingPhoto(true);

    try {
      const result = await updateProfilePhoto(photo);

      if (result.success) {
        toast.success(result?.data?.message);

        return true;
      } else {
        toast.error(result.error || 'Error al actualizar foto');
        return false;
      }
    } catch {
      toast.error('Error inesperado al actualizar foto');
      return false;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordDto) => {
    setIsChangingPassword(true);

    try {
      const result = await changePassword(data);

      if (result.success) {
        toast.success(result?.data?.message);
        return true;
      } else {
        toast.error(result.error || 'Error al cambiar contraseña');
        return false;
      }
    } catch {
      toast.error('Error inesperado al cambiar contraseña');
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    // States
    isUpdating,
    isUploadingPhoto,
    isChangingPassword,

    // Actions
    updateProfile: handleUpdateProfile,
    updatePhoto: handleUpdatePhoto,
    changePassword: handleChangePassword
  };
}
