'use client';

import { User, Building2, MapPin, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserInfo } from '@/shared/components/user-info';
import type { MyPaymentDetail } from '../../types';

interface ClientLotSectionProps {
  payment: MyPaymentDetail;
}

export function ClientLotSection({ payment }: ClientLotSectionProps) {
  const client = payment.client;
  const lead = client?.lead;
  const lot = payment.lot;

  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="text-primary h-5 w-5" />
          Cliente y Lote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Information */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
            Información del Cliente
          </h3>

          {lead && (lead.firstName || lead.lastName) ? (
            <div className="space-y-4">
              <UserInfo name={`${lead.firstName} ${lead.lastName}`} document={lead.document} />

              {client?.address && (
                <div className="flex items-start gap-3 pl-1">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-muted-foreground text-sm">{client.address}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">Sin información del cliente</p>
          )}
        </div>

        <Separator />

        {/* Lot Information */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
            Información del Lote
          </h3>

          {lot && lot.name ? (
            <div className="bg-muted/30 border-border/50 space-y-4 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-md p-2">
                  <Building2 className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{lot.name}</p>
                  {lot.project && <p className="text-muted-foreground text-sm">{lot.project}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {(lot.stage || lot.block) && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">Ubicación</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="text-sm font-medium">
                        {[lot.stage, lot.block].filter(Boolean).join(' - ')}
                      </span>
                    </div>
                  </div>
                )}

                {lot.lotPrice && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">Precio del Lote</p>
                    <div className="flex items-center gap-1.5">
                      <Home className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="text-sm font-medium">
                        {payment.currency === 'USD' ? '$' : 'S/'} {lot.lotPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">Sin información del lote</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
