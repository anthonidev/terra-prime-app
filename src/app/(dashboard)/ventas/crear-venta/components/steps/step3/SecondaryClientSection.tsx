'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, UserPlus, X } from 'lucide-react';

interface Props {
  secondaryClientsData: { id: number; name: string }[];
  disabled: boolean;
  isCreating: boolean;
  onAddSecondaryClient: () => void;
}

export default function SecondaryClientSection({
  secondaryClientsData,
  disabled,
  isCreating,
  onAddSecondaryClient
}: Props) {
  if (disabled) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Co-Compradores</h4>
        <div className="inline-flex items-center justify-center gap-4">
          <Button
            type="button"
            onClick={onAddSecondaryClient}
            disabled={isCreating}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      {secondaryClientsData.length > 0 ? (
        <div className="space-y-3">
          {secondaryClientsData.map((client, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" disabled={isCreating}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Aún no se han generado co-compradores</p>
        </div>
      )}
    </div>
  );
}
