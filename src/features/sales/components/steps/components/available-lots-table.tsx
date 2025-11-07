'use client';

import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { MapPin, Ruler, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/shared/components/data-table/data-table';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { cn } from '@/shared/lib/utils';
import type { ProjectLotResponse } from '../../../types';

interface AvailableLotsTableProps {
  lots: ProjectLotResponse[] | undefined;
  isLoading: boolean;
  selectedLot: ProjectLotResponse | null;
  projectCurrency: string;
  onSelectLot: (lot: ProjectLotResponse) => void;
}

// Map project currency to format
const getCurrencyType = (currency: string): 'PEN' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'PEN';
};

export function AvailableLotsTable({
  lots,
  isLoading,
  selectedLot,
  projectCurrency,
  onSelectLot,
}: AvailableLotsTableProps) {
  const currencyType = getCurrencyType(projectCurrency);

  const columns: ColumnDef<ProjectLotResponse>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Lote</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'area',
      header: () => (
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          <span>Área</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{row.original.area}</span>
          <span className="text-xs text-muted-foreground">m²</span>
        </div>
      ),
    },
    {
      accessorKey: 'lotPrice',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Precio Lote</span>
        </div>
      ),
      cell: ({ row }) => {
        const price = typeof row.original.lotPrice === 'string'
          ? parseFloat(row.original.lotPrice)
          : row.original.lotPrice;
        return (
          <div className="font-medium">
            {formatCurrency(price, currencyType)}
          </div>
        );
      },
    },
    {
      accessorKey: 'urbanizationPrice',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>H. Urbana</span>
        </div>
      ),
      cell: ({ row }) => {
        const price = typeof row.original.urbanizationPrice === 'string'
          ? parseFloat(row.original.urbanizationPrice)
          : row.original.urbanizationPrice;
        return (
          <div className="font-medium">
            {formatCurrency(price, currencyType)}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalPrice',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Precio Total</span>
        </div>
      ),
      cell: ({ row }) => {
        const price = typeof row.original.totalPrice === 'string'
          ? parseFloat(row.original.totalPrice)
          : row.original.totalPrice;
        return (
          <Badge variant="secondary" className="font-bold">
            {formatCurrency(price, currencyType)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const lot = row.original;
        const isSelected = selectedLot?.id === lot.id;

        return (
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectLot(lot)}
            className={cn(
              'transition-all',
              isSelected && 'shadow-md'
            )}
          >
            {isSelected && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
            {isSelected ? 'Seleccionado' : 'Seleccionar'}
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Lotes Disponibles</CardTitle>
              <CardDescription>
                Seleccione el lote que desea vender
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Lotes Disponibles</CardTitle>
              <CardDescription>
                {lots && lots.length > 0
                  ? `${lots.length} ${lots.length === 1 ? 'lote disponible' : 'lotes disponibles'}`
                  : 'No hay lotes disponibles'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lots && lots.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <DataTable columns={columns} data={lots} />
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {lots.map((lot, index) => {
                  const isSelected = selectedLot?.id === lot.id;
                  const lotPrice = typeof lot.lotPrice === 'string'
                    ? parseFloat(lot.lotPrice)
                    : lot.lotPrice;
                  const urbanPrice = typeof lot.urbanizationPrice === 'string'
                    ? parseFloat(lot.urbanizationPrice)
                    : lot.urbanizationPrice;
                  const totalPrice = typeof lot.totalPrice === 'string'
                    ? parseFloat(lot.totalPrice)
                    : lot.totalPrice;

                  return (
                    <motion.div
                      key={lot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          'transition-all cursor-pointer hover:shadow-md',
                          isSelected && 'border-2 border-primary bg-primary/5 shadow-lg'
                        )}
                        onClick={() => onSelectLot(lot)}
                      >
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <MapPin className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-lg">{lot.name}</p>
                                <Badge variant="outline" className="text-xs mt-0.5">
                                  {lot.status}
                                </Badge>
                              </div>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                              </motion.div>
                            )}
                          </div>

                          {/* Info Grid */}
                          <div className="space-y-2.5">
                            {/* Area */}
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm">Área</span>
                              </div>
                              <span className="font-semibold">{lot.area} m²</span>
                            </div>

                            {/* Lot Price */}
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Precio Lote</span>
                              </div>
                              <span className="font-semibold">
                                {formatCurrency(lotPrice, currencyType)}
                              </span>
                            </div>

                            {/* Urbanization Price */}
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">H. Urbana</span>
                              </div>
                              <span className="font-semibold">
                                {formatCurrency(urbanPrice, currencyType)}
                              </span>
                            </div>

                            {/* Total Price */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2 text-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm font-semibold">Total</span>
                              </div>
                              <Badge variant="secondary" className="text-base font-bold">
                                {formatCurrency(totalPrice, currencyType)}
                              </Badge>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              'w-full mt-4',
                              isSelected && 'shadow-md'
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectLot(lot);
                            }}
                          >
                            {isSelected && <CheckCircle2 className="mr-2 h-4 w-4" />}
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No hay lotes disponibles en esta manzana
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
