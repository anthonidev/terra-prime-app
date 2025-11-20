import { apiClient } from '@/shared/lib/api-client';
import type {
  ProfileResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
  UpdatePhotoResponse,
  ChangePasswordInput,
  ChangePasswordResponse,
} from '../types';

export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>('/api/profile');
  return response.data;
}

export async function updateProfile(data: UpdateProfileInput): Promise<UpdateProfileResponse> {
  const response = await apiClient.patch<UpdateProfileResponse>('/api/profile', data);
  return response.data;
}

export async function updateProfilePhoto(file: File): Promise<UpdatePhotoResponse> {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await apiClient.patch<UpdatePhotoResponse>('/api/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function changePassword(data: ChangePasswordInput): Promise<ChangePasswordResponse> {
  const response = await apiClient.post<ChangePasswordResponse>('/api/auth/change-password', data);
  return response.data;
}
