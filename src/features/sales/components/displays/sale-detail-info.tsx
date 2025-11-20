'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, User, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { SaleDetail } from '../../types';
import { formatCurrency } from '@/shared/utils/currency-formatter';

interface SaleDetailInfoProps {
  sale: SaleDetail;
}

export function SaleDetailInfo({ sale }: SaleDetailInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Información del Lote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información del Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Proyecto</p>
            <p className="font-medium">{sale.lot.project}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Etapa</p>
              <p className="font-medium">{sale.lot.stage}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Manzana</p>
              <p className="font-medium">{sale.lot.block}</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Lote</p>
            <p className="font-medium">{sale.lot.name}</p>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground text-sm">Precio del Lote</p>
            <p className="text-lg font-medium">
              {formatCurrency(sale.lot.lotPrice, sale.currency)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Monto Total de la Venta</p>
            <p className="text-lg font-medium">{formatCurrency(sale.totalAmount, sale.currency)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Tipo de Venta</p>
              <p className="font-medium">
                {sale.type === 'DIRECT_PAYMENT' ? 'Contado' : 'Financiado'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Fecha de Contrato</p>
              <p className="font-medium">
                {sale.contractDate
                  ? format(new Date(sale.contractDate), 'dd MMM yyyy', { locale: es })
                  : 'N/A'}
              </p>
            </div>
          </div>
          {sale.reservationAmount && (
            <div>
              <p className="text-muted-foreground text-sm">Monto de Reserva</p>
              <p className="font-medium">
                {sale.currency === 'USD' ? '$' : 'S/'}{' '}
                {sale.reservationAmount.toLocaleString('es-PE')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Cliente y Garante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Nombre Completo</p>
            <p className="font-medium">
              {sale.client.firstName} {sale.client.lastName}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Teléfono</p>
              <p className="font-medium">{sale.client.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Dirección</p>
              <p className="font-medium">{sale.client.address}</p>
            </div>
          </div>

          {sale.guarantor && (sale.guarantor.firstName || sale.guarantor.lastName) && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Garante</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Nombre Completo</p>
                <p className="font-medium">
                  {sale.guarantor.firstName} {sale.guarantor.lastName}
                </p>
              </div>
            </>
          )}

          {sale.secondaryClients && sale.secondaryClients.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Clientes Secundarios</p>
              </div>
              {sale.secondaryClients.map((client, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Cliente Secundario {index + 1}</p>
                    <p className="font-medium">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-muted-foreground text-sm">{client.phone}</p>
                  </div>
                  {index < sale.secondaryClients.length - 1 && <Separator />}
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Información de Participantes */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes de la Venta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Vendor */}
            {sale.vendor && (sale.vendor.firstName || sale.vendor.lastName) && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">Vendedor</p>
                <p className="font-medium">
                  {sale.vendor.firstName} {sale.vendor.lastName}
                </p>
                <p className="text-muted-foreground text-sm">{sale.vendor.document}</p>
              </div>
            )}

            {/* Liner */}
            {sale.liner && (sale.liner.firstName || sale.liner.lastName) && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">Liner</p>
                <p className="font-medium">
                  {sale.liner.firstName} {sale.liner.lastName}
                </p>
              </div>
            )}

            {/* Telemarketing Supervisor */}
            {sale.telemarketingSupervisor &&
              (sale.telemarketingSupervisor.firstName || sale.telemarketingSupervisor.lastName) && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-semibold">
                    Supervisor Telemarketing
                  </p>
                  <p className="font-medium">
                    {sale.telemarketingSupervisor.firstName} {sale.telemarketingSupervisor.lastName}
                  </p>
                </div>
              )}

            {/* Telemarketing Confirmer */}
            {sale.telemarketingConfirmer &&
              (sale.telemarketingConfirmer.firstName || sale.telemarketingConfirmer.lastName) && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-semibold">
                    Confirmador Telemarketing
                  </p>
                  <p className="font-medium">
                    {sale.telemarketingConfirmer.firstName} {sale.telemarketingConfirmer.lastName}
                  </p>
                </div>
              )}

            {/* Telemarketer */}
            {sale.telemarketer && (sale.telemarketer.firstName || sale.telemarketer.lastName) && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">Telemarketer</p>
                <p className="font-medium">
                  {sale.telemarketer.firstName} {sale.telemarketer.lastName}
                </p>
              </div>
            )}

            {/* Field Manager */}
            {sale.fieldManager && (sale.fieldManager.firstName || sale.fieldManager.lastName) && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">Gerente de Campo</p>
                <p className="font-medium">
                  {sale.fieldManager.firstName} {sale.fieldManager.lastName}
                </p>
              </div>
            )}

            {/* Field Supervisor */}
            {sale.fieldSupervisor &&
              (sale.fieldSupervisor.firstName || sale.fieldSupervisor.lastName) && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-semibold">
                    Supervisor de Campo
                  </p>
                  <p className="font-medium">
                    {sale.fieldSupervisor.firstName} {sale.fieldSupervisor.lastName}
                  </p>
                </div>
              )}

            {/* Field Seller */}
            {sale.fieldSeller && (sale.fieldSeller.firstName || sale.fieldSeller.lastName) && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">
                  Vendedor de Campo
                </p>
                <p className="font-medium">
                  {sale.fieldSeller.firstName} {sale.fieldSeller.lastName}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
