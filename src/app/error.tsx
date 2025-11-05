'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error para debugging
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Algo salió mal</CardTitle>
          <CardDescription>
            Se ha producido un error inesperado. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm font-medium text-destructive">Error técnico:</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-muted-foreground">
                  ID de error: <span className="font-mono">{error.digest}</span>
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            asChild
            className="w-full sm:w-auto"
            variant="default"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
