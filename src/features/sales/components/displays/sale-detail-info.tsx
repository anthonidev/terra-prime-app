'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, CreditCard, DollarSign, MapPin, User, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { UserInfo } from '@/shared/components/user-info';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { SaleDetail } from '../../types';

interface SaleDetailInfoProps {
  sale: SaleDetail;
}

export function SaleDetailInfo({ sale }: SaleDetailInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Información del Lote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-4 w-4" />
            </div>
            Información del Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Proyecto
              </p>
              <p className="font-semibold">{sale.lot.project}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Ubicación
              </p>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">
                  {sale.lot.stage} - {sale.lot.block} - {sale.lot.name}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Precio del Lote
              </p>
              <div className="flex items-center gap-1.5">
                <DollarSign className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatCurrency(sale.lot.lotPrice, sale.currency)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Monto Total Venta
              </p>
              <p className="text-primary text-lg font-bold">
                {formatCurrency(sale.totalAmount, sale.currency)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Tipo de Venta
              </p>
              <Badge variant="secondary" className="font-normal">
                <CreditCard className="mr-1 h-3 w-3" />
                {sale.type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Fecha de Contrato
              </p>
              <div className="flex items-center gap-1.5">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">
                  {sale.contractDate
                    ? format(new Date(sale.contractDate), 'dd MMM yyyy', { locale: es })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {sale.reservationAmount && (
            <div className="bg-muted/30 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Monto de Reserva</span>
                <span className="font-semibold">
                  {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                  {sale.reservationAmount.toLocaleString('es-PE')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <User className="text-primary h-4 w-4" />
            </div>
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserInfo
            name={`${sale.client.firstName} ${sale.client.lastName}`}
            phone={sale.client.phone}
            // document={sale.client.documentNumber} // Assuming documentNumber exists on client
            className="bg-muted/30 rounded-lg border p-3"
          />

          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Dirección
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p className="text-sm font-medium">{sale.client.address}</p>
            </div>
          </div>

          {sale.guarantor && (sale.guarantor.firstName || sale.guarantor.lastName) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-semibold">Garante</p>
                <UserInfo
                  name={`${sale.guarantor.firstName} ${sale.guarantor.lastName}`}
                  // phone={sale.guarantor.phone}
                  //  document={sale.guarantor.documentNumber}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            </>
          )}

          {sale.secondaryClients && sale.secondaryClients.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-semibold">Clientes Secundarios</p>
                <div className="space-y-2">
                  {sale.secondaryClients.map((client, index) => (
                    <UserInfo
                      key={index}
                      name={`${client.firstName} ${client.lastName}`}
                      phone={client.phone}
                      //  document={client.documentNumber}
                      className="bg-muted/30 rounded-lg border p-3"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Participantes de la Venta */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Users className="text-primary h-4 w-4" />
            </div>
            Participantes de la Venta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Vendor */}
            {sale.vendor && (sale.vendor.firstName || sale.vendor.lastName) && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Vendedor
                </p>
                <UserInfo
                  name={`${sale.vendor.firstName} ${sale.vendor.lastName}`}
                  document={sale.vendor.document}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            )}

            {/* Liner */}
            {sale.liner && (sale.liner.firstName || sale.liner.lastName) && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Liner
                </p>
                <UserInfo
                  name={`${sale.liner.firstName} ${sale.liner.lastName}`}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            )}

            {/* Telemarketing Supervisor */}
            {sale.telemarketingSupervisor &&
              (sale.telemarketingSupervisor.firstName || sale.telemarketingSupervisor.lastName) && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Supervisor Telemarketing
                  </p>
                  <UserInfo
                    name={`${sale.telemarketingSupervisor.firstName} ${sale.telemarketingSupervisor.lastName}`}
                    className="bg-muted/30 rounded-lg border p-3"
                  />
                </div>
              )}

            {/* Telemarketing Confirmer */}
            {sale.telemarketingConfirmer &&
              (sale.telemarketingConfirmer.firstName || sale.telemarketingConfirmer.lastName) && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Confirmador Telemarketing
                  </p>
                  <UserInfo
                    name={`${sale.telemarketingConfirmer.firstName} ${sale.telemarketingConfirmer.lastName}`}
                    className="bg-muted/30 rounded-lg border p-3"
                  />
                </div>
              )}

            {/* Telemarketer */}
            {sale.telemarketer && (sale.telemarketer.firstName || sale.telemarketer.lastName) && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Telemarketer
                </p>
                <UserInfo
                  name={`${sale.telemarketer.firstName} ${sale.telemarketer.lastName}`}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            )}

            {/* Field Manager */}
            {sale.fieldManager && (sale.fieldManager.firstName || sale.fieldManager.lastName) && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Gerente de Campo
                </p>
                <UserInfo
                  name={`${sale.fieldManager.firstName} ${sale.fieldManager.lastName}`}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            )}

            {/* Field Supervisor */}
            {sale.fieldSupervisor &&
              (sale.fieldSupervisor.firstName || sale.fieldSupervisor.lastName) && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Supervisor de Campo
                  </p>
                  <UserInfo
                    name={`${sale.fieldSupervisor.firstName} ${sale.fieldSupervisor.lastName}`}
                    className="bg-muted/30 rounded-lg border p-3"
                  />
                </div>
              )}

            {/* Field Seller */}
            {sale.fieldSeller && (sale.fieldSeller.firstName || sale.fieldSeller.lastName) && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Vendedor de Campo
                </p>
                <UserInfo
                  name={`${sale.fieldSeller.firstName} ${sale.fieldSeller.lastName}`}
                  className="bg-muted/30 rounded-lg border p-3"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
