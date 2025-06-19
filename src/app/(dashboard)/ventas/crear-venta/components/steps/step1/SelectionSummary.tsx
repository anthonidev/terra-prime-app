'use client';

import { Badge } from '@/components/ui/badge';
import { Project } from '@domain/entities/lotes/project.entity';
import { Block } from '@domain/entities/lotes/block.entity';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { Lot } from '@domain/entities/lotes/lot.entity';
import { CurrencyType } from '@/lib/domain/entities/sales/payment.entity';
import { cn } from '@/lib/utils';

interface SelectionSummaryProps {
  selectedProject: Project | null;
  selectedStage: Stage | null;
  selectedBlock: Block | null;
  selectedLot: Lot | null;
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
  const lotPrice = safeNumber(selectedLot?.lotPrice);
  const urbanizationPrice = safeNumber(selectedLot?.urbanizationPrice);
  const area = safeNumber(selectedLot?.area);

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-200">
        Resumen de Selección
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Proyecto:</span>
          <span className="font-medium">{selectedProject?.name ?? 'no asignado'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Etapa:</span>
          <span className="font-medium">{selectedStage?.name ?? 'no asignado'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Manzana:</span>
          <span className="font-medium">{selectedBlock?.name ?? 'no asignado'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Lote:</span>
          <span className="font-medium">{selectedLot?.name ?? 'no asignado'}</span>
        </div>
        <div className="space-y-2 border-t border-gray-200 pt-2 dark:border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Área:</span>
            <span className="font-medium">{area} m²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Precio Lote:</span>
            <span className="font-medium text-green-600">
              {selectedProject?.currency == CurrencyType.PEN ? 'PEN' : 'USD'}&nbsp;
              {lotPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Habilitación Urbana:</span>
            <span className="font-medium text-blue-600">
              {selectedProject?.currency == CurrencyType.PEN ? 'PEN' : 'USD'}&nbsp;
              {urbanizationPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 text-sm dark:border-gray-600">
            <span className="overflow-hidden bg-gradient-to-r from-[#025864] to-[#00CA7C] bg-clip-text text-xl font-bold whitespace-nowrap text-transparent">
              Total:
            </span>
            <span className="overflow-hidden bg-gradient-to-r from-[#025864] to-[#00CA7C] bg-clip-text text-xl font-bold whitespace-nowrap text-transparent">
              {selectedProject?.currency == CurrencyType.PEN ? 'PEN' : 'USD'}&nbsp;
              {(lotPrice + urbanizationPrice).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div
          className={cn(
            'rounded-sm border p-4 text-sm',
            saleType === 'FINANCED'
              ? 'border-purple-200 bg-purple-50 text-purple-600 dark:border-gray-600 dark:bg-gray-700'
              : 'border-blue-200 bg-blue-50 text-blue-600 dark:border-gray-600 dark:bg-gray-700'
          )}
        >
          <div className="flex items-center gap-2">
            <Badge
              variant={saleType === 'FINANCED' ? 'default' : 'secondary'}
              className={saleType === 'FINANCED' ? 'bg-purple-500' : 'bg-blue-500 text-white'}
            >
              {saleType === 'FINANCED' ? 'Venta Financiada' : 'Pago Directo'}
            </Badge>

            <span className="dark:text-slate-400">
              {saleType === 'FINANCED'
                ? 'Opciones de financiamiento disponibles'
                : 'Pago completo al contado'}
            </span>
          </div>

          {saleType === 'FINANCED' && (
            <p className="mt-2 text-sm opacity-80 dark:text-slate-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
