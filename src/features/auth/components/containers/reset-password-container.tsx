'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { TokenVerification } from '../displays/token-verification';
import { ResetPasswordForm } from '../forms/reset-password-form';
import { ResetPasswordSuccess } from '../displays/reset-password-success';
import { useVerifyResetToken } from '../../hooks/use-verify-reset-token';

interface ResetPasswordContainerProps {
  token: string;
}

export function ResetPasswordContainer({ token }: ResetPasswordContainerProps) {
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
      return <ResetPasswordForm token={token} email={data.email} onSuccess={handleResetSuccess} />;
    }

    return <TokenVerification isVerifying={false} isError={true} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {renderContent()}
    </motion.div>
  );
}
