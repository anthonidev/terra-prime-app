'use client';

import { Key, Plus, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/common/page-header';

import { useActivePin } from '../hooks/use-active-pin';
import { useCreatePin } from '../hooks/use-create-pin';
import { PinSkeleton } from './pin-skeleton';
import { PinDisplay } from './pin-display';

export function PinContainer() {
  const { data, isLoading, isError } = useActivePin();
  const { mutate: createPin, isPending: isCreating } = useCreatePin();

  const handleGeneratePin = () => {
    createPin();
  };

  if (isLoading) {
    return <PinSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gestión de PIN" description="PIN de administrador" icon={Key} />

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-destructive text-sm font-medium">Error al cargar el PIN</p>
                <p className="text-muted-foreground text-xs">Intenta recargar la página</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasActivePin = data?.pin !== null && data?.pin !== undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de PIN"
        description={
          hasActivePin && data.expiresAt
            ? 'PIN de administrador activo'
            : 'Genera el PIN de administrador'
        }
        icon={Key}
      />

      {/* Content */}
      {hasActivePin && data.expiresAt ? (
        <PinDisplay
          pin={data.pin!}
          expiresAt={data.expiresAt}
          onRegenerate={handleGeneratePin}
          isRegenerating={isCreating}
        />
      ) : (
        <Card className="max-w-2xl border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                <Key className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">No hay PIN activo</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Genera un PIN para habilitar las operaciones administrativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg border border-dashed p-4">
              <h4 className="mb-1.5 text-sm font-medium">¿Qué es el PIN de administrador?</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                El PIN de administrador es un código de seguridad temporal que permite realizar
                operaciones administrativas sensibles. El PIN tiene una fecha de expiración y debe
                ser regenerado periódicamente por seguridad.
              </p>
            </div>

            <Button onClick={handleGeneratePin} disabled={isCreating} size="sm">
              <Plus className="mr-2 h-3.5 w-3.5" />
              {isCreating ? 'Generando PIN...' : 'Generar nuevo PIN'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
