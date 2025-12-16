'use client';

import { Edit, MapPin, Ruler } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Lot, LotStatus } from '../../types';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface LotCardProps {
  lot: Lot;
  currency: 'PEN' | 'USD';
  onEdit: (lot: Lot) => void;
}

const statusVariants: Record<LotStatus, 'default' | 'secondary' | 'outline'> = {
  Activo: 'default',
  Separado: 'secondary',
  Vendido: 'outline',
  Inactivo: 'outline',
};

const statusLabels: Record<LotStatus, string> = {
  Activo: 'Activo',
  Separado: 'Separado',
  Vendido: 'Vendido',
  Inactivo: 'Inactivo',
};

export function LotCard({ lot, currency, onEdit }: LotCardProps) {
  const area = parseFloat(lot.area);
  const lotPrice = parseFloat(lot.lotPrice);
  const urbanizationPrice = parseFloat(lot.urbanizationPrice);
  const totalPrice = lotPrice + urbanizationPrice;

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="group-hover:text-primary text-base font-bold tracking-tight transition-colors">
              Lote {lot.name}
            </h3>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                Mzn. {lot.blockName} • {lot.stageName}
              </span>
            </div>
          </div>
          <Badge variant={statusVariants[lot.status]} className="shrink-0 text-xs">
            {statusLabels[lot.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Área */}
        <div className="bg-muted/30 flex items-center gap-2 rounded-md p-2">
          <div className="bg-accent/20 flex h-7 w-7 shrink-0 items-center justify-center rounded">
            <Ruler className="text-accent h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
              Área
            </p>
            <p className="text-sm font-bold tabular-nums">{area.toFixed(2)} m²</p>
          </div>
        </div>

        {/* Precios */}
        <div className="space-y-2">
          <div className="bg-muted/30 flex items-center justify-between rounded-md p-2 text-sm">
            <span className="text-muted-foreground text-xs">Precio lote:</span>
            <span className="font-mono text-sm font-semibold">
              {formatCurrency(lotPrice, currency)}
            </span>
          </div>
          <div className="bg-muted/30 flex items-center justify-between rounded-md p-2 text-sm">
            <span className="text-muted-foreground text-xs">Urbanización:</span>
            <span className="font-mono text-sm font-semibold">
              {formatCurrency(urbanizationPrice, currency)}
            </span>
          </div>
          <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-md border p-2">
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Total:
            </span>
            <span className="text-primary font-mono text-base font-bold">
              {formatCurrency(totalPrice, currency)}
            </span>
          </div>
        </div>

        {/* Botón Editar */}
        <Button size="sm" variant="outline" className="h-8 w-full" onClick={() => onEdit(lot)}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
