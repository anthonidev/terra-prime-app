'use client';

import { Ruler } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { AvailableParking } from '../../types';

interface AvailableParkingCardProps {
  parking: AvailableParking;
}

export function AvailableParkingCard({ parking }: AvailableParkingCardProps) {
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
            <h3 className="text-sm font-bold">{parking.name}</h3>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1.5 text-xs">
            <Ruler className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground">Área:</span>
            <span className="font-medium">{parking.area} m²</span>
          </div>

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Price */}
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Precio:</span>
            <span className="text-primary text-sm font-bold">
              {parking.projectCurrency} {formatPrice(parking.price)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
