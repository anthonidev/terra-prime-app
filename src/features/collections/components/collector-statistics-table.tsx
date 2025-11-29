'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/data-table/data-table';
import { UserInfo } from '@/shared/components/user-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CollectorStatistic } from '../types';

interface CollectorStatisticsTableProps {
  data: CollectorStatistic[];
}

export function CollectorStatisticsTable({ data }: CollectorStatisticsTableProps) {
  const columns: ColumnDef<CollectorStatistic>[] = [
    {
      accessorKey: 'collector',
      header: 'Cobrador',
      cell: ({ row }) => {
        const { collectorName, collectorEmail, collectorDocument, photo } = row.original;
        return (
          <UserInfo
            name={collectorName}
            email={collectorEmail}
            document={collectorDocument}
            photo={photo}
          />
        );
      },
    },
    {
      accessorKey: 'numberOfClients',
      header: 'Clientes',
      cell: ({ row }) => <div className="font-medium">{row.original.numberOfClients}</div>,
    },
    {
      accessorKey: 'collectedAmount',
      header: 'Recaudado',
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-green-600">
            S/{' '}
            {row.original.collectedAmountPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-muted-foreground text-xs">
            ${' '}
            {row.original.collectedAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'pendingAmount',
      header: 'Pendiente',
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-amber-600">
            S/ {row.original.pendingAmountPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-muted-foreground text-xs">
            $ {row.original.pendingAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={data} />
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item) => (
          <Card key={item.collectorId}>
            <CardHeader className="pb-2">
              <UserInfo
                name={item.collectorName}
                email={item.collectorEmail}
                document={item.collectorDocument}
                photo={item.photo}
              />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Clientes</span>
                <Badge variant="secondary">{item.numberOfClients}</Badge>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase">
                  Recaudado
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-600">
                    S/{' '}
                    {item.collectedAmountPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ${' '}
                    {item.collectedAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase">
                  Pendiente
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-amber-600">
                    S/ {item.pendingAmountPEN.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    $ {item.pendingAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <div className="text-muted-foreground bg-card rounded-lg border py-8 text-center">
            No se encontraron resultados
          </div>
        )}
      </div>
    </>
  );
}
