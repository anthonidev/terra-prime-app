'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SalesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4"
            >
              <ShoppingCart className="h-10 w-10 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold">No tienes ventas registradas</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Cuando realices tu primera venta, aparecerá aquí. ¡Comienza ahora!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button className="mt-6" asChild>
                <Link href="/ventas/crear-venta">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Venta
                </Link>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
