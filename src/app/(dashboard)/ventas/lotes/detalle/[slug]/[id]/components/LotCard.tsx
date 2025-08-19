'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LotProject } from '@domain/entities/lotes/lot.entity';
import { CurrencyType } from '@domain/entities/sales/salevendor.entity';
import { Building2, Calendar, CreditCard, DollarSign, MapPin, Ruler, Square } from 'lucide-react';
import { StatusBadge } from '@components/common/table/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
  data: LotProject[];
};

const LotCard = ({ data }: Props) => {
  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron lotes
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
      {data.map((lot) => {
        return (
          <Card key={lot.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Square className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {lot.name}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {lot.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={lot.status} />
                </div>
              </div>

              <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 dark:text-gray-400">Proyecto:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-300">
                    {lot.projectName}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Etapa: <span className="font-medium">{lot.stageName}</span>
                  </span>
                  <span>
                    Manzana: <span className="font-medium">{lot.blockName}</span>
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Ruler className="h-4 w-4" />
                    <span>Área:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {lot.area} m²
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>Precio Lote:</span>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(Number(lot.lotPrice), lot.projectCurrency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span>Precio HU:</span>
                  </div>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(Number(lot.urbanizationPrice), lot.projectCurrency)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <DollarSign className="h-4 w-4" />
                    <span>Precio Total:</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(Number(lot.totalPrice), lot.projectCurrency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Creado: {formatDate(lot.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Actualizado: {formatDate(lot.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LotCard;
