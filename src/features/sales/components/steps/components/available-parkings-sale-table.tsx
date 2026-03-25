'use client';

import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Car, Ruler, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/shared/components/data-table/data-table';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { cn } from '@/shared/lib/utils';
import type { AvailableParkingForSale } from '../../../types';

interface AvailableParkingsSaleTableProps {
  parkings: AvailableParkingForSale[] | undefined;
  isLoading: boolean;
  selectedParking: AvailableParkingForSale | null;
  projectCurrency: string;
  onSelectParking: (parking: AvailableParkingForSale) => void;
}

const getCurrencyType = (currency: string): 'PEN' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'PEN';
};

export function AvailableParkingsSaleTable({
  parkings,
  isLoading,
  selectedParking,
  projectCurrency,
  onSelectParking,
}: AvailableParkingsSaleTableProps) {
  const currencyType = getCurrencyType(projectCurrency);

  const columns: ColumnDef<AvailableParkingForSale>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>Cochera</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
            <Car className="text-primary h-4 w-4" />
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
      accessorKey: 'price',
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Precio</span>
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-bold">
          {formatCurrency(parseFloat(row.original.price), currencyType)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const parking = row.original;
        const isSelected = selectedParking?.id === parking.id;

        return (
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectParking(parking)}
            className={cn('transition-all', isSelected && 'shadow-sm')}
          >
            {isSelected && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
            {isSelected ? 'Seleccionada' : 'Seleccionar'}
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
              <Car className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Cocheras Disponibles</CardTitle>
              <CardDescription>Seleccione la cochera que desea vender</CardDescription>
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
              <Car className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Cocheras Disponibles</CardTitle>
              <CardDescription>
                {parkings && parkings.length > 0
                  ? `${parkings.length} ${parkings.length === 1 ? 'cochera disponible' : 'cocheras disponibles'}`
                  : 'No hay cocheras disponibles'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {parkings && parkings.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <DataTable
                  columns={columns}
                  data={parkings}
                  onRowClick={onSelectParking}
                  rowClassName={(parking) =>
                    selectedParking?.id === parking.id
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : ''
                  }
                />
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {parkings.map((parking, index) => {
                  const isSelected = selectedParking?.id === parking.id;

                  return (
                    <motion.div
                      key={parking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          'cursor-pointer border-none shadow-sm transition-all',
                          isSelected && 'bg-primary/5 ring-primary ring-2'
                        )}
                        onClick={() => onSelectParking(parking)}
                      >
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                                <Car className="text-primary h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-lg font-bold">{parking.name}</p>
                                <Badge variant="outline" className="mt-0.5 text-xs">
                                  {parking.status}
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

                          <div className="space-y-2.5">
                            <div className="border-border/50 flex items-center justify-between border-b py-2">
                              <div className="text-muted-foreground flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm">Área</span>
                              </div>
                              <span className="font-semibold">{parking.area} m²</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm font-semibold">Precio</span>
                              </div>
                              <Badge variant="secondary" className="text-base font-bold">
                                {formatCurrency(parseFloat(parking.price), currencyType)}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn('mt-4 w-full', isSelected && 'shadow-sm')}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectParking(parking);
                            }}
                          >
                            {isSelected && <CheckCircle2 className="mr-2 h-4 w-4" />}
                            {isSelected ? 'Seleccionada' : 'Seleccionar'}
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
                <Car className="text-muted-foreground h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No hay cocheras disponibles en este proyecto
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
