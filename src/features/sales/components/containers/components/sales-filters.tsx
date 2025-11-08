'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SalesFiltersProps {
  order: 'ASC' | 'DESC';
  totalItems: number;
  onToggleOrder: () => void;
}

export function SalesFilters({ order, totalItems, onToggleOrder }: SalesFiltersProps) {
  const OrderIcon = order === 'ASC' ? ArrowUp : ArrowDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            {/* Total Sales Badge */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Ventas</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalItems}</p>
                  <Badge variant="secondary" className="text-xs">
                    {totalItems === 1 ? 'venta' : 'ventas'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Toggle Button */}
            <Button
              variant="outline"
              size="default"
              onClick={onToggleOrder}
              className="gap-2"
            >
              <OrderIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {order === 'ASC' ? 'Más Antiguas' : 'Más Recientes'}
              </span>
              <span className="sm:hidden">Orden</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
