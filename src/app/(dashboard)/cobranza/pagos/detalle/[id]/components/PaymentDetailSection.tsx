import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { Square, User, UserCheck } from 'lucide-react';

export default function PaymentDetailSection({ payment }: { payment: PaymentDetailItem }) {
  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 dark:bg-gray-900">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Detalles del Pago
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Información completa de la transacción y participantes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="group transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:group-hover:bg-blue-950/70">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Información del Vendedor
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Propietario del pago</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium break-all text-gray-900 dark:text-gray-100">
                  {payment.user.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Nombre Completo
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.user.firstName} {payment.user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Documento
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.user.document ?? 'Sin documento'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 transition-colors group-hover:bg-green-100 dark:bg-green-950/50 dark:group-hover:bg-green-950/70">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Información del Cliente
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Datos del comprador</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Nombre Completo
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.client.lead.firstName} {payment.client.lead.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Documento
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.client.lead.document ?? 'Sin documento'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Dirección
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.client.address ?? 'No registrada'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 transition-colors group-hover:bg-purple-100 dark:bg-purple-950/50 dark:group-hover:bg-purple-950/70">
                <Square className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Información del Lote
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detalles de la propiedad</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Lote
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {payment.lot.name ?? 'No especificado'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Etapa
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.lot.stage ?? 'No especificada'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  Manzana
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {payment.lot.block ?? 'No especificada'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {payment.reviewBy && (
          <Card className="group transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 transition-colors group-hover:bg-orange-100 dark:bg-orange-950/50 dark:group-hover:bg-orange-950/70">
                  <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Revisado por</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Administrador autorizante
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                    Email del Administrador
                  </p>
                  <p className="mt-1 text-sm font-medium break-all text-gray-900 dark:text-gray-100">
                    {payment.reviewBy.email ?? 'No especificado'}
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Pago verificado y aprobado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
