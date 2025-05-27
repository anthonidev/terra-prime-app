'use client';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Leads Page Error:', error);
  }, [error]);

  return (
    <div className="container py-8">
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <AlertCircle className="text-destructive mb-4 h-12 w-12" />
        <h3 className="text-destructive mb-2 text-lg font-semibold">
          No se pudieron cargar los leads
        </h3>
        <p className="text-destructive/80 mb-4">
          {error.message || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
        </p>
        <Button variant="outline" onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
