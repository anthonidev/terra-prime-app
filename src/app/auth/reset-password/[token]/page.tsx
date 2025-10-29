'use client';

import { useParams } from 'next/navigation';

import { ResetPasswordContainer } from '@/features/auth/components/reset-password-container';

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const token = params.token as string;

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <ResetPasswordContainer token={token} />
    </main>
  );
}
