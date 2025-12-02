'use client';

import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { UserInfo } from '@/shared/components/user-info';
import type { Client } from '../../types';

interface AssignedClientsTableProps {
  clients: Client[];
}

export function AssignedClientsTable({ clients }: AssignedClientsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'lead',
      header: 'Cliente',
      cell: ({ row }) => {
        const { lead } = row.original;
        return (
          <UserInfo
            name={`${lead.firstName} ${lead.lastName}`}
            document={lead.document}
            documentType={lead.documentType}
            phone={lead.phone}
            email={lead.email}
          />
        );
      },
    },
    {
      accessorKey: 'age',
      header: 'Edad',
      cell: ({ row }) => {
        const { lead } = row.original;
        return lead.age ? (
          <span>{lead.age} años</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'address',
      header: 'Dirección',
      cell: ({ row }) => {
        const { address, lead } = row.original;
        const ubigeo = lead.ubigeo;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-start gap-1.5">
              <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
              <span>{address}</span>
            </div>
            {ubigeo && (
              <span className="text-muted-foreground ml-5 text-xs">
                {ubigeo.departamento}, {ubigeo.provincia}, {ubigeo.distrito}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'hasActiveLatePayment',
      header: 'Estado',
      cell: ({ row }) => {
        const { hasActiveLatePayment } = row.original;
        return hasActiveLatePayment ? (
          <Badge variant="destructive">En Mora</Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
          >
            Al día
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <Link href={`/cobranza/clientes/ventas/${client.id}`}>Ver Ventas</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  if (isMobile) {
    return (
      <div className="space-y-3">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <UserInfo
                  name={`${client.lead.firstName} ${client.lead.lastName}`}
                  document={client.lead.document}
                  documentType={client.lead.documentType}
                  phone={client.lead.phone}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/cobranza/clientes/ventas/${client.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Edad:</span>
                <span>{client.lead.age ? `${client.lead.age} años` : '-'}</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-1.5">
                  <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5" />
                  <span>{client.address}</span>
                </div>
                {client.lead.ubigeo && (
                  <span className="text-muted-foreground ml-5 text-xs">
                    {client.lead.ubigeo.departamento}, {client.lead.ubigeo.provincia},{' '}
                    {client.lead.ubigeo.distrito}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground">Estado:</span>
                {client.hasActiveLatePayment ? (
                  <Badge variant="destructive">En Mora</Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Al día
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <DataTable columns={columns} data={clients} />;
}
