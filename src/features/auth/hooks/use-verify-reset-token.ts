'use client';

import { useQuery } from '@tanstack/react-query';
import { verifyResetToken } from '../lib/mutations';

export function useVerifyResetToken(token: string) {
  return useQuery({
    queryKey: ['verify-reset-token', token],
    queryFn: () => verifyResetToken(token),
    enabled: !!token,
    retry: false,
    staleTime: Infinity, // Token verification result shouldn't change
  });
}
