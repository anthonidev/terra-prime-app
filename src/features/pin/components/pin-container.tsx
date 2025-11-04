'use client';

import { Key, Plus } from 'lucide-react';

import { PageHeader } from '@/shared/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar el PIN</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  const hasActivePin = data?.pin !== null && data?.pin !== undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de PIN de administrador"
        description="Genera y administra el PIN de acceso para operaciones administrativas"
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
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              No hay PIN activo
            </CardTitle>
            <CardDescription>
              Actualmente no existe un PIN de administrador activo. Genera uno para habilitar las operaciones administrativas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-medium mb-2">¿Qué es el PIN de administrador?</h4>
              <p className="text-sm text-muted-foreground">
                El PIN de administrador es un código de seguridad temporal que permite realizar
                operaciones administrativas sensibles. El PIN tiene una fecha de expiración
                y debe ser regenerado periódicamente por seguridad.
              </p>
            </div>

            <Button
              onClick={handleGeneratePin}
              disabled={isCreating}
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? 'Generando PIN...' : 'Generar nuevo PIN'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
