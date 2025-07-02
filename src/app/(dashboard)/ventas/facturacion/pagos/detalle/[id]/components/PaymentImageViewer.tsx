import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

interface PaymentImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export function PaymentImageViewer({ imageUrl, onClose }: PaymentImageViewerProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Button
        className="absolute top-4 right-4 rounded-full"
        size="icon"
        variant="secondary"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-5 w-5" />
      </Button>

      <motion.div
        className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt="Comprobante de pago"
          className="max-h-[90vh] max-w-full bg-white/5 object-contain backdrop-blur"
          width={1920}
          height={1080}
        />
      </motion.div>
    </motion.div>
  );
}
