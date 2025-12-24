'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ColumnDef } from '@tanstack/react-table';
import { UserPlus, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTableWithSelection } from '@/shared/components/data-table/data-table-with-selection';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { UserInfo } from '@/shared/components/user-info';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AssignCollectorDialog } from '../dialogs/assign-collector-dialog';
import type { Client } from '../../types';

interface ClientsAdminTableProps {
  clients: Client[];
}

export function ClientsAdminTable({ clients }: ClientsAdminTableProps) {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);

  // Check if user is SCO (Supervisor de Cobranza)
  const isSCO = user?.role?.code === 'SCO';

  const handleAssignMultiple = (selectedRows: Client[]) => {
    const ids = selectedRows.map((client) => client.id);
    setSelectedClientIds(ids);
    setIsDialogOpen(true);
  };

  const handleAssignSingle = (client: Client) => {
    setSelectedClientIds([client.id]);
    setIsDialogOpen(true);
  };

  const handleMobileSelect = (clientId: number, isSelected: boolean) => {
    setSelectedClientIds((prev) =>
      isSelected ? [...prev, clientId] : prev.filter((id) => id !== clientId)
    );
  };

  const handleMobileAssignSelected = () => {
    if (selectedClientIds.length > 0) {
      setIsDialogOpen(true);
    }
  };

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
      accessorKey: 'collector',
      header: 'Cobrador',
      cell: ({ row }) => {
        const { collector } = row.original;
        if (!collector) {
          return (
            <Badge variant="secondary" className="text-xs">
              Sin asignar
            </Badge>
          );
        }
        return (
          <UserInfo
            name={`${collector.firstName} ${collector.lastName}`}
            className="gap-2"
            email={collector.email}
          />
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original;
        const hasCollector = !!client.collector;
        return (
          <div className="flex items-center gap-2">
            {isSCO && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAssignSingle(client)}
                className="h-8"
              >
                <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                {hasCollector ? 'Reasignar' : 'Asignar'}
              </Button>
            )}
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
      <>
        {isSCO && selectedClientIds.length > 0 && (
          <div className="mb-4">
            <Button onClick={handleMobileAssignSelected} className="w-full" size="sm">
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Asignar seleccionados ({selectedClientIds.length})
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {clients.map((client) => (
            <Card
              key={client.id}
              className={`transition-colors ${
                isSCO && selectedClientIds.includes(client.id) ? 'border-primary' : ''
              }`}
              onClick={
                isSCO
                  ? () => handleMobileSelect(client.id, !selectedClientIds.includes(client.id))
                  : undefined
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <UserInfo
                    name={`${client.lead.firstName} ${client.lead.lastName}`}
                    document={client.lead.document}
                    documentType={client.lead.documentType}
                    phone={client.lead.phone}
                  />
                  <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/cobranza/clientes/ventas/${client.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {isSCO && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAssignSingle(client)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
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
                  <span className="text-muted-foreground text-xs">Cobrador:</span>
                  {client.collector ? (
                    <span className="font-medium">
                      {client.collector.firstName} {client.collector.lastName}
                    </span>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Sin asignar
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isSCO && (
          <AssignCollectorDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setSelectedClientIds([]);
            }}
            clientIds={selectedClientIds}
            onSuccess={() => setSelectedClientIds([])}
          />
        )}
      </>
    );
  }

  // If not SCO, render table without selection
  if (!isSCO) {
    return <DataTable columns={columns} data={clients} />;
  }

  return (
    <>
      <DataTableWithSelection
        columns={columns}
        data={clients}
        selectionAction={{
          label: 'Asignar seleccionados',
          onClick: handleAssignMultiple,
        }}
      />

      <AssignCollectorDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedClientIds([]);
        }}
        clientIds={selectedClientIds}
        onSuccess={() => setSelectedClientIds([])}
      />
    </>
  );
}
