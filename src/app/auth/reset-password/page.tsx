'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { RequestResetForm } from '@/features/auth/components/request-reset-form';
import { RequestResetSuccess } from '@/features/auth/components/request-reset-success';

export default function ResetPasswordPage() {
  const [resetRequested, setResetRequested] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const handleSuccess = (email: string) => {
    setSuccessEmail(email);
    setResetRequested(true);
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {!resetRequested ? (
          <RequestResetForm onSuccess={handleSuccess} />
        ) : (
          <RequestResetSuccess email={successEmail} />
        )}
      </motion.div>
    </main>
  );
}
