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
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
            <MapPin className="text-primary h-4 w-4" />
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
          <span className="text-muted-foreground text-xs">m²</span>
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
        const price =
          typeof row.original.lotPrice === 'string'
            ? parseFloat(row.original.lotPrice)
            : row.original.lotPrice;
        return <div className="font-medium">{formatCurrency(price, currencyType)}</div>;
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
        const price =
          typeof row.original.urbanizationPrice === 'string'
            ? parseFloat(row.original.urbanizationPrice)
            : row.original.urbanizationPrice;
        return <div className="font-medium">{formatCurrency(price, currencyType)}</div>;
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
        const price =
          typeof row.original.totalPrice === 'string'
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
      id: 'actions',
      cell: ({ row }) => {
        const lot = row.original;
        const isSelected = selectedLot?.id === lot.id;

        return (
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectLot(lot)}
            className={cn('transition-all', isSelected && 'shadow-sm')}
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
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <MapPin className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Lotes Disponibles</CardTitle>
              <CardDescription>Seleccione el lote que desea vender</CardDescription>
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
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <MapPin className="text-primary h-5 w-5" />
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
                <DataTable
                  columns={columns}
                  data={lots}
                  onRowClick={onSelectLot}
                  rowClassName={(lot) =>
                    selectedLot?.id === lot.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }
                />
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {lots.map((lot, index) => {
                  const isSelected = selectedLot?.id === lot.id;
                  const lotPrice =
                    typeof lot.lotPrice === 'string' ? parseFloat(lot.lotPrice) : lot.lotPrice;
                  const urbanPrice =
                    typeof lot.urbanizationPrice === 'string'
                      ? parseFloat(lot.urbanizationPrice)
                      : lot.urbanizationPrice;
                  const totalPrice =
                    typeof lot.totalPrice === 'string'
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
                          'cursor-pointer border-none shadow-sm transition-all',
                          isSelected && 'bg-primary/5 ring-primary ring-2'
                        )}
                        onClick={() => onSelectLot(lot)}
                      >
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                                <MapPin className="text-primary h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-lg font-bold">{lot.name}</p>
                                <Badge variant="outline" className="mt-0.5 text-xs">
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
                                <CheckCircle2 className="text-primary h-6 w-6" />
                              </motion.div>
                            )}
                          </div>

                          {/* Info Grid */}
                          <div className="space-y-2.5">
                            {/* Area */}
                            <div className="border-border/50 flex items-center justify-between border-b py-2">
                              <div className="text-muted-foreground flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm">Área</span>
                              </div>
                              <span className="font-semibold">{lot.area} m²</span>
                            </div>

                            {/* Lot Price */}
                            <div className="border-border/50 flex items-center justify-between border-b py-2">
                              <div className="text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Precio Lote</span>
                              </div>
                              <span className="font-semibold">
                                {formatCurrency(lotPrice, currencyType)}
                              </span>
                            </div>

                            {/* Urbanization Price */}
                            <div className="border-border/50 flex items-center justify-between border-b py-2">
                              <div className="text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">H. Urbana</span>
                              </div>
                              <span className="font-semibold">
                                {formatCurrency(urbanPrice, currencyType)}
                              </span>
                            </div>

                            {/* Total Price */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="text-foreground flex items-center gap-2">
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
                            className={cn('mt-4 w-full', isSelected && 'shadow-sm')}
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
              <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <MapPin className="text-muted-foreground h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No hay lotes disponibles en esta manzana
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
