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
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Total Sales Badge */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Receipt className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Total de Ventas
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalItems}</p>
                  <Badge variant="secondary" className="text-xs">
                    {totalItems === 1 ? 'registrada' : 'registradas'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onToggleOrder} className="h-9 gap-2">
                <OrderIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {order === 'ASC' ? 'Más Antiguas' : 'Más Recientes'}
                </span>
                <span className="sm:hidden">Orden</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
