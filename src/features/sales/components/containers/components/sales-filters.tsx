'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Receipt } from 'lucide-react';

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
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Receipt className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total de Ventas</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalItems}</p>
                  <Badge variant="secondary" className="text-xs">
                    {totalItems === 1 ? 'venta' : 'ventas'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Toggle Button */}
            <Button variant="outline" size="default" onClick={onToggleOrder} className="gap-2">
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
