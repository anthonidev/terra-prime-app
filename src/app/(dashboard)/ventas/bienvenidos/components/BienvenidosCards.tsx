import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, CreditCard, Phone, User } from 'lucide-react';
import AssignVendorButton from './AssignVendorButton';

type Props = {
  data: LeadsOfDay[];
};

export default function BienvenidosCards({ data }: Props) {
  const hasVendorAssigned = (lead: LeadsOfDay): boolean => {
    const vendor = lead.vendor;
    return vendor !== null && typeof vendor === 'object' && !Array.isArray(vendor);
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron bienvenidos
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
      {data.map((lead) => {
        const vendor = lead.vendor;
        const hasVendor = hasVendorAssigned(lead);

        return (
          <Card key={lead.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.age ? `${lead.age} años` : 'Edad no registrada'}
                    </p>
                  </div>
                </div>

                {hasVendor ? (
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
                    {lead.documentType}: {lead.document}
                  </span>
                </div>

                {lead.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{lead.phone}</span>
                  </div>
                )}

                {lead.source && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>Fuente: {lead.source.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Registrado:{' '}
                    {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>
              </div>

              {hasVendor && vendor && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Vendedor: {vendor.firstName} {vendor.lastName}
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {vendor.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                <AssignVendorButton leadId={lead.id} hasVendor={hasVendor} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
