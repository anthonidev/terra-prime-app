'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface Props {
  guarantorData: { id: number; name: string } | null;
  disabled: boolean;
  isCreating: boolean;
  onAddGuarantor: () => void;
  isEditing: boolean;
}

export default function GuarantorSection({
  guarantorData,
  disabled,
  isCreating,
  onAddGuarantor,
  isEditing = false
}: Props) {
  if (disabled) return;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Garante (Aval - Opcional)
        </h4>
        <Button
          type="button"
          onClick={onAddGuarantor}
          variant="secondary"
          className="lex disable:cursor-not-allowed items-center gap-2"
          disabled={isCreating}
        >
          <UserCheck className="h-4 w-4" />
          {isEditing ? 'Editar' : 'Agregar'}
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
      ) : null}
    </div>
  );
}
