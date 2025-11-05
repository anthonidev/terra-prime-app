'use client';

import { Key, Plus, AlertCircle } from 'lucide-react';

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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestión de PIN</h1>
            <p className="text-sm text-muted-foreground">PIN de administrador</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Error al cargar el PIN</p>
                <p className="text-xs text-muted-foreground">
                  Intenta recargar la página
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasActivePin = data?.pin !== null && data?.pin !== undefined;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Key className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de PIN</h1>
          <p className="text-sm text-muted-foreground">
            {hasActivePin && data.expiresAt ? 'PIN de administrador activo' : 'Genera el PIN de administrador'}
          </p>
        </div>
      </div>

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
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Key className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">No hay PIN activo</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Genera un PIN para habilitar las operaciones administrativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-lg border">
              <h4 className="text-sm font-medium mb-1.5">¿Qué es el PIN de administrador?</h4>
              <p className="text-xs text-muted-foreground">
                El PIN de administrador es un código de seguridad temporal que permite realizar
                operaciones administrativas sensibles. El PIN tiene una fecha de expiración
                y debe ser regenerado periódicamente por seguridad.
              </p>
            </div>

            <Button
              onClick={handleGeneratePin}
              disabled={isCreating}
              size="sm"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              {isCreating ? 'Generando PIN...' : 'Generar nuevo PIN'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
