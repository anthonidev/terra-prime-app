'use client';

import { Grid3x3, Layers, MapPin, Ruler } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import type { Lot } from '../../types';

interface LotCardProps {
  lot: Lot;
}

export function LotCard({ lot }: LotCardProps) {
  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with name */}
          <div>
            <h3 className="text-sm font-bold">{lot.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="outline" className="text-xs">
                <Layers className="mr-1 h-3 w-3" />
                {lot.stageName}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Grid3x3 className="mr-1 h-3 w-3" />
                {lot.blockName}
              </Badge>
            </div>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1.5 text-xs">
            <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Área:</span>
            <span className="font-medium">{lot.area} m²</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Prices */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Precio Lote:</span>
              <span className="font-medium">
                {lot.projectCurrency} {formatPrice(lot.lotPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Urbanización:</span>
              <span className="font-medium">
                {lot.projectCurrency} {formatPrice(lot.urbanizationPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="text-xs font-semibold">Precio Total:</span>
              <span className="text-sm font-bold text-primary">
                {lot.projectCurrency} {formatPrice(lot.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
