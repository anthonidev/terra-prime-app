'use client';

import { Edit, MapPin, Ruler, DollarSign } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Lot, LotStatus } from '../../types';

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Lote {lot.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                Manzana {lot.blockName} - {lot.stageName}
              </span>
            </div>
          </div>
          <Badge variant={statusVariants[lot.status]}>
            {statusLabels[lot.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Area */}
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Área:</span>
          <span className="font-medium">{area.toFixed(2)} m²</span>
        </div>

        {/* Prices */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Precio lote:</span>
            <span className="font-medium">{lot.currency} {lotPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm pl-6">
            <span className="text-muted-foreground">Urbanización:</span>
            <span className="font-medium">{lot.currency} {urbanizationPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm pl-6 pt-1 border-t">
            <span className="text-muted-foreground font-semibold">Total:</span>
            <span className="font-bold text-primary">{lot.currency} {totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Edit Button */}
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-2"
          onClick={() => onEdit(lot)}
        >
          <Edit className="mr-2 h-3 w-3" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
