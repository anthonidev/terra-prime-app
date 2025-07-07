'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SaleList, SaleType } from '@domain/entities/sales/salevendor.entity';
import {
  User,
  Building2,
  CreditCard,
  DollarSign,
  MapPin,
  Phone,
  Users,
  FileText
} from 'lucide-react';
import { StatusBadge } from '@/components/common/table/StatusBadge';

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleList;
}

export default function SaleDetailModal({ isOpen, onClose, sale }: SaleDetailModalProps) {
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: sale.currency
    }).format(Number(amount));
  };

  const assignedParticipants = [
    { type: 'Liner', participant: sale.liner },
    { type: 'Supervisor de Telemarketing', participant: sale.telemarketingSupervisor },
    { type: 'Supervisor Confirmador', participant: sale.telemarketingConfirmer },
    { type: 'Telemarketer', participant: sale.telemarketer },
    { type: 'Jefe de Campo', participant: sale.fieldManager },
    { type: 'Supervisor de Campo', participant: sale.fieldSupervisor },
    { type: 'Vendedor de Campo', participant: sale.fieldSeller }
  ].filter((item) => item.participant);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle de Venta
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[50vh] space-y-6 overflow-auto px-4">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente Principal
                  </p>
                  <p className="text-base font-medium">
                    {sale.client.firstName} {sale.client.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{sale.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{sale.client.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la Venta
                  </p>
                  <StatusBadge status={sale.status} />
                  <div className="mt-2">
                    <Badge variant={sale.type === SaleType.FINANCED ? 'default' : 'secondary'}>
                      {sale.type === SaleType.FINANCED ? 'Financiado' : 'Pago Directo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Clientes Secundarios */}
              {sale.secondaryClients && sale.secondaryClients.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Clientes Secundarios
                  </p>
                  <div className="space-y-2">
                    {sale.secondaryClients.map((client, index) => (
                      <div key={index} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <p className="font-medium">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{client.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{client.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Lote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5" />
                Información del Lote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Proyecto</p>
                  <p className="text-lg font-semibold">{sale.lot.project}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lote</p>
                  <p className="text-lg font-semibold">{sale.lot.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Etapa</p>
                  <p className="font-medium">{sale.lot.stage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Manzana</p>
                  <p className="font-medium">{sale.lot.block}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Precio del Lote
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(sale.lot.lotPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total de la Venta
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(sale.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Financiamiento */}
          {sale.financing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5" />
                  Financiamiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cuota Inicial
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(sale.financing.initialAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tasa de Interés
                    </p>
                    <p className="text-lg font-semibold">{sale.financing.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de Cuotas
                    </p>
                    <p className="text-lg font-semibold">{sale.financing.quantityCoutes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vendedor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                Vendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">
                    {sale.vendor.firstName} {sale.vendor.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    DNI: {sale.vendor.document}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participantes Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                Participantes Asignados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedParticipants.length > 0 ? (
                <div className="space-y-3">
                  {assignedParticipants.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium">
                          {item.participant?.firstName} {item.participant?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.type}</p>
                      </div>
                      <StatusBadge status={item.type.toUpperCase()} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No hay participantes asignados a esta venta
                </p>
              )}
            </CardContent>
          </Card>

          {/* Garantía */}
          {sale.guarantor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-5 w-5" />
                  Garante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {sale.guarantor.firstName} {sale.guarantor.lastName}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reserva */}
          {sale.fromReservation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(sale.reservationAmount)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
