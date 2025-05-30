'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface GuarantorSectionProps {
  guarantorData: { id: number; name: string } | null;
  isCreating: boolean;
  onAddGuarantor: () => void;
}

export default function GuarantorSection({
  guarantorData,
  isCreating,
  onAddGuarantor
}: GuarantorSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Garante (Aval)</h4>
        <Button
          type="button"
          onClick={onAddGuarantor}
          className="flex items-center gap-2"
          disabled={isCreating}
        >
          <UserCheck className="h-4 w-4" />
          {guarantorData ? 'Editar Garante' : 'Agregar Garante'}
        </Button>
      </div>

      {guarantorData ? (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Garante registrado</p>
                <p className="text-sm text-green-600 dark:text-green-400">{guarantorData.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
          <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Aún no se ha agregado un garante
          </p>
          <p className="text-xs text-gray-400">Haz clic en "Agregar Garante" para continuar</p>
        </div>
      )}
    </div>
  );
}
