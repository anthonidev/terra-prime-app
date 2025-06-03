'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';
import { useProyectLots } from '../../hooks/useProyectLots';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import TableTemplate from '@/components/common/table/TableTemplate';
import { ProyectLotsItems } from '@/types/sales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface Props {
  blockId: string;
  onBack: () => void;
}

export default function LotsLayer({ blockId, onBack }: Props) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false
  });
  const [searchData, setSearchData] = React.useState<string>('');
  const { lots = [], isLoading } = useProyectLots(blockId);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredData = React.useMemo(() => {
    if (!searchData) return lots;
    return lots.filter((lot) => lot.name.toLowerCase().includes(searchData.toLowerCase()));
  }, [lots, searchData]);

  const columns = React.useMemo<ColumnDef<ProyectLotsItems>[]>(
    () => [
      {
        id: 'index',
        header: () => 'Nº',
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => <div className="text-sm">{row.getValue('name')}</div>,
        enableHiding: false
      },
      {
        accessorKey: 'area',
        header: 'Area m2',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('area')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'lotPrice',
        header: 'Precio',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('lotPrice')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'urbanizationPrice',
        header: 'Precio HU',
        cell: ({ row }) => (
          <div className="text-sm font-medium">{row.getValue('urbanizationPrice')}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={row.getValue('status') ? 'default' : 'destructive'}>
            {row.getValue('status')}
          </Badge>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div className="text-sm">
            {format(new Date(row.getValue('createdAt')), 'PPP', { locale: es })}
          </div>
        ),
        enableHiding: true
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });
  return (
    <div>
      <div className="inline-flex h-auto w-full items-center justify-between pb-4">
        <Button variant="outline" onClick={onBack} className="bg-white dark:bg-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-white pl-10 text-sm dark:bg-gray-900"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : isMobile ? (
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((lot, index) => (
                <Card key={lot.id} className="overflow-hidden p-0">
                  <CardContent className="p-0">
                    <div className="flex flex-col divide-y">
                      <div className="flex items-center justify-between bg-gradient-to-r from-[#025864] to-[#00CA7C] p-4">
                        <StatusBadge status={lot.status} />
                        <div className="text-sm font-medium text-slate-100">
                          <span>#{index + 1}</span>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 text-sm font-medium">
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Lote:</div>
                          <div className="">{lot.name}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Área:</div>
                          <div className="">{lot.area}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio:</div>
                          <div className="">{lot.lotPrice}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio HU:</div>
                          <div className="">{lot.urbanizationPrice}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio Total:</div>
                          <div className="">{lot.totalPrice}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No hay registros</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border bg-white p-2 dark:bg-gray-900">
            <TableTemplate<ProyectLotsItems>
              table={table}
              columns={columns}
              showColumnVisibility={true}
              columnVisibilityLabel="Mostrar columnas"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
