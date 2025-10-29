'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { TokenVerification } from '@/features/auth/components/token-verification';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { ResetPasswordSuccess } from '@/features/auth/components/reset-password-success';
import { useVerifyResetToken } from '@/features/auth/hooks/use-verify-reset-token';

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const token = params.token as string;

  const [resetSuccess, setResetSuccess] = useState(false);

  const { data, isLoading, isError } = useVerifyResetToken(token);

  const handleResetSuccess = () => {
    setResetSuccess(true);
  };

  const renderContent = () => {
    if (isLoading || isError) {
      return <TokenVerification isVerifying={isLoading} isError={isError} />;
    }

    if (resetSuccess) {
      return <ResetPasswordSuccess />;
    }

    if (data?.success) {
      return (
        <ResetPasswordForm
          token={token}
          email={data.email}
          onSuccess={handleResetSuccess}
        />
      );
    }

    return <TokenVerification isVerifying={false} isError={true} />;
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {renderContent()}
      </motion.div>
    </main>
  );
}
