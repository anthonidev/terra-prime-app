import { Badge } from '@components/ui/badge';
import { Card, CardContent } from '@components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, CreditCard, Phone, User } from 'lucide-react';
import AssignCollectorButton from './AssignCollectorButton';
import { CollectionsClient } from '@domain/entities/cobranza';

export default function CobradoresCards({ data }: { data: CollectionsClient[] }) {
  const hasCollectorAssigned = (client: CollectionsClient): boolean => {
    const collector = client.collector;
    return collector !== null && typeof collector === 'object' && !Array.isArray(collector);
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron clientes
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
      {data.map((client) => {
        const collector = client.collector;
        const hasCollector = hasCollectorAssigned(client);

        return (
          <Card key={client.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {client.lead.firstName} {client.lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {client.lead.age ? `${client.lead.age} años` : 'Edad no registrada'}
                    </p>
                  </div>
                </div>
                {hasCollector ? (
                  <Badge variant="default" className="border-green-200 bg-green-100 text-green-700">
                    Asignado
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                  >
                    Sin asignar
                  </Badge>
                )}
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {client.lead.documentType}: {client.lead.document}
                  </span>
                </div>

                {client.lead.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{client.lead.phone}</span>
                  </div>
                )}

                {client.lead.source && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>Fuente: {client.lead.source.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Registrado:&nbsp;
                    {format(new Date(client.lead.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
              </div>

              {hasCollector && collector && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Cobrador: {collector.firstName} {collector.lastName}
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {collector.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                <AssignCollectorButton clientId={client.id} hasCollector={hasCollector} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
