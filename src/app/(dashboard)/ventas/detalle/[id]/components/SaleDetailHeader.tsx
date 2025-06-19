'use client';

import { Card, CardContent } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@components/common/table/StatusBadge';
import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Phone,
  User,
  Users
} from 'lucide-react';

export default function SaleDetailHeader({ sale }: { sale: SaleList | null }) {
  if (!sale) return null;

  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Venta #{sale.id.substring(0, 8)}
                  </h1>
                  {<StatusBadge status={sale.status} />}
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(sale.totalAmount, sale.currency)}
                    </span>
                  </div>
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Tipo: {sale.type}</span>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información del cliente
              </h3>
            </div>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {sale.client.firstName} {sale.client.lastName}
                  </p>
                </div>
              </div>
              {sale.client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sale.client.phone}
                    </p>
                  </div>
                </div>
              )}
              {sale.client.address && (
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sale.client.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información del lote
              </h3>
            </div>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lote</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{sale.lot.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio del lote</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(sale.lot.lotPrice)}
                  </p>
                </div>
              </div>
              {sale.reservation && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reserva</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(sale.reservation.amount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información adicional
              </h3>
            </div>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              {sale.vendor && (
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Vendedor</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sale.vendor.firstName} {sale.vendor.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Doc: {sale.vendor.document}
                    </p>
                  </div>
                </div>
              )}
              {sale.guarantor && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Garante</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sale.guarantor.firstName} {sale.guarantor.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
