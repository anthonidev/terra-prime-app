import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Liner } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, UserCheck } from 'lucide-react';
import UpdateLinerButton from './buttons/UpdateLinerButton';

type Props = {
  data: Liner[];
};

const LinnerCards = ({ data }: Props) => {
  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <UserCheck className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron liners
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((liner) => (
        <Card key={liner.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <UserCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {liner.firstName} {liner.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{liner.fullName}</p>
                </div>
              </div>

              <Badge
                variant={liner.isActive ? 'default' : 'secondary'}
                className={
                  liner.isActive
                    ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }
              >
                {liner.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CreditCard className="h-4 w-4" />
                <span>
                  {liner.documentType}: {liner.document}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Creado: {format(new Date(liner.createdAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Actualizado: {format(new Date(liner.updatedAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-2 dark:border-gray-800">
              <UpdateLinerButton liner={liner} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LinnerCards;
