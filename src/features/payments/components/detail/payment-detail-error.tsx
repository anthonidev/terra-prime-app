import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PaymentDetailError() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/pagos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a pagos
        </Link>
      </Button>

      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al cargar el pago</AlertTitle>
            <AlertDescription>
              Hubo un problema al cargar los detalles del pago. Por favor, intenta nuevamente más
              tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
