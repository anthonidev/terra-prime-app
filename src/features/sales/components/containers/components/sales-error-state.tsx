'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SalesErrorStateProps {
  onRetry?: () => void;
}

export function SalesErrorState({ onRetry }: SalesErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full"
            >
              <AlertCircle className="text-destructive h-10 w-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold">Error al cargar las ventas</h3>
              <p className="text-muted-foreground max-w-sm text-sm">
                No pudimos cargar tus ventas en este momento. Por favor, intenta nuevamente.
              </p>
            </motion.div>

            {onRetry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button onClick={onRetry} className="mt-6" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
