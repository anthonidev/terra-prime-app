import { LeadSource } from '@/types/leads.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import UpdateLeadSourceButton from './buttons/UpdateLeadSourceButton';

type Props = {
  data: LeadSource[];
};

const LeadSourceCards = ({ data }: Props) => {
  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron fuentes
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
      {data.map((source) => (
        <Card key={source.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{source.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: #{source.id}</p>
                </div>
              </div>

              <Badge
                variant={source.isActive ? 'default' : 'secondary'}
                className={
                  source.isActive
                    ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }
              >
                {source.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Creado: {format(new Date(source.createdAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Actualizado: {format(new Date(source.updatedAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-2 dark:border-gray-800">
              <UpdateLeadSourceButton source={source} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadSourceCards;
