'use client';

import { User, Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PaymentDetail } from '../../types';

interface ClientLotSectionProps {
  payment: PaymentDetail;
}

export function ClientLotSection({ payment }: ClientLotSectionProps) {
  const client = payment.client;
  const lead = client?.lead;
  const lot = payment.lot;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cliente y Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Information */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Información del Cliente
          </h3>

          {lead && (lead.firstName || lead.lastName) ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                <p className="text-base">
                  {lead.firstName} {lead.lastName}
                </p>
              </div>

              {lead.document && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documento</p>
                  <p className="text-base">{lead.document}</p>
                </div>
              )}

              {client?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p className="text-base">{client.address}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información del cliente</p>
          )}
        </div>

        <Separator />

        {/* Lot Information */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Información del Lote
          </h3>

          {lot && lot.name ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lote</p>
                <p className="text-base font-semibold">{lot.name}</p>
              </div>

              {lot.project && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Proyecto</p>
                  <p className="text-base">{lot.project}</p>
                </div>
              )}

              {(lot.stage || lot.block) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                    <p className="text-base">
                      {[lot.stage, lot.block].filter(Boolean).join(' - ')}
                    </p>
                  </div>
                </div>
              )}

              {lot.lotPrice && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precio del Lote</p>
                  <p className="text-base font-semibold">
                    {payment.currency === 'USD' ? '$' : 'S/'} {lot.lotPrice}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información del lote</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
