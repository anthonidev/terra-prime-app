'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, FileX, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SaleNotFoundProps {
  saleId?: string;
  onRetry?: () => void;
}

export default function SaleNotFound({ saleId, onRetry }: SaleNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => router.back();

  const handleGoToSales = () => router.push('/ventas');

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
              <div className="flex flex-col items-center text-center md:min-w-0 md:flex-1 md:items-start md:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 md:h-20 md:w-20 dark:bg-amber-900/20"
                >
                  <FileX className="h-8 w-8 text-amber-600 md:h-10 md:w-10 dark:text-amber-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-gray-100"
                >
                  Venta no encontrada
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-600 md:text-base dark:text-gray-400"
                >
                  No pudimos encontrar la venta que estás buscando.
                </motion.p>

                {saleId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 w-full rounded-lg bg-gray-50 p-3 md:max-w-sm dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Search className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        ID buscado: <code className="font-mono">{saleId}</code>
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="w-full space-y-4 md:min-w-0 md:flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                        Posibles causas:
                      </p>
                      <ul className="space-y-1 text-xs text-blue-700 md:text-sm dark:text-blue-400">
                        <li>• La venta fue eliminada o no existe</li>
                        <li>• No tienes permisos para ver esta venta</li>
                        <li>• El enlace puede estar incorrecto</li>
                        <li>• Error temporal del sistema</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={handleGoToSales}
                    className="w-full gap-2 bg-gradient-to-r from-[#025864] to-[#00CA7C] hover:from-[#014751] hover:to-[#00b56e] sm:w-auto sm:min-w-[200px]"
                  >
                    <Search className="h-4 w-4" />
                    Ver todas las ventas
                  </Button>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {onRetry && (
                      <Button
                        variant="outline"
                        onClick={onRetry}
                        className="flex-1 gap-2 sm:min-w-[120px] sm:flex-none"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reintentar
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={handleGoBack}
                      className="flex-1 gap-2 sm:min-w-[120px] sm:flex-none"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="border-t border-gray-200 pt-3 dark:border-gray-700"
                >
                  <p className="text-xs text-gray-500 md:text-sm dark:text-gray-400">
                    Si el problema persiste, contacta al administrador del sistema
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
