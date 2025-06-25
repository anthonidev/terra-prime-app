'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Square, DollarSign, Ruler, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import * as React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';
import { useLots } from '../../hooks/useLots';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import TableTemplate from '@/components/common/table/TableTemplate';
import { Lot } from '@domain/entities/lotes/lot.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Props {
  currency?: string;
  blockId: string;
  onBack: () => void;
}

export default function ImprovedLotsLayer({ currency, blockId, onBack }: Props) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false
  });
  const { lots, loading } = useLots(blockId);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const formatCurrency = (amount: number, currency: string = 'PEN') => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const columns = React.useMemo<ColumnDef<Lot>[]>(
    () => [
      {
        id: 'index',
        header: () => (
          <div className="flex items-center justify-center gap-2 font-semibold">
            <span className="text-xs">#</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {row.index + 1}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Square className="h-4 w-4 text-purple-600" />
            <span>Lote</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Square className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {row.getValue('name')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lote residencial</div>
            </div>
          </div>
        ),
        enableHiding: false
      },
      {
        accessorKey: 'area',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Ruler className="h-4 w-4 text-blue-600" />
            <span>Área m²</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
              {row.getValue('area')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">metros cuadrados</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'lotPrice',
        header: () => (
          <div className="flex items-center justify-end gap-2 font-semibold">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Precio Lote</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {formatCurrency(row.getValue('lotPrice'), currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Precio base</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'urbanizationPrice',
        header: () => (
          <div className="flex items-center justify-end gap-2 font-semibold">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span>Precio HU</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(row.getValue('urbanizationPrice'), currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Habilitación urbana</div>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Eye className="h-4 w-4 text-gray-600" />
            <span>Estado</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              variant={row.getValue('status') ? 'default' : 'destructive'}
              className="px-3 py-1 text-xs font-medium"
            >
              {row.getValue('status')}
            </Badge>
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>Fecha de creación</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy', { locale: es })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(row.getValue('createdAt')), 'MMM yyyy', { locale: es })}
              </div>
            </div>
          </div>
        ),
        enableHiding: true
      }
    ],
    [currency]
  );

  const table = useReactTable({
    data: lots,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });

  // Estadísticas rápidas para la UI
  const stats = React.useMemo(() => {
    const available = lots.filter((lot) => lot.status === 'AVAILABLE').length;
    const sold = lots.filter((lot) => lot.status === 'SOLD').length;
    const total = lots.length;

    return { available, sold, total };
  }, [lots]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Manzanas
            </Button>

            <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex dark:text-gray-400">
              <Square className="h-4 w-4" />
              <span>{lots.length} lotes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500 p-2">
                  <Square className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Total</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500 p-2">
                  <Square className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400">Disponibles</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {stats.available}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-500 p-2">
                  <Square className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400">Vendidos</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{stats.sold}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <TableSkeleton />
            </CardContent>
          </Card>
        ) : isMobile ? (
          <div className="space-y-4">
            {lots.length > 0 ? (
              lots.map((lot, index) => (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden p-0 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex flex-col divide-y">
                        <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                          <StatusBadge status={lot.status} />
                          <div className="text-sm font-medium text-slate-100">
                            <span>#{index + 1}</span>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 text-sm font-medium">
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <Square className="h-3 w-3" />
                              Lote:
                            </div>
                            <div className="font-semibold">{lot.name}</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <Ruler className="h-3 w-3" />
                              Área:
                            </div>
                            <div className="">{lot.area}</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <DollarSign className="h-3 w-3" />
                              Precio:
                            </div>
                            <div className="font-semibold text-green-600">
                              {(formatCurrency(Number(lot.lotPrice)), currency)}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <DollarSign className="h-3 w-3" />
                              Precio HU:
                            </div>
                            <div className="font-semibold text-blue-600">
                              {formatCurrency(Number(lot.urbanizationPrice), currency)}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              Precio Total:
                            </div>
                            <div className="font-bold text-purple-600">{lot.totalPrice}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/50"
              >
                <Square className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No hay registros</p>
              </motion.div>
            )}
          </div>
        ) : (
          <TableTemplate<Lot>
            table={table}
            columns={columns}
            showColumnVisibility={true}
            columnVisibilityLabel="Mostrar columnas"
          />
        )}
      </motion.div>
    </div>
  );
}
