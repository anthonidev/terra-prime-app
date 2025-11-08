'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SaleDetailErrorState() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" asChild>
          <Link href="/ventas/mis-ventas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Ventas
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-4"
              >
                <AlertCircle className="h-10 w-10 text-destructive" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-lg font-semibold">Error al cargar el detalle de la venta</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No pudimos cargar la información de esta venta. Por favor, verifica el ID e
                  intenta nuevamente.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button className="mt-6" asChild>
                  <Link href="/ventas/mis-ventas">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a la Lista
                  </Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
