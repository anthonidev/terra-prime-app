'use client';

import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error?: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  const handleGoHome = () => router.push('/');
  const handleGoBack = () => router.back();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-red-200 bg-white shadow-lg dark:border-red-800 dark:bg-gray-900">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
            >
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              ¡Ups! Algo salió mal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-gray-600 dark:text-gray-400"
            >
              Ocurrió un error inesperado. No te preocupes, puedes intentar nuevamente o volver al
              inicio.
            </motion.p>

            {error?.message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Error:</span> {error.message}
                </p>
                {error.digest && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Button
                onClick={reset}
                className="w-full gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Intentar nuevamente
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleGoBack} className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>

                <Button variant="outline" onClick={handleGoHome} className="flex-1 gap-2">
                  <Home className="h-4 w-4" />
                  Inicio
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Si el problema persiste, contacta al soporte técnico
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
