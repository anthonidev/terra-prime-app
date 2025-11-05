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
  const availablePercentage = totalLots > 0
    ? Math.round((block.activeLots / totalLots) * 100)
    : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              Manzana {block.name}
            </h4>
          </div>
          <Badge
            variant={block.isActive ? 'default' : 'secondary'}
            className="text-xs shrink-0"
          >
            {block.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-2">
          {/* Total */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <div className="w-7 h-7 rounded bg-accent/20 flex items-center justify-center shrink-0">
              <Package className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Total</p>
              <p className="text-sm font-bold tabular-nums">{block.lotCount}</p>
            </div>
          </div>

          {/* Disponibles */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <div className="w-7 h-7 rounded bg-success/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Disponibles</p>
              <p className="text-sm font-bold text-success tabular-nums">{block.activeLots}</p>
            </div>
          </div>

          {/* Separados */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <div className="w-7 h-7 rounded bg-info/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-3.5 w-3.5 text-info" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Separados</p>
              <p className="text-sm font-bold text-info tabular-nums">{block.reservedLots}</p>
            </div>
          </div>

          {/* Vendidos */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <XCircle className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Vendidos</p>
              <p className="text-sm font-bold text-primary tabular-nums">{block.soldLots}</p>
            </div>
          </div>
        </div>

        {/* Porcentaje de disponibilidad */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Disponibilidad
            </span>
            <span className="text-xs font-bold tabular-nums">{availablePercentage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>

        {/* Botón de editar */}
        <Button
          size="sm"
          variant="ghost"
          className="w-full h-8"
          onClick={onEdit}
        >
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
