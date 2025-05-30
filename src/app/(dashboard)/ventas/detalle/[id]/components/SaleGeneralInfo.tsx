'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { SaleResponse } from '@/types/sales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, DollarSign, Home, Phone, User, Users } from 'lucide-react';

interface SaleGeneralInfoProps {
  sale: SaleResponse;
}

export default function SaleGeneralInfo({ sale }: SaleGeneralInfoProps) {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Client & Guarantor Details */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Detalles de personas involucradas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Section */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <User className="h-4 w-4 text-blue-500" />
              Cliente
            </h4>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {sale.client.firstName} {sale.client.lastName}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Cliente principal</p>
                  </div>
                </div>
                {sale.client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {sale.client.phone}
                    </span>
                  </div>
                )}
                {sale.client.address && (
                  <div className="flex items-start gap-3">
                    <Home className="mt-0.5 h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {sale.client.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guarantor Section */}
          {sale.guarantor && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Users className="h-4 w-4 text-purple-500" />
                Garante
              </h4>
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900 dark:text-purple-100">
                      {sale.guarantor.firstName} {sale.guarantor.lastName}
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Responsable subsidiario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Section */}
          {sale.vendor && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <User className="h-4 w-4 text-green-500" />
                Vendedor
              </h4>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {sale.vendor.firstName} {sale.vendor.lastName}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Doc: {sale.vendor.document}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property & Financial Details */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Detalles del lote y financieros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Section */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <Building2 className="h-4 w-4 text-green-500" />
              Lote
            </h4>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {sale.lot.name}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">Identificación</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {formatCurrency(sale.lot.lotPrice)}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">Precio del lote</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Section */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              Resumen financiero
            </h4>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Precio del lote:
                  </span>
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">
                    {formatCurrency(sale.lot.lotPrice)}
                  </span>
                </div>
                {sale.reservation && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">Reserva:</span>
                    <span className="font-medium text-yellow-900 dark:text-yellow-100">
                      {formatCurrency(sale.reservation.amount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-yellow-200 pt-2 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Total de la venta:
                    </span>
                    <span className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <Calendar className="h-4 w-4 text-blue-500" />
              Fechas importantes
            </h4>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {formatDate(sale.contractDate)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Fecha de contrato</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {formatDate(sale.saleDate)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Fecha de venta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
