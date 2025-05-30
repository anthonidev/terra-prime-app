'use client';

import { Badge } from '@/components/ui/badge';
import {
  ProyectsActivesItems,
  ProyectStagesItems,
  ProyectBlocksItems,
  ProyectLotsItems
} from '@/types/sales';

interface SelectionSummaryProps {
  selectedProject: ProyectsActivesItems | null;
  selectedStage: ProyectStagesItems | null;
  selectedBlock: ProyectBlocksItems | null;
  selectedLot: ProyectLotsItems | null;
  saleType: 'DIRECT_PAYMENT' | 'FINANCED';
}

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};
export default function SelectionSummary({
  selectedProject,
  selectedStage,
  selectedBlock,
  selectedLot,
  saleType
}: SelectionSummaryProps) {
  if (!selectedLot) return null;

  const lotPrice = safeNumber(selectedLot.lotPrice);
  const urbanizationPrice = safeNumber(selectedLot.urbanizationPrice);
  const area = safeNumber(selectedLot.area);
  const totalPrice = safeNumber(selectedLot.totalPrice);
  console.log('Total Price:', totalPrice);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-200">
        Resumen de Selección
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Proyecto:</span>
          <span className="font-medium">{selectedProject?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Etapa:</span>
          <span className="font-medium">{selectedStage?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Manzana:</span>
          <span className="font-medium">{selectedBlock?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Lote:</span>
          <span className="font-medium">{selectedLot.name}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Área:</span>
            <span className="font-medium">{area} m²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Precio Lote:</span>
            <span className="font-semibold text-green-600">S/ {lotPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Habilitación Urbana:</span>
            <span className="font-semibold text-blue-600">S/ {urbanizationPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 text-sm dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="text-lg font-bold">
              S/ {(lotPrice + urbanizationPrice).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Badge variant={saleType === 'FINANCED' ? 'default' : 'secondary'}>
          {saleType === 'FINANCED' ? 'Venta Financiada' : 'Pago Directo'}
        </Badge>
      </div>
    </div>
  );
}
