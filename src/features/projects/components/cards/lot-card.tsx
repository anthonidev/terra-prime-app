'use client';

import { Edit, MapPin, Ruler } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Lot, LotStatus } from '../../types';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface LotCardProps {
  lot: Lot;
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

export function LotCard({ lot, onEdit }: LotCardProps) {
  const area = parseFloat(lot.area);
  const lotPrice = parseFloat(lot.lotPrice);
  const urbanizationPrice = parseFloat(lot.urbanizationPrice);
  const totalPrice = lotPrice + urbanizationPrice;
  const currency = lot.currency === 'USD' ? 'USD' : 'PEN';

  return (
    <Card className="group transition-all duration-300 hover:shadow-md hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
              Lote {lot.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
          <div className="w-7 h-7 rounded bg-accent/20 flex items-center justify-center shrink-0">
            <Ruler className="h-3.5 w-3.5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
              Área
            </p>
            <p className="text-sm font-bold tabular-nums">{area.toFixed(2)} m²</p>
          </div>
        </div>

        {/* Precios */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
            <span className="text-muted-foreground text-xs">Precio lote:</span>
            <span className="font-mono font-semibold text-sm">
              {formatCurrency(lotPrice, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
            <span className="text-muted-foreground text-xs">Urbanización:</span>
            <span className="font-mono font-semibold text-sm">
              {formatCurrency(urbanizationPrice, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-xs uppercase tracking-wide">
              Total:
            </span>
            <span className="font-mono font-bold text-primary text-base">
              {formatCurrency(totalPrice, currency)}
            </span>
          </div>
        </div>

        {/* Botón Editar */}
        <Button
          size="sm"
          variant="outline"
          className="w-full h-8"
          onClick={() => onEdit(lot)}
        >
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
