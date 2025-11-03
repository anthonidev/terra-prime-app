'use client';

import { useState, useCallback } from 'react';
import { ConfirmationDialog } from '../components/confirmation-dialog';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const confirm = useCallback((opts: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setOnConfirmCallback(() => () => {
        resolve(true);
        setIsOpen(false);
      });
      setIsOpen(true);

      // Handle cancel/close
      const handleCancel = () => {
        resolve(false);
        setIsOpen(false);
      };

      // Store cancel handler for cleanup
      (window as any).__confirmationCancelHandler = handleCancel;
    });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      // User closed the dialog without confirming
      if ((window as any).__confirmationCancelHandler) {
        (window as any).__confirmationCancelHandler();
        delete (window as any).__confirmationCancelHandler;
      }
    }
    setIsOpen(open);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    delete (window as any).__confirmationCancelHandler;
  }, [onConfirmCallback]);

  const ConfirmationDialogComponent = useCallback(() => {
    return (
      <ConfirmationDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
      />
    );
  }, [isOpen, handleOpenChange, handleConfirm, options]);

  return {
    confirm,
    ConfirmationDialog: ConfirmationDialogComponent,
  };
}
