'use client';

import { MapPin, User, Users, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInfo } from '@/shared/components/user-info';
import { formatCurrency } from '@/shared/lib/utils';
import type { GetSaleDetailResponse } from '../../types';

interface SaleDetailInfoProps {
  data: GetSaleDetailResponse;
}

export function SaleDetailInfo({ data }: SaleDetailInfoProps) {
  const { client, sale } = data;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Lote Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Información del Lote</CardTitle>
          <Building2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="space-y-2 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proyecto:</span>
            <span className="font-medium">{sale.lot.project}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Etapa:</span>
            <span className="font-medium">{sale.lot.stage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Manzana/Lote:</span>
            <span className="font-medium">
              {sale.lot.block} - {sale.lot.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precio:</span>
            <span className="font-medium">
              {formatCurrency(Number(sale.lot.lotPrice))} {sale.currency}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cliente Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cliente Titular</CardTitle>
          <User className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="pt-4">
          <UserInfo
            name={`${client.firstName} ${client.lastName}`}
            document={client.document}
            documentType={client.documentType}
            phone={client.phone || undefined}
          />
          <div className="text-muted-foreground mt-2 flex items-start gap-1.5 text-xs">
            <MapPin className="mt-0.5 h-3.5 w-3.5" />
            <span>
              {client.address}
              <br />
              {client.ubigeo.departamento}, {client.ubigeo.provincia}, {client.ubigeo.distrito}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Garante / Participantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Garante y Participantes</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {sale.guarantor ? (
            <div>
              <span className="text-muted-foreground mb-1 block text-xs font-medium">Garante</span>
              <UserInfo
                name={`${sale.guarantor.firstName} ${sale.guarantor.lastName}`}
                document={sale.guarantor.document}
                documentType={sale.guarantor.documentType}
                phone={sale.guarantor.phone}
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">Sin garante asignado</div>
          )}

          {sale.secondaryClients && sale.secondaryClients.length > 0 && (
            <div>
              <span className="text-muted-foreground mb-1 block text-xs font-medium">
                Participantes ({sale.secondaryClients.length})
              </span>
              <div className="space-y-2">
                {sale.secondaryClients.map((participant, index) => (
                  <UserInfo
                    key={index}
                    name={`${participant.firstName} ${participant.lastName}`}
                    document={participant.document}
                    documentType={participant.documentType}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
