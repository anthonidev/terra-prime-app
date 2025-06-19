'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@components/common/PageHeader';
import { Check, Copy, Pin, RefreshCw } from 'lucide-react';
import { usePin } from './hooks/usePin';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';

export default function PinPage() {
  const { pinGenerated, onGenerated, isLoading, existingPin, reloadPin, isLoadingExisting } =
    usePin();

  const [copied, setCopied] = useState<boolean>(false);
  const [copiedExisting, setCopiedExisting] = useState<boolean>(false);

  const handleGeneratePin = async () => await onGenerated();

  const copyToClipboard = (
    pin: string,
    setCopiedState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!pin) return;
    navigator.clipboard.writeText(pin);
    setCopiedState(true);
    toast.success('PIN copiado al portapapeles');
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <PageHeader
        icon={Pin}
        title="Generar PIN"
        subtitle="Administra los códigos PIN para validación en otras áreas"
        variant="gradient"
      />

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Generar nuevo PIN</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGeneratePin} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Generando...' : 'Generar PIN'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-blue-100 bg-blue-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Badge variant="secondary" className="px-3 py-1">
                  PIN Existente
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={reloadPin} disabled={isLoadingExisting}>
                <RefreshCw className={`h-4 w-4 ${isLoadingExisting ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingExisting ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : existingPin ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Código PIN</p>
                  <p className="text-2xl font-bold tracking-wider">{existingPin.pin}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(existingPin.pin ?? '', setCopiedExisting)}
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    {copiedExisting ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Expira el</p>
                  <p className="text-lg font-semibold">
                    {existingPin.expiresAt
                      ? format(new Date(existingPin.expiresAt), 'PPPP', { locale: es })
                      : 'Fecha no disponible'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {existingPin.expiresAt
                      ? format(new Date(existingPin.expiresAt), 'hh:mm a', { locale: es })
                      : 'Hora no disponible'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay un PIN existente</p>
            )}
          </CardContent>
        </Card>

        {/* Mostrar PIN generado recientemente */}
        {pinGenerated && (
          <Card className="border border-green-100 bg-green-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Badge variant="default" className="px-3 py-1">
                  PIN Recién Generado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Código PIN</p>
                  <p className="text-2xl font-bold tracking-wider">{pinGenerated.pin}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(pinGenerated.pin ?? '', setCopied)}
                    className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Expira el</p>
                  <p className="text-lg font-semibold">
                    {pinGenerated.expiresAt
                      ? format(new Date(pinGenerated.expiresAt), 'PPPP', { locale: es })
                      : 'Fecha no disponible'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {pinGenerated.expiresAt
                      ? format(new Date(pinGenerated.expiresAt), 'hh:mm a', { locale: es })
                      : 'Hora no disponible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
