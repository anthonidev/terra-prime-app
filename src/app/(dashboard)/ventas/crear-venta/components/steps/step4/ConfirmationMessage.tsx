'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ConfirmationMessageProps {
  isFinanced: boolean;
  installmentsCount?: number;
}

export default function ConfirmationMessage({
  isFinanced,
  installmentsCount = 0
}: ConfirmationMessageProps) {
  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
            <FileText className="h-3 w-3 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Listo para crear la venta
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Revisa todos los datos antes de proceder. Una vez creada la venta, se generará el
              contrato y se
              {isFinanced
                ? ' configurará el cronograma de pagos automáticamente.'
                : ' registrará el pago.'}
            </p>
            {isFinanced && installmentsCount > 0 && (
              <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                Se crearán {installmentsCount} cuotas de financiamiento automáticamente.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
