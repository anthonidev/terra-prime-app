'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Edit, Package, ShoppingCart, XCircle } from 'lucide-react';
import type { Block } from '../../types';

interface BlockCardProps {
  block: Block;
  onEdit: () => void;
}

export function BlockCard({ block, onEdit }: BlockCardProps) {
  const totalLots = block.lotCount;
  const availablePercentage = totalLots > 0 ? Math.round((block.activeLots / totalLots) * 100) : 0;

  return (
    <Card className="group hover:border-primary/50 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="group-hover:text-primary truncate text-base font-semibold transition-colors">
              Manzana {block.name}
            </h4>
          </div>
          <Badge variant={block.isActive ? 'default' : 'secondary'} className="shrink-0 text-xs">
            {block.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-2">
          {/* Total */}
          <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <div className="bg-accent/20 flex h-7 w-7 shrink-0 items-center justify-center rounded">
              <Package className="text-accent h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Total
              </p>
              <p className="text-sm font-bold tabular-nums">{block.lotCount}</p>
            </div>
          </div>

          {/* Disponibles */}
          <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <div className="bg-success/20 flex h-7 w-7 shrink-0 items-center justify-center rounded">
              <CheckCircle2 className="text-success h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Disponibles
              </p>
              <p className="text-success text-sm font-bold tabular-nums">{block.activeLots}</p>
            </div>
          </div>

          {/* Separados */}
          <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <div className="bg-info/20 flex h-7 w-7 shrink-0 items-center justify-center rounded">
              <ShoppingCart className="text-info h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Separados
              </p>
              <p className="text-info text-sm font-bold tabular-nums">{block.reservedLots}</p>
            </div>
          </div>

          {/* Vendidos */}
          <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
            <div className="bg-primary/20 flex h-7 w-7 shrink-0 items-center justify-center rounded">
              <XCircle className="text-primary h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                Vendidos
              </p>
              <p className="text-primary text-sm font-bold tabular-nums">{block.soldLots}</p>
            </div>
          </div>
        </div>

        {/* Porcentaje de disponibilidad */}
        <div className="pt-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
              Disponibilidad
            </span>
            <span className="text-xs font-bold tabular-nums">{availablePercentage}%</span>
          </div>
          <div className="bg-muted/50 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-success h-full rounded-full transition-all duration-300"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>

        {/* Botón de editar */}
        <Button size="sm" variant="ghost" className="h-8 w-full" onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
