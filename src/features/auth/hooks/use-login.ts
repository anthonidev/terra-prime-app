'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { login as loginMutation } from '../lib/mutations';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginMutation,
    onSuccess: (data) => {
      // Store tokens and user in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(`Bienvenido ${data.user.fullName}`);

      // Redirect to home
      router.push('/');
    },
    onError: (error: Error) => {
      // Check if it's an Axios error
      if (error instanceof AxiosError) {
        // Check if it's an authentication error (401)
        if (error.response?.status === 401) {
          // Don't show toast for 401, let the form handle it
          return;
        }

        // Check if it's a network error
        if (error.message === 'Network Error' || !error.response) {
          // Don't show toast for network errors either, let the form handle it
          return;
        }
      }

      // Log and show toast only for unexpected errors
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Por favor, intenta nuevamente.');
    },
  });
}
