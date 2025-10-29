'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { RequestResetForm } from './request-reset-form';
import { RequestResetSuccess } from './request-reset-success';

export function RequestResetContainer() {
  const [resetRequested, setResetRequested] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  const handleSuccess = (email: string) => {
    setSuccessEmail(email);
    setResetRequested(true);
  };

  return (
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
  );
}
