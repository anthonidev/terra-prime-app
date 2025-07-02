'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  ChangePasswordDto,
  ChangePasswordResponse,
  ProfileResponse,
  UpdatePhotoResponse,
  UpdateProfileDto,
  UpdateProfileResponse
} from '@/types/profile/profile.types';
import { revalidatePath, revalidateTag } from 'next/cache';

const PROFILE_CACHE_TAG = 'profile';

// Actions
export async function getProfile(): Promise<ProfileResponse> {
  try {
    return await httpClient<ProfileResponse>('/api/profile', {
      next: {
        tags: [PROFILE_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
}

export async function updateProfile(data: UpdateProfileDto) {
  try {
    const result = await httpClient<UpdateProfileResponse>('/api/profile', {
      method: 'PATCH',
      body: data,
      cache: 'no-store'
    });

    revalidateTag(PROFILE_CACHE_TAG);
    revalidatePath('/profile');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar perfil'
    };
  }
}

export async function updateProfilePhoto(photo: File) {
  try {
    // Validar tamaño de archivo (3MB máximo)
    const maxSize = 3 * 1024 * 1024; // 3MB en bytes
    if (photo.size > maxSize) {
      return {
        success: false,
        error: 'La imagen no puede superar los 3MB'
      };
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) {
      return {
        success: false,
        error: 'Solo se permiten archivos JPG, PNG o WEBP'
      };
    }

    const formData = new FormData();
    formData.append('photo', photo);

    const result = await httpClient<UpdatePhotoResponse>('/api/profile/photo', {
      method: 'PATCH',
      body: formData,
      cache: 'no-store',
      skipJsonStringify: true
    });

    revalidateTag(PROFILE_CACHE_TAG);
    revalidatePath('/profile');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar foto de perfil'
    };
  }
}

export async function changePassword(data: ChangePasswordDto) {
  try {
    const result = await httpClient<ChangePasswordResponse>('/api/auth/change-password', {
      method: 'POST',
      body: data,
      cache: 'no-store'
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar contraseña'
    };
  }
}
