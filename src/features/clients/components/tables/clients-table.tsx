'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MapPin, Mail, Phone, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { UserInfo } from '@/shared/components/user-info';
import type { Client } from '../../types';

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'client',
      header: 'Cliente',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <UserInfo
            name={`${client.firstName} ${client.lastName}`}
            document={client.document}
            documentType={client.documentType}
            phone={client.phone || undefined}
            email={client.email || undefined}
          />
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'Contacto',
      cell: ({ row }) => {
        const { email, phone } = row.original;
        if (!email && !phone) {
          return <span className="text-muted-foreground text-sm">Sin contacto</span>;
        }
        return (
          <div className="flex flex-col gap-1 text-sm">
            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="text-muted-foreground h-3.5 w-3.5" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="text-muted-foreground h-3.5 w-3.5" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'ubigeo',
      header: 'Ubicacion',
      cell: ({ row }) => {
        const { ubigeo, address } = row.original;
        if (!ubigeo && !address) {
          return <span className="text-muted-foreground text-sm">Sin ubicacion</span>;
        }
        return (
          <div className="flex flex-col gap-1 text-sm">
            {address && (
              <div className="flex items-start gap-1.5">
                <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">{address}</span>
              </div>
            )}
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
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
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
                  name={`${client.firstName} ${client.lastName}`}
                  document={client.document}
                  documentType={client.documentType}
                />
                <Badge variant={client.isActive ? 'default' : 'secondary'} className="text-xs">
                  {client.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              {/* Contact Info */}
              {(client.email || client.phone) && (
                <div className="flex flex-col gap-1.5">
                  {client.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="text-muted-foreground h-3.5 w-3.5" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              {(client.address || client.ubigeo) && (
                <div className="border-t pt-2">
                  {client.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{client.address}</span>
                    </div>
                  )}
                  {client.ubigeo && (
                    <span className="text-muted-foreground ml-5 text-xs">
                      {client.ubigeo.departamento}, {client.ubigeo.provincia},{' '}
                      {client.ubigeo.distrito}
                    </span>
                  )}
                </div>
              )}

              {/* Document */}
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground text-xs">Documento:</span>
                <div className="flex items-center gap-1.5">
                  <FileText className="text-muted-foreground h-3.5 w-3.5" />
                  <Badge variant="outline" className="text-xs">
                    {client.documentType}
                  </Badge>
                  <span className="font-mono text-xs">{client.document}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <DataTable columns={columns} data={clients} />;
}
