import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  User,
  CreditCard,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
  FileText,
  AlertCircle
} from 'lucide-react';
import { PaymentWithCollector } from '@domain/entities/cobranza';

export default function SupervisorCards({ data }: { data: PaymentWithCollector[] }) {
  const formatCurrency = (amount: number, currency = 'PEN') => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprobado
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rechazado
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron registros
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((payment) => {
        return (
          <Card key={payment.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Pago #{payment.id}
                    </h3>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                </div>
                <div className="text-right">{getStatusBadge(payment.status)}</div>
              </div>

              {payment.client && (
                <div className="mb-3 rounded-lg border bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Cliente
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {payment.client.lead.firstName} {payment.client.lead.lastName}
                    </p>
                    <p className="text-xs text-gray-500">DNI: {payment.client.lead.document}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{payment.client.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {payment.lot && (
                <div className="mb-3 rounded-lg border bg-green-50 p-3 dark:bg-green-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Lote
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Lote {payment.lot.name}</p>
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(Number(payment.lot.lotPrice))}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{payment.lot.project}</p>
                    <p className="text-xs text-gray-500">
                      {payment.lot.stage} - Manzana {payment.lot.block}
                    </p>
                  </div>
                </div>
              )}

              {payment.user && (
                <div className="mb-3 rounded-lg border bg-purple-50 p-3 dark:bg-purple-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Cobrador
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {payment.user.firstName} {payment.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{payment.user.email}</p>
                    <p className="text-xs text-gray-500">Doc: {payment.user.document}</p>
                  </div>
                </div>
              )}

              {(payment.banckName || payment.codeOperation || payment.numberTicket) && (
                <div className="mb-3 rounded-lg border bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Info Bancaria
                    </span>
                  </div>
                  <div className="space-y-1">
                    {payment.banckName && (
                      <p className="text-sm font-medium">{payment.banckName}</p>
                    )}
                    {payment.codeOperation && (
                      <p className="text-xs text-gray-500">Operación: {payment.codeOperation}</p>
                    )}
                    {payment.numberTicket && (
                      <p className="text-xs text-gray-500">Ticket: {payment.numberTicket}</p>
                    )}
                    {payment.dateOperation && (
                      <p className="text-xs text-gray-500">
                        Fecha:{' '}
                        {format(new Date(payment.dateOperation), 'dd/MM/yyyy', { locale: es })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {payment.reason && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:bg-red-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">
                      Motivo de Rechazo
                    </span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">{payment.reason}</p>
                </div>
              )}

              {payment.reviewedAt && (
                <div className="mb-3 rounded-lg border bg-indigo-50 p-3 dark:bg-indigo-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Revisión
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">
                      Revisado:{' '}
                      {format(new Date(payment.reviewedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </p>
                    {payment.reviewBy && (
                      <p className="text-xs text-gray-500">Por: {payment.reviewBy.email}</p>
                    )}
                  </div>
                </div>
              )}

              {payment.paymentConfig && (
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="h-3 w-3" />
                  <span>{payment.paymentConfig}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
