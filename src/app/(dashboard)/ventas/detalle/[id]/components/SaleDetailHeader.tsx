'use client';

import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { formatCurrency } from '@lib/utils';
import { StatusBadge } from '@components/common/table/StatusBadge';
import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Phone,
  User,
  Users,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export default function SaleDetailHeader({ sale }: { sale: SaleList }) {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-gray-100">
                    Venta #{sale.id.substring(0, 8)}
                  </h1>
                  <StatusBadge status={sale.status} />
                  <Badge
                    variant={sale.type === 'FINANCED' ? 'default' : 'secondary'}
                    className="px-3 py-1"
                  >
                    {sale.type === 'FINANCED' ? '💳 Financiado' : '💰 Directo'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(sale.totalAmount, sale.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="group border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/50 dark:group-hover:bg-blue-900/70">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cliente</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nombre completo
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {sale.client.firstName} {sale.client.lastName}
                  </p>
                </div>
              </div>

              {sale.client.phone && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {sale.client.phone}
                    </p>
                  </div>
                </div>
              )}

              {sale.client.address && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Dirección
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {sale.client.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-900/50 dark:group-hover:bg-emerald-900/70">
                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Propiedad</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Building2 className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lote</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {sale.lot.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Precio del lote
                  </p>
                  <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sale.lot.lotPrice)}
                  </p>
                </div>
              </div>

              {sale.fromReservation && (
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Monto de reserva
                      </p>
                      <p className="text-base font-bold text-amber-900 dark:text-amber-200">
                        {formatCurrency(sale.reservationAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 transition-colors group-hover:bg-purple-200 dark:bg-purple-900/50 dark:group-hover:bg-purple-900/70">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Detalles</h3>
            </div>

            <div className="space-y-4">
              {sale.vendor && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendedor</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {sale.vendor.firstName} {sale.vendor.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📄 {sale.vendor.document}
                    </p>
                  </div>
                </div>
              )}

              {sale.guarantor && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Garante
                      </p>
                      <p className="text-base font-semibold text-blue-900 dark:text-blue-200">
                        {sale.guarantor.firstName} {sale.guarantor.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {sale.financing && (
                <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                      Financiamiento
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400">Inicial:</span>
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                        {formatCurrency(sale.financing.initialAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400">Tasa:</span>
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                        {sale.financing.interestRate}%
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-indigo-600 dark:text-indigo-400">Cuotas:</span>
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                        {sale.financing.quantityCoutes} pagos
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
