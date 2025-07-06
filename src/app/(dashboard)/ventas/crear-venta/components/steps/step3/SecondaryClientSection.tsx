'use client';

import { Card, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { Switch } from '@components/ui/switch';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  secondaryClientsData: { id: number; name: string }[];
  disabled: boolean;
  isCreating: boolean;
  guarantorEnable: boolean;
  compradorEnable: boolean;
  compradorSwitch: Dispatch<
    SetStateAction<{
      guarantorEnable: boolean;
      compradorEnable: boolean;
    }>
  >;
}

export default function SecondaryClientSection({
  secondaryClientsData,
  disabled,
  isCreating,
  guarantorEnable,
  compradorEnable,
  compradorSwitch
}: Props) {
  if (disabled) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Co-Compradores</h4>
        <div className="inline-flex items-center justify-center gap-4">
          <Switch
            checked={compradorEnable}
            onCheckedChange={() => {
              compradorSwitch({ guarantorEnable, compradorEnable: !compradorEnable });
            }}
            disabled={isCreating || secondaryClientsData.length > 0}
          />
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
