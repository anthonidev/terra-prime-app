import { Card, CardContent } from '@/components/ui/card';
import { LeadsVendorItems } from '@/types/sales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';

type Props = {
  data: LeadsVendorItems[];
};

export default function LeadsVendorCard({ data }: Props) {
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
      {data.map((vendor) => {
        return (
          <Card key={vendor.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {vendor.firstName}&nbsp;{vendor.lastName}
                    </h3>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      Edad: {vendor.age}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Registrado:&nbsp;
                    {format(new Date(vendor.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
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
