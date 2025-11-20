import { apiClient } from '@/shared/lib/api-client';
import type {
  AuthResponse,
  LoginInput,
  RefreshTokenInput,
  RequestPasswordResetInput,
  RequestPasswordResetResponse,
  VerifyResetTokenResponse,
  ResetPasswordResponse,
} from '../types';

export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}

export async function refreshToken(data: RefreshTokenInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/refresh', data);
  return response.data;
}

export async function logout(): Promise<void> {
  // Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export async function requestPasswordReset(
  data: RequestPasswordResetInput
): Promise<RequestPasswordResetResponse> {
  const response = await apiClient.post<RequestPasswordResetResponse>(
    '/api/auth/password-reset/request',
    data
  );
  return response.data;
}

export async function verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
  const response = await apiClient.post<VerifyResetTokenResponse>(
    `/api/auth/password-reset/verify/${token}`
  );
  return response.data;
}

export async function resetPassword(
  token: string,
  data: { password: string }
): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ResetPasswordResponse>(
    `/api/auth/password-reset/reset/${token}`,
    data
  );
  return response.data;
}
