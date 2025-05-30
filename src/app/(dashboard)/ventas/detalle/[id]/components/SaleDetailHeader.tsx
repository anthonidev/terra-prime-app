'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import { SaleResponse } from '@/types/sales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Phone,
  User,
  Users
} from 'lucide-react';

interface SaleDetailHeaderProps {
  sale: SaleResponse | null;
}

export default function SaleDetailHeader({ sale }: SaleDetailHeaderProps) {
  if (!sale) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'completado':
        return (
          <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
            Completado
          </Badge>
        );
      case 'pending':
      case 'pendiente':
        return (
          <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
            Pendiente
          </Badge>
        );
      case 'cancelled':
      case 'cancelado':
        return (
          <Badge className="border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="border-gray-200 bg-gray-100 text-gray-700">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Main Header */}
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Sale Information */}
          <div className="flex-1">
            {/* Primary Info */}
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Venta #{sale.id.substring(0, 8)}
                  </h1>
                  {getStatusBadge(sale.status)}
                </div>
                {/* Amount & Type Info */}
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(sale.totalAmount)}
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
                {/* Contract & Sale Dates */}
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Contrato: {formatDate(sale.contractDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Venta: {formatDate(sale.saleDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
        </div>

        <Separator className="mb-6" />

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Client Information */}
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
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de creación</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="cursor-help font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(sale.saleDate)}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatDateTime(sale.saleDate)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
