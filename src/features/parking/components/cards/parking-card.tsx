'use client';

import { Edit, Ruler } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Parking, ParkingStatus } from '../../types';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface ParkingCardProps {
  parking: Parking;
  currency: 'PEN' | 'USD';
  onEdit: (parking: Parking) => void;
}

const statusVariants: Record<ParkingStatus, 'default' | 'secondary' | 'outline'> = {
  Activo: 'default',
  Separado: 'secondary',
  Vendido: 'outline',
  Inactivo: 'outline',
};

export function ParkingCard({ parking, currency, onEdit }: ParkingCardProps) {
  const isEditable = parking.status === 'Activo';

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="group-hover:text-primary text-base font-bold tracking-tight transition-colors">
              {parking.name}
            </h3>
          </div>
          <Badge variant={statusVariants[parking.status]} className="shrink-0 text-xs">
            {parking.status}
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
            <p className="text-sm font-bold tabular-nums">
              {parseFloat(parking.area).toFixed(2)} m²
            </p>
          </div>
        </div>

        {/* Precio */}
        <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-md border p-2">
          <span className="text-primary text-xs font-semibold tracking-wide uppercase">
            Precio:
          </span>
          <span className="text-primary font-mono text-base font-bold">
            {formatCurrency(parseFloat(parking.price), currency)}
          </span>
        </div>

        {/* Botón Editar */}
        {isEditable && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-full"
            onClick={() => onEdit(parking)}
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Editar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
